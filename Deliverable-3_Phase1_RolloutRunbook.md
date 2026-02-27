# Deliverable 3: Phase 1 Rollout Runbook

Phase 1 goals
- Opt-in per session for identity/config hints; manual approval workflow; memory off by default
- Validate approvals via test prompts and audit logs

Steps
1) Enable per-session opt-in flags for identity/config hints (default ON with consent flag; memory OFF)
2) Configure approval channel(s) and timeout (default 24h)
3) Trigger an approval prompt by requesting an identity hint (or config hint) without consent
4) Approve/deny via chosen channel; log outcome
5) Verify cross-talk action completes or is aborted; check audit trail

Test cases
- Happy path: consent granted; identity/config hint sent and approved; action completes
- Denied path: consent granted but approval denied; action aborted
- Timeout path: approval not given within timeout; action aborted with notification

Acceptance criteria
- All steps logged; approvals captured; no data beyond previews; no stalled actions
