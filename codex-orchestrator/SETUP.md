# 🤖 Agent Orchestrator — Setup Guide
### Base44 + OpenAI Codex + GitHub Actions

This package prevents conflicts when **Base44** and **OpenAI Codex** both push to the same GitHub repo by installing an orchestrator that:

- **Serializes** all agent activity (one job at a time)
- **Detects** file-level conflicts before they reach `main`
- **Auto-reviews** every PR and blocks merges when conflicts exist
- **Notifies** your Slack channel when something goes wrong

---

## 📦 What's Included

```
.github/
  workflows/
    orchestrator.yml        ← Main lock + auto-review + notify
    conflict-detector.yml   ← File overlap scanner on every push
  CODEOWNERS                ← Human review routing for sensitive files
scripts/
  setup.sh                  ← ONE-COMMAND SETUP (start here)
  codex-dispatch.sh         ← Lock-aware Codex task submitter
  branch-protection.sh      ← Applies GitHub branch rules via gh CLI
```

---

## 🚀 Quick Start (3 steps)

### Step 1 — Copy files to your repo

```bash
# From your repo root:
cp -r /path/to/this-package/.github  .
cp -r /path/to/this-package/scripts  .
chmod +x scripts/*.sh
```

### Step 2 — Run setup

```bash
./scripts/setup.sh --repo owner/your-repo-name
```

This will interactively:
- Check prerequisites (`gh`, `git`, `curl`, `jq`)
- Ask for your `OPENAI_API_KEY` and Slack webhook
- Apply branch protection to `main`
- Commit and push the workflows

### Step 3 — Dispatch Codex tasks through the guard

```bash
./scripts/codex-dispatch.sh \
  --repo  "owner/your-repo" \
  --task  "Add a dark mode toggle to the settings page" \
  --files "src/settings.js,src/theme.css"
```

Codex will **not start** if Base44 or another agent is actively working. It waits up to 5 minutes for the lock, then dispatches.

---

## 🔧 Prerequisites

| Tool | Install |
|------|---------|
| `gh` CLI | `brew install gh` or [cli.github.com](https://cli.github.com) |
| `git` | Pre-installed on most systems |
| `curl` | Pre-installed on most systems |
| `jq` | `brew install jq` or `apt install jq` |

Then authenticate:
```bash
gh auth login
```

---

## 🔐 GitHub Secrets Required

Add these to your repo at **Settings → Secrets → Actions**:

| Secret | Required | Description |
|--------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for Codex dispatch |
| `SLACK_WEBHOOK_URL` | Optional | Incoming webhook URL for conflict alerts |

Add manually:
```bash
gh secret set OPENAI_API_KEY --repo owner/repo
gh secret set SLACK_WEBHOOK_URL --repo owner/repo
```

---

## 🧠 How the Orchestrator Works

### Concurrency Lock
Every GitHub Actions workflow run on `main` joins the same concurrency group:

```yaml
concurrency:
  group: main-branch-lock
  cancel-in-progress: false   # ← queues, doesn't cancel
```

This means if Base44 pushes and a Codex PR arrives at the same time, **they queue up** and run one after the other — never simultaneously.

### Agent Detection
The orchestrator identifies who triggered a run by:
1. Checking `github.actor` (username)
2. Scanning the commit message for `[base44]` or `[codex]` tags
3. Falling back to `workflow_dispatch` input

### Conflict Detection Flow
```
Push/PR arrives
       ↓
Identify Agent (acquire lock)
       ↓
Conflict Check (merge simulation)
       ↓
    ┌──┴──┐
  Clear  Conflict
    ↓       ↓
Auto-    Block PR +
Approve  Request Changes
    ↓       ↓
  Notify Slack (both cases if conflict)
```

---

## 🔀 Updating Base44 to Use Branches (Recommended)

Right now Base44 pushes directly to `main`. After applying branch protection, it will need to push to a branch instead.

In your **Base44 settings**, change the push target from `main` to a pattern like:

```
base44/auto-{{date}}
```

Base44 will open a PR, the orchestrator will review it, and if clean, auto-approve it for merge.

If you can't change Base44's push target, use `--skip-protection` during setup to keep direct pushes allowed, but the conflict detector will still run and alert you.

---

## 🔔 Slack Notifications

Create a Slack Incoming Webhook:
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create new app → "From scratch"
3. Enable "Incoming Webhooks"
4. Add webhook to your workspace, choose a channel
5. Copy the URL → save as `SLACK_WEBHOOK_URL` secret

Alerts fire when:
- A conflict is detected between agents
- An overlapping file push is caught
- A PR is blocked by the auto-reviewer

---

## 🛠 Manual Operations

**Check active orchestrator runs:**
```bash
gh run list --repo owner/repo --branch main --status in_progress
```

**Manually trigger orchestrator:**
```bash
gh workflow run orchestrator.yml \
  --repo owner/repo \
  --field agent=manual \
  --field task_description="Manual checkpoint"
```

**View orchestrator run logs:**
```bash
gh run view --repo owner/repo --log
```

**Remove branch protection (emergency):**
```bash
gh api --method DELETE /repos/OWNER/REPO/branches/main/protection
```

---

## 🔖 Commit Message Convention

Tag your commits so the orchestrator correctly identifies the agent:

| Agent | Prefix |
|-------|--------|
| Base44 | `[base44] Your message` |
| Codex | `[codex] Your message` (auto-added by dispatch script) |
| Human | No prefix needed |

---

## 📊 Viewing the Dashboard

Every orchestrator run generates a summary visible in **GitHub Actions → Run → Summary tab**:

- Agent identity
- Files changed
- Conflict status
- Hot files map (most touched in recent history)

---

## ❓ Troubleshooting

**"Lock held" — dispatch script times out**
> A run is stuck. Check: `gh run list --repo owner/repo --status in_progress`
> Cancel it: `gh run cancel RUN_ID --repo owner/repo`

**Auto-review comments not appearing**
> Ensure the `GITHUB_TOKEN` has `pull-requests: write` permission. Check repo Settings → Actions → General → Workflow permissions → set to "Read and write".

**Branch protection blocking admins**
> The setup sets `enforce_admins: false` so admins can still push in emergencies. Set to `true` for stricter control.

**Codex API errors**
> Verify `OPENAI_API_KEY` is set and has access to `codex-1` model. Check [platform.openai.com](https://platform.openai.com).
