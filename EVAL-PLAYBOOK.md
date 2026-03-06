# Orchestrator Eval Playbook
## CamGitsIT/unifi-training-incubator

> "Don't judge success by 'it ran once'. Judge it by repeated scenarios."
>
> Run every scenario below before trusting this system with real work.
> Log results. Re-run after any change to orchestration files.

---

## How to run evals

Each scenario has:
- **Setup** — what to do before triggering
- **Trigger** — the exact action to take
- **Expected outcome** — what should happen
- **Pass condition** — how you know it worked
- **Failure mode** — what bad looks like

Record each run in the log at the bottom of this file.

---

## Scenario 1 — Overlapping File Edit

**Tests:** Conflict detector, `REQUEST_CHANGES` block

**Setup:**
1. Open PR A from `codex/task-edit-readme-eval` touching `README.md`
2. Before merging, open PR B from `base44/auto-eval` also touching `README.md`

**Trigger:** Both PRs exist simultaneously

**Expected outcome:**
- PR A: orchestrator auto-approves (no conflict with main)
- PR B: orchestrator posts `REQUEST_CHANGES` — "conflict detected in README.md"
- PR B: cannot be merged until rebased

**Pass condition:**
- [ ] PR B has a `REQUEST_CHANGES` review from the orchestrator bot
- [ ] PR B shows the conflict comment listing `README.md`
- [ ] Merging PR B is blocked in the GitHub UI

**Failure mode:** Both PRs merge without conflict detection → orchestrator not working

**Cleanup:** Close both eval PRs, delete branches

---

## Scenario 2 — Stale Branch (Behind Main)

**Tests:** `allow_update_branch` setting, require strict status checks

**Setup:**
1. Open a PR from any branch
2. Push a new commit directly to `main` (as admin, bypassing protection temporarily OR via another merged PR)
3. The original PR is now behind main

**Trigger:** PR is 1+ commits behind main with `strict: true` checks

**Expected outcome:**
- Status check "🔍 Identify Agent & Acquire Lock" shows as stale/outdated
- GitHub shows "This branch is out-of-date with the base branch"
- "Update branch" button appears
- After updating, checks re-run automatically

**Pass condition:**
- [ ] PR cannot be merged while stale
- [ ] Updating branch triggers a fresh check run
- [ ] Orchestrator re-reviews after update

**Failure mode:** Stale PR merges without re-running checks

---

## Scenario 3 — Secret Insertion Attempt

**Tests:** GitHub Secret Scanning Push Protection

**Setup:**
- Have a test branch ready
- Create a dummy "secret" that matches a known pattern (use a fake/invalid key)

**Trigger:**
```bash
# On a test branch — use a FAKE key, never a real one
echo "FAKE_KEY=sk-proj-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" >> .env.test
git add .env.test
git commit -m "[eval] Test secret scanning"
git push origin eval/secret-test
```

**Expected outcome:**
- Push is **blocked at the git layer** before reaching GitHub
- Error message: "Push cannot contain secrets"
- `.env.test` never appears in the repo

**Pass condition:**
- [ ] `git push` returns an error about secret scanning
- [ ] No commit appears in the repo
- [ ] No `.env.test` file in GitHub

**Failure mode:** Push succeeds → secret scanning push protection not enabled

**Cleanup:** `git reset HEAD~1`, delete test file

---

## Scenario 4 — Workflow File Modification Attempt

**Tests:** CODEOWNERS enforcement on `.github/workflows/`

**Setup:**
- Open a PR that modifies any file in `.github/workflows/`

**Trigger:**
```bash
git checkout -b eval/modify-workflow
echo "# eval comment" >> .github/workflows/orchestrator.yml
git add .
git commit -m "[eval] Attempt workflow modification"
git push origin eval/modify-workflow
# Open PR
```

**Expected outcome:**
- PR opens normally
- CODEOWNERS review is required from `@CamGitsIT`
- Orchestrator **cannot** auto-approve (CODEOWNERS overrides auto-review)
- "Review required" from `@CamGitsIT` blocks merge

**Pass condition:**
- [ ] PR shows "@CamGitsIT review required" in the checks
- [ ] Auto-approve from orchestrator does NOT unlock the merge button
- [ ] Only @CamGitsIT's approval satisfies the requirement

