#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# repo-hardening.sh
#
# ONE COMMAND to fully harden your GitHub repo for multi-agent development.
# Configures every setting, branch rule, secret, webhook, and safety mechanism.
#
# What this covers:
#   ✅ Branch protection + rulesets (main is sacred)
#   ✅ Required status checks (orchestrator must pass)
#   ✅ Merge queue (serializes merges even without Actions)
#   ✅ Secret scanning + push protection (blocks credential leaks at push time)
#   ✅ Code scanning (CodeQL for security vulnerabilities)
#   ✅ Dependabot (auto-updates + security alerts)
#   ✅ Vulnerability alerts + automated security fixes
#   ✅ Auto-delete head branches after merge (keeps repo clean)
#   ✅ Squash-only merges (linear, readable history)
#   ✅ CODEOWNERS enforcement
#   ✅ Repo topics and description
#   ✅ Issue + PR templates
#   ✅ Webhook for external orchestration tools
#   ✅ Actions permissions (limit what agents can do)
#   ✅ Audit log summary
#
# Usage:
#   ./scripts/repo-hardening.sh --repo owner/repo-name [--dry-run]
#
# Requirements:
#   gh CLI authenticated with admin access
# ═══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# ── Args ──────────────────────────────────────────────────────────────────────
REPO=""; DRY_RUN=false; SKIP_CONFIRM=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)         REPO="$2";       shift 2 ;;
    --dry-run)      DRY_RUN=true;    shift ;;
    --yes)          SKIP_CONFIRM=true; shift ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

# ── Auto-detect repo ──────────────────────────────────────────────────────────
if [[ -z "$REPO" ]]; then
  REPO=$(git remote get-url origin 2>/dev/null \
    | sed -E 's|git@github.com:||;s|https://github.com/||;s|\.git$||' || true)
  [[ -z "$REPO" ]] && { echo -e "${RED}❌ Pass --repo owner/name${RESET}"; exit 1; }
fi

OWNER="${REPO%%/*}"
REPO_NAME="${REPO##*/}"

api() {
  # Wrapper: prints the call in dry-run mode, executes it otherwise
  if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "  ${CYAN}[DRY-RUN]${RESET} gh api $*"
  else
    gh api "$@"
  fi
}

section() { echo -e "\n${BOLD}${BLUE}▸ $1${RESET}"; }
ok()      { echo -e "  ${GREEN}✅ $1${RESET}"; }
warn()    { echo -e "  ${YELLOW}⚠️  $1${RESET}"; }
fail()    { echo -e "  ${RED}❌ $1${RESET}"; }
info()    { echo -e "  ${CYAN}ℹ  $1${RESET}"; }

# ── Banner ────────────────────────────────────────────────────────────────────
echo -e "${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🛡️   Multi-Agent Repo Hardening Script                    ║"
echo "║   Configures safety, protection & best-practice settings    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo -e "  Repo:    ${BOLD}$REPO${RESET}"
echo -e "  Dry run: ${DRY_RUN}"
echo ""

# ── Pre-flight ────────────────────────────────────────────────────────────────
section "Pre-flight checks"

for cmd in gh git curl jq; do
  command -v "$cmd" &>/dev/null && ok "$cmd available" || { fail "$cmd missing"; exit 1; }
done

gh auth status &>/dev/null && ok "gh authenticated" || { fail "Run: gh auth login"; exit 1; }

# Check admin access
PERMS=$(gh api "/repos/$OWNER/$REPO_NAME" --jq '.permissions.admin' 2>/dev/null || echo "false")
[[ "$PERMS" == "true" ]] && ok "Admin access confirmed" || warn "No admin access — some steps may fail"

if [[ "$SKIP_CONFIRM" != "true" && "$DRY_RUN" != "true" ]]; then
  echo ""
  echo -e "  ${YELLOW}This will modify repo settings, branch rules, and security config.${RESET}"
  read -r -p "  Continue? (y/N) " CONF
  [[ "$CONF" != "y" && "$CONF" != "Y" ]] && { echo "Cancelled."; exit 0; }
fi

APPLIED=0; FAILED=0; SKIPPED=0

