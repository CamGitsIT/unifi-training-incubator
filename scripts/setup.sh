#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# setup.sh  —  One-command orchestrator install
#
# What this does:
#   1. Verifies prerequisites (gh CLI, git, curl, jq)
#   2. Copies GitHub Actions workflows to your repo
#   3. Sets up branch protection rules on main
#   4. Adds required GitHub Actions secrets (interactive)
#   5. Makes dispatch scripts executable
#   6. Runs a smoke test
#
# Usage (run from your repo root):
#   curl -fsSL https://raw.githubusercontent.com/YOU/REPO/main/scripts/setup.sh | bash
#   — OR —
#   ./scripts/setup.sh --repo owner/repo-name
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO=""
SKIP_SECRETS=false
SKIP_PROTECTION=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)             REPO="$2";       shift 2 ;;
    --skip-secrets)     SKIP_SECRETS=true; shift ;;
    --skip-protection)  SKIP_PROTECTION=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🤖  Agent Orchestrator — Setup Script                  ║"
echo "║   Base44 + OpenAI Codex + GitHub Actions                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# ── Detect repo if not passed ─────────────────────────────────────────────────
if [[ -z "$REPO" ]]; then
  if git remote get-url origin &>/dev/null; then
    REMOTE=$(git remote get-url origin)
    # Handle both SSH and HTTPS
    REPO=$(echo "$REMOTE" | sed -E 's|git@github.com:||;s|https://github.com/||;s|\.git$||')
    echo "  📂 Detected repo: $REPO"
  else
    echo "  ❌ Could not detect repo. Run from your repo root or pass --repo owner/name"
    exit 1
  fi
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Step 1: Prerequisites ─────────────────────────────────────────────────────
echo "[ 1/6 ] Checking prerequisites..."
echo ""

MISSING=()
for cmd in gh git curl jq; do
  if command -v "$cmd" &>/dev/null; then
    echo "  ✅ $cmd $(${cmd} --version 2>&1 | head -1)"
  else
    echo "  ❌ $cmd — NOT FOUND"
    MISSING+=("$cmd")
  fi
done

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo ""
  echo "  Install missing tools:"
  for m in "${MISSING[@]}"; do
    case "$m" in
      gh)   echo "    brew install gh   OR   https://cli.github.com" ;;
      jq)   echo "    brew install jq   OR   apt install jq" ;;
      curl) echo "    brew install curl OR   apt install curl" ;;
    esac
  done
  exit 1
fi

echo ""
if ! gh auth status &>/dev/null; then
  echo "  ❌ gh not authenticated. Run: gh auth login"
  exit 1
fi
echo "  ✅ gh authenticated"

# ── Step 2: Copy workflows ─────────────────────────────────────────────────────
echo ""
echo "[ 2/6 ] Installing GitHub Actions workflows..."
echo ""

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
WORKFLOW_DIR="$REPO_ROOT/.github/workflows"
mkdir -p "$WORKFLOW_DIR"

for wf in orchestrator.yml conflict-detector.yml; do
  SRC="$SCRIPT_DIR/../.github/workflows/$wf"
  DST="$WORKFLOW_DIR/$wf"
  if [[ -f "$SRC" ]]; then
    cp "$SRC" "$DST"
    echo "  ✅ Installed .github/workflows/$wf"
  else
    echo "  ⚠️  Source not found: $SRC (skipping)"
  fi
done

# ── Step 3: Make scripts executable ───────────────────────────────────────────
echo ""
echo "[ 3/6 ] Making scripts executable..."
chmod +x "$SCRIPT_DIR"/*.sh
echo "  ✅ Done"

# ── Step 4: Add secrets ───────────────────────────────────────────────────────
echo ""
echo "[ 4/6 ] GitHub Actions secrets..."
echo ""

if [[ "$SKIP_SECRETS" == "true" ]]; then
  echo "  ⏭  Skipping (--skip-secrets passed)"
else
  # OPENAI_API_KEY
  read -r -p "  Enter your OPENAI_API_KEY (or press Enter to skip): " OAI_KEY
  if [[ -n "$OAI_KEY" ]]; then
    echo "$OAI_KEY" | gh secret set OPENAI_API_KEY --repo "$REPO"
    echo "  ✅ OPENAI_API_KEY saved"
  fi

  # SLACK_WEBHOOK_URL
  read -r -p "  Enter Slack Webhook URL (or press Enter to skip): " SLACK_URL
  if [[ -n "$SLACK_URL" ]]; then
    echo "$SLACK_URL" | gh secret set SLACK_WEBHOOK_URL --repo "$REPO"
    echo "  ✅ SLACK_WEBHOOK_URL saved"
  fi

  echo "  💡 To add secrets later:  gh secret set SECRET_NAME --repo $REPO"
fi

# ── Step 5: Branch protection ─────────────────────────────────────────────────
echo ""
echo "[ 5/6 ] Branch protection on main..."
echo ""

if [[ "$SKIP_PROTECTION" == "true" ]]; then
  echo "  ⏭  Skipping (--skip-protection passed)"
else
  read -r -p "  Apply branch protection rules to main? (y/N) " CONFIRM_BP
  if [[ "$CONFIRM_BP" == "y" || "$CONFIRM_BP" == "Y" ]]; then
    bash "$SCRIPT_DIR/branch-protection.sh" --repo "$REPO"
  else
    echo "  ⏭  Skipped. Run later: ./scripts/branch-protection.sh --repo $REPO"
  fi
fi

# ── Step 6: Commit and push workflows ─────────────────────────────────────────
echo ""
echo "[ 6/6 ] Committing workflows to repo..."
echo ""

cd "$REPO_ROOT"
git add .github/workflows/orchestrator.yml .github/workflows/conflict-detector.yml 2>/dev/null || true

if git diff --cached --quiet; then
  echo "  ℹ️  No changes to commit (workflows already up to date)"
else
  read -r -p "  Commit and push workflows to main? (y/N) " CONFIRM_PUSH
  if [[ "$CONFIRM_PUSH" == "y" || "$CONFIRM_PUSH" == "Y" ]]; then
    git commit -m "[orchestrator] Install Agent Orchestrator workflows"
    git push origin main
    echo "  ✅ Pushed!"
  else
    echo "  ⏭  Skipped. Commit manually when ready."
  fi
fi

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🎉  Orchestrator Setup Complete!                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "  What happens now:"
echo ""
echo "  • Every push or PR to main runs the orchestrator"
echo "  • Only ONE agent job runs at a time (concurrency lock)"
echo "  • Conflict detector scans every push for file overlaps"
echo "  • PRs get auto-reviewed and approved/blocked"
echo "  • Slack gets notified on any conflict"
echo ""
echo "  To dispatch a Codex task (lock-aware):"
echo "  $ ./scripts/codex-dispatch.sh \\"
echo "      --repo  \"$REPO\" \\"
echo "      --task  \"Your task description here\" \\"
echo "      --files \"src/app.js,src/styles.css\"   # optional"
echo ""
echo "  Docs: https://github.com/$REPO/actions"
echo ""
