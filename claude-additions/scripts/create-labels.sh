#!/usr/bin/env bash
REPO="CamGitsIT/unifi-training-incubator"
[[ "$1" == "--repo" ]] && REPO="$2"

declare -A LABELS=(
  ["agent-task"]="0075ca:Tasks to be dispatched to an agent"
  ["awaiting-approval"]="e4e669:Plan posted, waiting for human approval"
  ["plan-approved"]="0e8a16:Human approved the plan, ready to execute"
  ["in-progress"]="d93f0b:Writer has been dispatched"
  ["rollback"]="b60205:Emergency rollback PR"
  ["emergency"]="b60205:Emergency action required"
  ["automated"]="bfd4f2:Created by an automated agent"
  ["conflict"]="e11d48:Merge conflict detected by orchestrator"
  ["needs-human"]="f9d0c4:Requires human review or action"
)

for NAME in "${!LABELS[@]}"; do
  IFS=':' read -r COLOR DESCRIPTION <<< "${LABELS[$NAME]}"
  gh label create "$NAME" --repo "$REPO" --color "$COLOR" --description "$DESCRIPTION" --force 2>/dev/null \
    && echo "✅ $NAME" || echo "⚠️  $NAME"
done
echo "Done: https://github.com/$REPO/labels"