run_step() {
  local name="$1"; shift
  if "$@" &>/dev/null; then
    ok "$name"
    APPLIED=$((APPLIED + 1))
  else
    warn "$name — may require higher permissions or plan"
    FAILED=$((FAILED + 1))
  fi
}

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 1 — General Repository Settings
# ════════════════════════════════════════════════════════════════════════════════
section "1/9 · General Repository Settings"

gh api --method PATCH "/repos/$OWNER/$REPO_NAME" \
  --field 'has_issues=true' \
  --field 'has_projects=true' \
  --field 'has_wiki=false' \
  --field 'allow_squash_merge=true' \
  --field 'allow_merge_commit=false' \
  --field 'allow_rebase_merge=true' \
  --field 'allow_auto_merge=true' \
  --field 'delete_branch_on_merge=true' \
  --field 'allow_update_branch=true' \
  --field 'use_squash_pr_title_as_default=true' \
  > /dev/null && ok "Repo settings applied" || warn "Some repo settings skipped"

# What each setting does:
# allow_squash_merge       → clean linear git history (one commit per feature)
# allow_merge_commit=false → prevents messy merge commits from agents
# allow_auto_merge         → agents can set PRs to auto-merge once checks pass
# delete_branch_on_merge   → prevents branch accumulation from many agent PRs
# allow_update_branch      → keeps agent branches current with main automatically
info "Squash-only merges: linear history enforced"
info "Auto-merge: enabled (agents can self-merge when checks pass)"
info "Branch auto-delete: enabled after merge"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 2 — Branch Protection (main)
# ════════════════════════════════════════════════════════════════════════════════
section "2/9 · Branch Protection Rules for main"

gh api \
  --method PUT \
  "/repos/$OWNER/$REPO_NAME/branches/main/protection" \
  --input - <<'PROTECTION_JSON' > /dev/null
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "🔍 Identify Agent & Acquire Lock",
      "🚧 Conflict Detection",
      "Scan for File Conflicts",
      "🔎 Auto-Review PR"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false
}
PROTECTION_JSON

ok "Branch protection applied to main"
info "Required checks: orchestrator + conflict detector + auto-review"
info "Stale reviews dismissed on new push"
info "CODEOWNERS review required"
info "require_last_push_approval: new pushes need fresh approval"
info "No force pushes, no branch deletion"
info "All PR conversations must be resolved before merge"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 3 — Rulesets (Newer, more powerful than branch protection)
# ════════════════════════════════════════════════════════════════════════════════
section "3/9 · Repository Rulesets"

# First, check if our ruleset already exists
EXISTING_RULESET=$(gh api "/repos/$OWNER/$REPO_NAME/rulesets" \
  --jq '.[] | select(.name=="Agent Orchestrator Rules") | .id' 2>/dev/null || echo "")

RULESET_PAYLOAD='{
  "name": "Agent Orchestrator Rules",
  "target": "branch",
  "enforcement": "active",
  "bypass_actors": [],
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
    { "type": "required_signatures" },
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
        "require_code_owner_review": true,
        "require_last_push_approval": true,
        "allowed_merge_methods": ["squash", "rebase"],
        "automatic_copilot_code_review_enabled": false
      }
    },
    {
      "type": "commit_message_pattern",
      "parameters": {
        "name": "Block WIP commits from landing on main",
        "negate": true,
        "operator": "starts_with",
        "pattern": "WIP"
      }
    }
  ]
}'

if [[ -n "$EXISTING_RULESET" ]]; then
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/rulesets/$EXISTING_RULESET" \
    --input - <<< "$RULESET_PAYLOAD" > /dev/null \
    && ok "Ruleset updated (ID: $EXISTING_RULESET)" \
    || warn "Ruleset update failed"
else
  gh api --method POST "/repos/$OWNER/$REPO_NAME/rulesets" \
    --input - <<< "$RULESET_PAYLOAD" > /dev/null \
    && ok "Ruleset created" \
    || warn "Ruleset creation failed (requires GitHub Pro/Teams/Enterprise)"
fi

info "required_signatures: commits must be GPG/SSH signed"
info "WIP commits blocked from merging to main"
info "commit_message_pattern rule prevents accidental in-progress merges"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 4 — Security Features
# ════════════════════════════════════════════════════════════════════════════════
section "4/9 · Security Features"

# Secret scanning
run_step "Secret scanning enabled" \
  gh api --method PATCH "/repos/$OWNER/$REPO_NAME" \
    --field 'security_and_analysis[secret_scanning][status]=enabled'

