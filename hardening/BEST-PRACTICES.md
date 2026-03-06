# Multi-Agent Repo Orchestration — Best Practices & Pitfall Prevention Guide

**Stack:** Base44 · OpenAI Codex · Claude Sonnet · GitHub Actions · GitHub

---

## The Core Mental Model

Treat your `main` branch like production. It should always be deployable, always green, always intentional. Agents are powerful but blind to context — your orchestration system is the brain that protects main from the speed of automation.

Every protection in this guide answers one question: **"What happens when an agent does something unexpected?"**

---

## 1. Branch Strategy — The Single Most Important Rule

**Never allow any agent to push directly to `main`.** This is non-negotiable.

The branch model that works for multi-agent repos:

```
main (sacred, protected)
  ↑ PRs only, all checks required
  │
  ├── base44/auto-20250306-feature-auth
  ├── codex/task-add-pagination-20250306
  ├── dependabot/npm-and-yarn-lodash-4.17.22
  └── human/my-feature
```

Every agent gets its own branch namespace:
- `base44/*` — Base44 auto-generated features
- `codex/*` — Codex task branches (auto-set by dispatch script)
- `dependabot/*` — Dependency updates (auto-handled)
- `rollback/*` — Emergency rollbacks

**Why this matters:** If two agents push to the same branch, or both push directly to `main`, you get merge conflicts with no safe way to untangle them. Branches give you an audit trail, a review gate, and a rollback target.

**Pitfall:** Base44 defaults to pushing directly to `main`. Change this in your Base44 project settings before anything else. Set the push target to `base44/auto-{{timestamp}}`.

---

## 2. The Concurrency Lock — How Jobs Don't Collide

The orchestrator uses a GitHub Actions concurrency group:

```yaml
concurrency:
  group: main-branch-lock
  cancel-in-progress: false
```

`cancel-in-progress: false` is critical. Without it, a new push from Base44 would **cancel** a Codex job mid-run, potentially leaving the repo in a broken intermediate state. With it, jobs queue and wait.

**What this serializes:** Every push to `main`, every PR check, every router call, every rollback — they all queue behind each other. Only one runs at a time.

**Pitfall:** If a job hangs (network failure, infinite loop in a test), it holds the lock indefinitely. Always set `timeout-minutes` on your jobs. The orchestrator has a 30-minute default — lower it if your typical jobs are faster.

**Pitfall:** Concurrency only applies within GitHub Actions. If Base44 and Codex both make git pushes within milliseconds of each other, the push itself may succeed before Actions even starts. This is why branch protection + required PR reviews is the real first line of defense, not the concurrency group.

---

## 3. The Five Security Rules

### 3.1 Secret Scanning Push Protection (on by default after hardening)

GitHub intercepts the push *before* it reaches the repo if it detects a known secret pattern (OpenAI keys, AWS credentials, Stripe keys, etc.). An agent that accidentally includes a hardcoded API key in generated code will be blocked at the git layer — before it's ever in your history.

Enable it and never turn it off. After hardening, it's enabled. Don't disable it.

### 3.2 Sign Your Commits

```bash
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_GPG_KEY_ID
```

Signed commits prove identity. An agent commit signed with your key confirms it was dispatched by your orchestration system, not a rogue push impersonating you. The ruleset enforces `required_signatures` on `main`.

### 3.3 No Secrets in the Registry

`agent-registry.yml` sits in your repo. Never put API keys, webhook URLs, or credentials there. Reference secret names only:

```yaml
# ✅ Correct
dispatch: scripts/codex-dispatch.sh   # script reads OPENAI_API_KEY from env

# ❌ Wrong
api_key: sk-proj-abc123...
```

### 3.4 Principle of Least Privilege for Actions

The hardening script sets GitHub Actions default permissions to `read`. Workflows that need to write (create PRs, post comments) explicitly declare it:

```yaml
permissions:
  contents: write
  pull-requests: write
```

This means a compromised or misbehaving workflow can't do more than read your code.

### 3.5 CODEOWNERS as a Dead Man's Switch

