#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# branch-protection.sh
#
# Applies branch protection rules to `main` via the GitHub CLI.
# Enforces:
#   • No direct pushes to main (Base44 must use PRs going forward)
#   • Orchestrator + Conflict Detector checks must pass
#   • At least 1 approval required (auto-review bot counts)
#   • Linear history (no merge commits, keeps git log clean)
#
# Usage:
#   ./scripts/branch-protection.sh --repo owner/repo-name
#
# Requirements:
#   - gh CLI authenticated with admin access to the repo
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

[[ -z "$REPO" ]] && { echo "❌ --repo is required (e.g. myorg/myrepo)"; exit 1; }

OWNER="${REPO%%/*}"
REPO_NAME="${REPO##*/}"

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║       🔐 Branch Protection Setup for main            ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "  Repo:  $REPO"
echo ""

# ── Check gh is authenticated ─────────────────────────────────────────────────
if ! gh auth status &>/dev/null; then
  echo "❌ Not authenticated. Run: gh auth login"
  exit 1
fi

echo "✅ gh CLI authenticated"
echo ""

# ── Apply branch protection via REST API ─────────────────────────────────────
echo "📋 Applying protection rules to main..."

gh api \
  --method PUT \
  "/repos/$OWNER/$REPO_NAME/branches/main/protection" \
  --header "Accept: application/vnd.github+json" \
  --field 'required_status_checks[strict]=true' \
  --field 'required_status_checks[contexts][]=🔍 Identify Agent & Acquire Lock' \
  --field 'required_status_checks[contexts][]=🚧 Conflict Detection' \
  --field 'required_status_checks[contexts][]=Scan for File Conflicts' \
  --field 'enforce_admins=false' \
  --field 'required_pull_request_reviews[required_approving_review_count]=1' \
  --field 'required_pull_request_reviews[dismiss_stale_reviews]=true' \
  --field 'required_pull_request_reviews[require_code_owner_reviews=false' \
  --field 'required_linear_history=true' \
  --field 'allow_force_pushes=false' \
  --field 'allow_deletions=false' \
  --field 'block_creations=false' \
  --field 'restrictions=null' \
  > /dev/null

echo "✅ Branch protection rules applied!"
echo ""

# ── Apply ruleset (newer GitHub approach, coexists with above) ────────────────
echo "📋 Applying ruleset (Merge Queue + required workflows)..."

gh api \
  --method POST \
  "/repos/$OWNER/$REPO_NAME/rulesets" \
  --header "Accept: application/vnd.github+json" \
  --input - <<EOF
{
  "name": "Agent Orchestrator Rules",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "required_linear_history" },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [
          { "context": "🔍 Identify Agent & Acquire Lock" },
          { "context": "🚧 Conflict Detection" },
          { "context": "Scan for File Conflicts" }
        ]
      }
    },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "allowed_merge_methods": ["squash", "rebase"]
      }
    }
  ]
}
EOF

echo "✅ Ruleset applied!"
echo ""

# ── Summary ───────────────────────────────────────────────────────────────────
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  ✅  Branch Protection Active on main                ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "  Rules enforced:"
echo "  • ✋ No direct pushes to main (PRs required)"
echo "  • ✅ Orchestrator check must pass"
echo "  • ✅ Conflict Detector must pass"
echo "  • 👁  1 approval required (auto-review bot counts)"
echo "  • 📐 Linear history only (squash/rebase merges)"
echo "  • 🚫 Force pushes blocked"
echo "  • 🚫 Branch deletion blocked"
echo ""
echo "  ⚠️  NOTE: Base44 will now need to push to a branch and"
echo "  open a PR. Update your Base44 config to push to:"
echo "  'base44/auto-YYYYMMDD' branches instead of main."
echo ""
echo "  View rules: https://github.com/$REPO/settings/branches"