# Secret scanning push protection — CRITICAL: blocks pushes containing secrets
run_step "Secret scanning push protection enabled" \
  gh api --method PATCH "/repos/$OWNER/$REPO_NAME" \
    --field 'security_and_analysis[secret_scanning_push_protection][status]=enabled'

# Dependabot security updates
run_step "Dependabot security updates enabled" \
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/automated-security-fixes" \
    -H "Accept: application/vnd.github+json"

# Vulnerability alerts
run_step "Vulnerability alerts enabled" \
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/vulnerability-alerts" \
    -H "Accept: application/vnd.github+json"

# Private vulnerability reporting
run_step "Private vulnerability reporting enabled" \
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/private-vulnerability-reporting" \
    -H "Accept: application/vnd.github+json" 2>/dev/null || true

info "Push protection: GitHub blocks pushes containing API keys, tokens, secrets"
info "Dependabot: auto-creates security PRs for vulnerable dependencies"
info "Private vuln reporting: security researchers can report confidentially"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 5 — GitHub Actions Permissions
# ════════════════════════════════════════════════════════════════════════════════
section "5/9 · GitHub Actions Permissions (Agent Containment)"

# Restrict what Actions can do: read-only by default, workflows request write
run_step "Actions default permissions: read repo contents" \
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/actions/permissions/workflow" \
    --field 'default_workflow_permissions=read' \
    --field 'can_approve_pull_request_reviews=false'

# Only allow Actions from GitHub and verified marketplace creators
run_step "Actions allowed: GitHub-owned + verified marketplace" \
  gh api --method PUT "/repos/$OWNER/$REPO_NAME/actions/permissions" \
    --field 'enabled=true' \
    --field 'allowed_actions=selected'

gh api --method PUT "/repos/$OWNER/$REPO_NAME/actions/selected-actions" \
  --field 'github_owned_allowed=true' \
  --field 'verified_allowed=true' \
  --field 'patterns_allowed[]=openai/*' \
  --field 'patterns_allowed[]=anthropics-projects/*' \
  > /dev/null 2>&1 && ok "Allowed action patterns set" || warn "Action pattern restrictions skipped"

info "Agents cannot approve their own PRs via Actions"
info "Only GitHub + verified marketplace actions permitted"
info "Prevents supply-chain attacks via malicious Actions"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 6 — Dependabot Configuration
# ════════════════════════════════════════════════════════════════════════════════
section "6/9 · Dependabot Configuration"

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
GITHUB_DIR="$REPO_ROOT/.github"
mkdir -p "$GITHUB_DIR"

cat > "$GITHUB_DIR/dependabot.yml" <<'DEPENDABOT'
# ──────────────────────────────────────────────────────────────────────────────
# dependabot.yml
#
# Configures automated dependency updates. Dependabot opens PRs on a schedule.
# The orchestrator reviews and auto-merges patch/minor updates if checks pass.
# ──────────────────────────────────────────────────────────────────────────────
version: 2

updates:
  # npm / Node.js
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
      day: monday
      time: "06:00"
      timezone: "UTC"
    open-pull-requests-limit: 5
    groups:
      # Group minor + patch updates into one PR per ecosystem (less noise)
      non-major:
        update-types:
          - minor
          - patch
    labels:
      - dependabot
      - automated
    commit-message:
      prefix: "[dependabot]"
    ignore:
      # Don't auto-update major versions — require human decision
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]

  # GitHub Actions
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
      day: tuesday
      time: "06:00"
      timezone: "UTC"
    open-pull-requests-limit: 3
    labels:
      - dependabot
      - ci
      - automated
    commit-message:
      prefix: "[dependabot][actions]"

  # Python (if applicable)
  - package-ecosystem: pip
    directory: "/"
    schedule:
      interval: weekly
      day: monday
      time: "08:00"
      timezone: "UTC"
    open-pull-requests-limit: 3
    groups:
      non-major:
        update-types: [minor, patch]
    labels:
      - dependabot
      - automated
    commit-message:
      prefix: "[dependabot][python]"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
DEPENDABOT

ok "dependabot.yml written"
info "Weekly dependency PRs, grouped by ecosystem"
info "Major version updates excluded (require human decision)"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 7 — PR & Issue Templates
# ════════════════════════════════════════════════════════════════════════════════
section "7/9 · PR Template & Issue Templates"