The most important CODEOWNERS rule:

```
.github/workflows/   @your-username
agent-registry.yml   @your-username
scripts/repo-hardening.sh  @your-username
```

Agents cannot modify their own guardrails without your approval. This is the rule that prevents a "prompt injection" scenario where a malicious task tricks Codex into weakening the orchestration.

---

## 4. What to Never Let Agents Touch

Some files should always require a human in the loop, no matter how confident the orchestrator is. These are already in CODEOWNERS, but understand *why*:

| File/Path | Why agents should never auto-merge |
|-----------|-----------------------------------|
| `migrations/`, `*.sql` | Schema changes are irreversible. A bad migration can corrupt production data. |
| `src/auth/`, `src/payments/` | Security-critical. One wrong line and you have an authentication bypass or payment exploit. |
| `Dockerfile`, `docker-compose.yml` | Controls what runs in production. An agent could introduce a backdoor image. |
| `*.tf`, `terraform/` | Infrastructure as code. Deleting the wrong resource destroys production. |
| `*.env`, secrets/ | Obvious — credentials must never be auto-merged. |
| `.github/workflows/` | Agents must not rewrite the rules that govern them. |
| `package.json` (major versions) | Major version bumps often have breaking changes that require human validation. |

---

## 5. Handling the "Needs New Agent" Case

When the router determines no existing agent scores above 50% confidence, it recommends adding a new one. Here's the safe process for doing that:

**Step 1 — Evaluate the recommendation.** The router will suggest from the `potential_agents` list (Devin, Cursor, Sweep AI, GPT-4o, etc.) or generate a custom spec. Read the reasoning. Agents are not free, and more agents means more surface area for conflicts.

**Step 2 — Add to registry in a branch, not main.** Create a PR. Don't add a new agent to `agent-registry.yml` directly on main — the change should go through review so you can evaluate the integration steps.

**Step 3 — Start with `status: testing`.** Add the new agent with `status: testing` first. The router will consider it but flag it differently. Run a few dry-run dispatches before setting it to `active`.

**Step 4 — Write a dispatch script.** Every active agent needs a corresponding `scripts/<agent>-dispatch.sh` that:
- Checks the orchestrator lock first
- Validates the task against the agent's known file boundaries
- Tags commits with `[agent-name]`
- Sets a branch prefix

**Step 5 — Set CODEOWNERS for new agent configs.** Any new dispatch script or integration file should be owned by you, not auto-mergeable.

---

## 6. Conflict Resolution Hierarchy

When conflicts happen (and they will), here is the resolution order:

1. **Human wins over agent.** If you pushed something and an agent conflicts with it, the agent's PR gets `REQUEST_CHANGES` and must rebase.

2. **Earlier PR wins.** The PR that was opened first has priority. The later agent must rebase onto main after the first PR merges.

3. **Smaller change wins.** When two agents modify the same file, the one making a smaller, more scoped change is easier to rebase. The larger change rebases.

4. **Escalate to human.** If the conflict is in CODEOWNERS-protected files, close both PRs and have a human resolve manually.

The orchestrator auto-comments on conflicted PRs with `REQUEST_CHANGES`. Don't dismiss these — fix the conflict, force-push the branch, and let the orchestrator re-review.

---

## 7. The Rollback Playbook

Something will go wrong. Here's the playbook, in order of severity:

### Level 1 — A Bad PR (not yet merged)
**Action:** Close the PR. The orchestrator will auto-comment explaining why.
**Recovery time:** Instant.

### Level 2 — Bad commit just merged to main
**Action:** Use the Emergency Rollback workflow in GitHub Actions.
```
Actions → Workflows → 🚨 Emergency Rollback → Run workflow
SHA to revert to: abc1234 (the last known-good commit)
Reason: "Bad Codex push broke auth"
```
**Recovery time:** 2–5 minutes (creates revert PR, auto-merges when checks pass).