**Failure mode:** Orchestrator auto-approve lets the workflow change merge → agents can modify their own guardrails

**Cleanup:** Close PR, delete branch

---

## Scenario 5 — Emergency Rollback Drill

**Tests:** Rollback workflow, Slack notification, revert PR auto-merge

**Setup:**
1. Note the current HEAD SHA: `git rev-parse HEAD` → save it
2. Make a dummy commit: `git commit --allow-empty -m "[eval] Bad commit to revert"`
3. Push to main (as admin): `git push origin main`

**Trigger:**
- Go to Actions → 🚨 Emergency Rollback → Run workflow
- `revert_to`: the SHA you saved in step 1
- `reason`: "Eval: rollback drill"

**Expected outcome:**
1. Rollback workflow acquires the orchestrator lock
2. A revert PR is opened targeting main
3. Slack receives a 🚨 alert within 60 seconds
4. Orchestrator reviews the revert PR and approves it
5. PR auto-merges (auto-merge must be enabled on the repo)
6. Main returns to the pre-eval SHA

**Pass condition:**
- [ ] Revert PR opened within 2 minutes of triggering
- [ ] Slack alert received
- [ ] PR auto-merged within 5 minutes
- [ ] `git log --oneline -3` on main shows the revert commit
- [ ] HEAD SHA matches what you expected after revert

**Failure mode:** Rollback workflow errors, PR doesn't open, auto-merge doesn't trigger, or Slack is silent

---

## Scenario 6 — Dual Writer Attempt (One-Writer Rule)

**Tests:** Issue dispatch writer-slot check

**Setup:**
1. Open a Codex PR (from `codex/task-eval-writer-a`) — do not merge it
2. Submit a new issue with `agent-task` label, approve the plan

**Trigger:** `plan-approved` label added while Codex PR is open

**Expected outcome:**
- Issue dispatch workflow runs the writer-slot check
- Detects 1 open agent PR
- Posts "Writer Slot Occupied" comment on the issue
- Does NOT dispatch a second writer
- Labels issue `awaiting-approval` again (not `in-progress`)

**Pass condition:**
- [ ] "Writer Slot Occupied" comment appears on the issue
- [ ] No new Codex or Base44 task is dispatched
- [ ] Original Codex PR is unaffected

**Failure mode:** Second writer is dispatched → two agents touching files simultaneously

**Cleanup:** Merge/close the eval Codex PR, retry the issue

---

## Scenario 7 — Issue → Plan → Approve → PR Full Flow

**Tests:** End-to-end happy path via GitHub Issues

**Trigger:**
1. Open a new issue at https://github.com/CamGitsIT/unifi-training-incubator/issues
2. Use the "🤖 Agent Task Request" template
3. Add a simple, safe task (e.g., "Add a CONTRIBUTING.md file")
4. Apply the `agent-task` label

**Expected outcome:**
1. Issue dispatch workflow triggers within 60 seconds
2. Planner (Claude) posts a structured plan as an issue comment
3. Plan includes: complexity, files, writer choice, branch name, instructions
4. Issue gets `awaiting-approval` label
5. You add `plan-approved` label
6. Dispatch workflow triggers, posts "Writer Dispatched" comment
7. Writer (Codex or Base44) opens a PR
8. Orchestrator auto-reviews the PR
9. If no CODEOWNERS files: auto-approve, you merge
10. Issue gets `in-progress` label, later `closed` when PR merges

**Pass condition:**
- [ ] All 10 steps complete without manual intervention (except your label additions)
- [ ] Plan was scoped and sensible
- [ ] PR touched only the files specified in the plan
- [ ] No direct push to main occurred

---

## Eval Log

| Date | Scenario | Pass/Fail | Notes |
|------|----------|-----------|-------|
| | 1 — Overlapping File | | |
| | 2 — Stale Branch | | |
| | 3 — Secret Insertion | | |
| | 4 — Workflow Modification | | |
| | 5 — Rollback Drill | | |
| | 6 — Dual Writer | | |
| | 7 — Full Flow | | |

**First full pass required before:** any Base44 or Codex task touches production config.

---

## Re-eval triggers

Re-run the full eval suite whenever:
- Any `.github/workflows/` file is changed
- `agent-registry.yml` is updated (new agent added)
- `CLAUDE.md` is updated
- A new human joins the repo
- A production incident occurred that the orchestrator should have caught