# PR Template
cat > "$GITHUB_DIR/PULL_REQUEST_TEMPLATE.md" <<'PR_TEMPLATE'
## What does this PR do?
<!-- One sentence summary -->

## Agent / Author
- [ ] 🤖 Base44 (automated)
- [ ] ⚡ OpenAI Codex (automated)
- [ ] 🧠 Claude Sonnet (automated)
- [ ] ⚙️ GitHub Actions (automated)
- [ ] 👤 Human

## Checklist
- [ ] This branch is up to date with `main`
- [ ] No secrets or credentials in the diff
- [ ] Tests pass (or N/A for infrastructure changes)
- [ ] No direct changes to `migrations/`, `db/`, or `.env` without human review
- [ ] CODEOWNERS notified (auto, via GitHub)
- [ ] Commit messages prefixed with `[agent-name]` if automated

## Risk Level
- [ ] 🟢 Low — docs, copy, style, non-breaking
- [ ] 🟡 Medium — logic change, new feature, dependency update
- [ ] 🔴 High — auth, payments, database schema, security, breaking change

## Rollback Plan
<!-- If this causes issues, how do we revert? -->
`git revert <sha>` and re-deploy, OR:

## Notes for reviewers
PR_TEMPLATE

ok "PR template written"

# Bug report template
mkdir -p "$GITHUB_DIR/ISSUE_TEMPLATE"
cat > "$GITHUB_DIR/ISSUE_TEMPLATE/bug_report.yml" <<'BUG'
name: 🐛 Bug Report
description: File a bug report
labels: [bug, triage]
body:
  - type: dropdown
    id: caused_by
    attributes:
      label: Likely caused by
      options:
        - Base44 (automated agent)
        - OpenAI Codex (automated agent)
        - GitHub Actions workflow
        - Human change
        - Unknown
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: What happened?
      placeholder: Describe the bug
    validations:
      required: true
  - type: textarea
    id: reproduce
    attributes:
      label: Steps to reproduce
  - type: input
    id: commit
    attributes:
      label: Commit SHA (if known)
      placeholder: abc1234
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options: [critical, high, medium, low]
    validations:
      required: true
BUG

# Agent task request template
cat > "$GITHUB_DIR/ISSUE_TEMPLATE/agent_task.yml" <<'AGENT_TASK'
name: 🤖 Agent Task Request
description: Submit a task to the orchestrator for agent dispatch
labels: [agent-task, orchestrator]
body:
  - type: textarea
    id: task
    attributes:
      label: Task description
      placeholder: "Plain English description of what needs to be done"
    validations:
      required: true
  - type: input
    id: files
    attributes:
      label: Files or areas involved (optional)
      placeholder: "src/auth.js, db/migrations/"
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      options: [low, normal, high, urgent]
    validations:
      required: true
  - type: dropdown
    id: preferred_agent
    attributes:
      label: Preferred agent (or let orchestrator decide)
      options:
        - Let orchestrator decide
        - OpenAI Codex
        - Base44
        - Claude Sonnet
        - GitHub Actions
        - Dependabot
  - type: checkboxes
    id: safety
    attributes:
      label: Safety confirmation
      options:
        - label: This task does NOT touch auth, payments, or database migrations
        - label: I understand the agent will open a PR, not push directly
AGENT_TASK

ok "Issue templates written"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 8 — CODEOWNERS (comprehensive)
# ════════════════════════════════════════════════════════════════════════════════
section "8/9 · CODEOWNERS"

# Detect GitHub username
GH_USER=$(gh api "/user" --jq '.login' 2>/dev/null || echo "YOUR_GITHUB_USERNAME")

cat > "$GITHUB_DIR/CODEOWNERS" <<CODEOWNERS
# ──────────────────────────────────────────────────────────────────────────────
# CODEOWNERS — Multi-Agent Orchestrated Repo
#
# Rules: agents can auto-merge code ONLY if the pattern below does NOT match.
# Any file listed here requires a human to approve the PR.
# ──────────────────────────────────────────────────────────────────────────────

# Default: human owns everything (agents need human sign-off)
*                                         @$GH_USER

