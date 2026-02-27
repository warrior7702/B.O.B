# Deliverable 2: API Contract (Path A, Direct API)

Endpoints
- POST /api/v1/health
- POST /api/v1/identity
- POST /api/v1/config
- POST /api/v1/restore
- POST /api/v1/learn
- POST /api/v1/approve

Payloads (conceptual)
- Identity: { display_name, pronouns, timezone, consent, timestamp }
- Config: { config_version, snapshot_ref, timestamp, consent }
- Restore: { target_instance_id, snapshot_version, reason, timestamp, consent }
- Learn: { hint_id, brief_summary, expires_at, timestamp, consent }
- Approve: { ticket_id, decision, timestamp, approver }

Security
- Token-based auth with scopes: identity, memory_hint, config_snapshot, restore_request, health, learn
- Rotation and revocation mechanisms

Error handling
- Standard HTTP status codes; 4xx/5xx with error codes in body

Audit
- Include ticket_id, action, outcome, timestamp, approver in logs