### Level 3 — Bad commit deployed to production
**Action:** Emergency Rollback + redeploy simultaneously. Don't wait for PR.
```bash
# Emergency: revert and push directly (temporarily bypass protection)
git revert <bad-sha> --no-edit
git push origin main  # admin bypass if needed
```
**Recovery time:** 5–15 minutes depending on deploy pipeline.

### Level 4 — Multiple bad commits, unclear which are safe
**Action:** Reset to a known tag.
```bash
git checkout v1.2.3    # last known-good tag
git checkout -b rollback/to-v1.2.3
# open PR manually
```

**Key rule:** Always tag releases. Before any major agent task (`base44/new-feature-*`), create a tag: `git tag -a v1.2.3 -m "Pre-Base44-auth-feature"`. This gives you a clean rollback target.

---

## 8. Commit Message Convention (Enforced by Router)

All agent commits must be prefixed so you can audit exactly what touched what:

```
[base44] Add user authentication with JWT
[codex] Refactor pagination component to use React Query
[dependabot] Bump lodash from 4.17.21 to 4.17.22
[orchestrator] Install repo hardening configuration
```

Human commits need no prefix. The security-scan workflow's "agent audit" job uses these to build a commit-by-author map for every PR.

The ruleset blocks `WIP` commits from merging to main (a common accidental commit message from agents working through a multi-step task).

---

## 9. Cost Control

Three things that blow up API costs in multi-agent setups:

**Runaway dispatch loops.** A workflow triggers the router, the router dispatches Codex, Codex opens a PR, the PR triggers the orchestrator, which triggers the router again. Break cycles by checking `github.actor` — never dispatch an agent in response to an agent-triggered event.

**Retry storms.** A failing Codex task that keeps being re-submitted. The cost-guardrails workflow limits daily dispatches to 20 (configurable). If Codex fails 3 times on the same task, the dispatch script logs it and stops retrying.

**Long-running CodeQL scans.** CodeQL can consume significant Actions minutes. The security workflow runs on PRs and weekly — not on every push to non-main branches. Keep it scoped.

Set a GitHub spending limit at `Settings → Billing → Spending limit`. Set it to $0 if you're on the free plan (prevents any overage charges). Adjust upward as you understand your actual consumption.

---

## 10. The Checklist Before Going Live

Before you rely on this system for real work, confirm each item:

- [ ] Base44 is configured to push to `base44/*` branches, not `main`
- [ ] `ANTHROPIC_API_KEY` is set as a repo secret (for the task router)
- [ ] `OPENAI_API_KEY` is set as a repo secret (for Codex dispatch)
- [ ] `SLACK_WEBHOOK_URL` is set (you want real-time conflict alerts)
- [ ] You've done a dry-run dispatch: `./scripts/codex-dispatch.sh --repo owner/repo --task "Add a comment to README.md"`
- [ ] Branch protection is active: try pushing directly to main — it should be rejected
- [ ] CODEOWNERS is set with your real GitHub username (not `YOUR_GITHUB_USERNAME`)
- [ ] You've run the Emergency Rollback workflow in dry-run mode to understand how it works
- [ ] You have at least one release tag (`git tag -a v0.1.0 -m "Initial"`)
- [ ] Secret scanning push protection is on: Settings → Code security → Secret scanning
- [ ] You've read the "What to Never Let Agents Touch" section above
- [ ] Cost guardrail limit is set to a number that matches your budget

---

## 11. The One Thing That Will Save You

**Review every agent PR before enabling auto-merge.**

Auto-merge is powerful and convenient. But in the first few weeks of this setup, disable it and review every single agent PR manually. You will catch:
- Agents modifying files outside their expected scope
- Hallucinated code that compiles but doesn't work
- Subtle logic errors in generated tests
- Unexpected dependencies being imported

After 2–3 weeks of manual review with zero issues, selectively enable auto-merge for low-risk agent types (Dependabot patch updates, documentation changes). Never enable auto-merge for changes to auth, payments, or database files.

---

*This guide reflects the configuration applied by `scripts/repo-hardening.sh`. Keep it updated as you add new agents to the registry.*