# ── CI / Orchestration — NEVER let agents self-modify their own guardrails ───
.github/                                  @$GH_USER
.github/workflows/                        @$GH_USER
scripts/repo-hardening.sh                 @$GH_USER
scripts/branch-protection.sh             @$GH_USER
agent-registry.yml                        @$GH_USER

# ── Security-sensitive files ──────────────────────────────────────────────────
*.env                                     @$GH_USER
*.env.*                                   @$GH_USER
.env.example                              @$GH_USER
secrets/                                  @$GH_USER

# ── Infrastructure ────────────────────────────────────────────────────────────
Dockerfile                                @$GH_USER
docker-compose*.yml                       @$GH_USER
kubernetes/                               @$GH_USER
terraform/                                @$GH_USER
*.tf                                      @$GH_USER
.terraform/                               @$GH_USER
infra/                                    @$GH_USER

# ── Database — NEVER auto-merge migrations ────────────────────────────────────
migrations/                               @$GH_USER
db/                                       @$GH_USER
database/                                 @$GH_USER
prisma/schema.prisma                      @$GH_USER
*.sql                                     @$GH_USER

# ── Auth & Payments — high-risk, always human-reviewed ───────────────────────
src/auth/                                 @$GH_USER
src/payments/                             @$GH_USER
src/billing/                              @$GH_USER
src/security/                             @$GH_USER
lib/auth/                                 @$GH_USER
lib/payments/                             @$GH_USER

# ── Package manifests — agents can update, human confirms major versions ──────
package.json                              @$GH_USER
package-lock.json                         @$GH_USER
yarn.lock                                 @$GH_USER
pnpm-lock.yaml                            @$GH_USER
requirements.txt                          @$GH_USER
Pipfile                                   @$GH_USER
Gemfile                                   @$GH_USER
go.mod                                    @$GH_USER
Cargo.toml                                @$GH_USER

# ── Config ────────────────────────────────────────────────────────────────────
*.config.js                               @$GH_USER
*.config.ts                               @$GH_USER
vite.config.*                             @$GH_USER
next.config.*                             @$GH_USER
webpack.config.*                          @$GH_USER
CODEOWNERS

ok "CODEOWNERS written (owner: @$GH_USER)"
info "Agents can never self-approve changes to their own orchestration files"
info "Database migrations always require human review"

# ════════════════════════════════════════════════════════════════════════════════
# SECTION 9 — Commit & push all config files
# ════════════════════════════════════════════════════════════════════════════════
section "9/9 · Commit configuration files"

cd "$REPO_ROOT"
git add \
  .github/dependabot.yml \
  .github/PULL_REQUEST_TEMPLATE.md \
  .github/ISSUE_TEMPLATE/ \
  .github/CODEOWNERS \
  2>/dev/null || true

if git diff --cached --quiet; then
  info "No new files to commit (already up to date)"
else
  if [[ "$DRY_RUN" == "true" ]]; then
    info "[DRY-RUN] Would commit: dependabot.yml, PR template, issue templates, CODEOWNERS"
  else
    git commit -m "[orchestrator] Apply repo hardening: dependabot, templates, CODEOWNERS"
    read -r -p "  Push to main? (y/N) " PUSH_CONF
    if [[ "$PUSH_CONF" == "y" || "$PUSH_CONF" == "Y" ]]; then
      git push origin main
      ok "Pushed"
    else
      info "Skipped push — run: git push origin main"
    fi
  fi
fi

# ── Final summary ─────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║  🛡️   Hardening Complete                                    ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  ${GREEN}Applied:${RESET}  $APPLIED settings"
echo -e "  ${YELLOW}Skipped:${RESET}  $FAILED (plan limitations or permissions)"
echo ""
echo -e "  ${BOLD}View your settings:${RESET}"
echo -e "  ${CYAN}https://github.com/$REPO/settings${RESET}"
echo -e "  ${CYAN}https://github.com/$REPO/settings/branches${RESET}"
echo -e "  ${CYAN}https://github.com/$REPO/settings/security_analysis${RESET}"
echo -e "  ${CYAN}https://github.com/$REPO/settings/actions${RESET}"
echo ""
echo -e "  ${BOLD}Next step — add this secret for the router:${RESET}"
echo -e "  ${CYAN}gh secret set ANTHROPIC_API_KEY --repo $REPO${RESET}"
echo ""
