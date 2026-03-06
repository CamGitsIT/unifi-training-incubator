#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# codex-dispatch.sh
#
# Submits a task to OpenAI Codex (cloud agent) ONLY when the orchestrator
# lock on main is clear. Prevents Codex from pushing while Base44 is active.
#
# Usage:
#   ./scripts/codex-dispatch.sh \
#     --repo    "owner/repo-name" \
#     --task    "Add a dark mode toggle to the settings page" \
#     --files   "src/settings.js,src/theme.css"   # optional: scope files
#
# Requirements:
#   - gh CLI authenticated (gh auth login)
#   - OPENAI_API_KEY set in environment or .env file
#   - CODEX_ORG_ID set (your OpenAI org ID)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Load .env if present ──────────────────────────────────────────────────────
if [[ -f ".env" ]]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)
fi

# ── Defaults ──────────────────────────────────────────────────────────────────
REPO=""
TASK=""
FILES=""
MAX_WAIT=300   # seconds to wait for lock (5 min)
POLL_INTERVAL=15
BRANCH_PREFIX="codex/task"

# ── Parse args ────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)   REPO="$2";   shift 2 ;;
    --task)   TASK="$2";   shift 2 ;;
    --files)  FILES="$2";  shift 2 ;;
    --wait)   MAX_WAIT="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ── Validate ──────────────────────────────────────────────────────────────────
[[ -z "$REPO"  ]] && { echo "❌ --repo is required (e.g. myorg/myrepo)"; exit 1; }
[[ -z "$TASK"  ]] && { echo "❌ --task is required"; exit 1; }
[[ -z "${OPENAI_API_KEY:-}" ]] && { echo "❌ OPENAI_API_KEY not set"; exit 1; }

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║         🤖 Codex Dispatch — Orchestrator Guard        ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "  Repo:  $REPO"
echo "  Task:  $TASK"
[[ -n "$FILES" ]] && echo "  Files: $FILES"
echo ""

# ── Step 1: Check if orchestrator lock is free ────────────────────────────────
echo "⏳ Checking orchestrator lock on main..."
ELAPSED=0

while true; do
  # Check for any in-progress runs on main
  RUNNING=$(gh run list \
    --repo "$REPO" \
    --branch main \
    --status in_progress \
    --json databaseId,name \
    --jq 'length' 2>/dev/null || echo "0")

  QUEUED=$(gh run list \
    --repo "$REPO" \
    --branch main \
    --status queued \
    --json databaseId,name \
    --jq 'length' 2>/dev/null || echo "0")

  TOTAL=$((RUNNING + QUEUED))

  if [[ "$TOTAL" -eq 0 ]]; then
    echo "✅ Lock is FREE — proceeding to dispatch Codex task"
    break
  fi

  if [[ "$ELAPSED" -ge "$MAX_WAIT" ]]; then
    echo "⏰ Timeout after ${MAX_WAIT}s — lock still held by $TOTAL run(s)"
    echo "   Re-run this script when the current agent finishes, or increase --wait"
    exit 1
  fi

  echo "   🔒 Lock held ($TOTAL active runs). Waiting ${POLL_INTERVAL}s... [${ELAPSED}/${MAX_WAIT}s]"
  sleep "$POLL_INTERVAL"
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

# ── Step 2: Check for hot files (recently touched) ────────────────────────────
if [[ -n "$FILES" ]]; then
  echo ""
  echo "🔍 Checking if requested files are recently modified by other agents..."

  # Get files touched in last 5 commits on main
  RECENT_FILES=$(gh api "repos/$REPO/commits?sha=main&per_page=5" \
    --jq '.[].sha' 2>/dev/null | head -5 | while read -r SHA; do
      gh api "repos/$REPO/commits/$SHA" --jq '.files[].filename' 2>/dev/null
    done | sort -u || echo "")

  IFS=',' read -ra REQUESTED_FILES <<< "$FILES"
  CONFLICTS=""
  for f in "${REQUESTED_FILES[@]}"; do
    f=$(echo "$f" | xargs)  # trim whitespace
    if echo "$RECENT_FILES" | grep -qxF "$f"; then
      CONFLICTS="$CONFLICTS $f"
    fi
  done

  if [[ -n "$CONFLICTS" ]]; then
    echo ""
    echo "⚠️  WARNING: These files were recently touched on main:"
    echo "   $CONFLICTS"
    echo ""
    read -r -p "   Continue anyway? (y/N) " CONFIRM
    [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]] && { echo "Cancelled."; exit 0; }
  else
    echo "✅ No file conflicts detected — all requested files are clean"
  fi
fi

# ── Step 3: Create a Codex task via OpenAI API ────────────────────────────────
echo ""
echo "🚀 Dispatching task to Codex..."
echo ""

TASK_SLUG=$(echo "$TASK" | tr '[:upper:] ' '[:lower:]-' | tr -cd '[:alnum:]-' | cut -c1-40)
BRANCH_NAME="${BRANCH_PREFIX}-$(date +%Y%m%d-%H%M%S)-${TASK_SLUG}"

# Build the Codex task payload
PAYLOAD=$(jq -n \
  --arg task   "$TASK" \
  --arg repo   "https://github.com/$REPO" \
  --arg branch "$BRANCH_NAME" \
  --arg files  "$FILES" \
  '{
    model: "codex-1",
    input: (
      "Repository: " + $repo + "\n" +
      "Target branch to create: " + $branch + "\n" +
      (if $files != "" then "Only modify these files: " + $files + "\n" else "" end) +
      "\nTask:\n" + $task + "\n\n" +
      "IMPORTANT:\n" +
      "- Create a new branch named: " + $branch + "\n" +
      "- Do NOT push directly to main\n" +
      "- Open a pull request from your branch to main when done\n" +
      "- Prefix your commit messages with [codex]\n" +
      "- Keep changes minimal and scoped to the task"
    ),
    reasoning: { effort: "medium", summary: "auto" }
  }')

RESPONSE=$(curl -s \
  -X POST "https://api.openai.com/v1/responses" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

TASK_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null || echo "")

if [[ -z "$TASK_ID" ]]; then
  echo "❌ Failed to dispatch Codex task. API response:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

# ── Step 4: Log & summarize ───────────────────────────────────────────────────
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  ✅  Codex Task Dispatched Successfully               ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "  Task ID:  $TASK_ID"
echo "  Branch:   $BRANCH_NAME"
echo "  Task:     $TASK"
echo ""
echo "  Codex will:"
echo "  1. Clone the repo"
echo "  2. Create branch: $BRANCH_NAME"
echo "  3. Implement the task"
echo "  4. Open a PR → main (triggers orchestrator + auto-review)"
echo ""
echo "  Monitor at: https://platform.openai.com/codex"
echo "  PR will appear at: https://github.com/$REPO/pulls"
echo ""

# Save dispatch log
LOG_FILE="${HOME}/.codex-dispatch.log"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | TASK_ID=$TASK_ID | BRANCH=$BRANCH_NAME | TASK=$TASK" >> "$LOG_FILE"
echo "  📝 Logged to $LOG_FILE"
