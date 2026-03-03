# PCO API Reference — FBCA
## Quick cheat sheet for B.O.B. natural language queries

## Auth
- App ID: stored in ~/.openclaw/.secrets as PCO_APP_ID
- Secret: stored as PCO_SECRET
- Method: HTTP Basic Auth

## Base URL
https://api.planningcenteronline.com

## Available Modules (FBCA)
| Module | Base Path | Status |
|--------|-----------|--------|
| People | /people/v2 | ✅ |
| Services | /services/v2 | ✅ |
| Calendar | /calendar/v2 | ✅ |
| Groups | /groups/v2 | ✅ |
| Check-Ins | /check_ins/v2 | ✅ |
| Giving | /giving/v2 | ❌ (no access) |

## Common Queries

### People
- All people: GET /people/v2/people?per_page=25
- Search by name: GET /people/v2/people?where[search_name]=Billy
- Person by ID: GET /people/v2/people/{id}
- Lists: GET /people/v2/lists

### Services
- Service types: GET /services/v2/service_types
- FBCA Service Type IDs:
  - 20111 = Classic Worship
  - 73426 = The Break
  - 188895 = Contemporary
  - 145264 = Music
- Upcoming plans: GET /services/v2/service_types/{id}/plans?filter=future&per_page=5
- Past plans: GET /services/v2/service_types/{id}/plans?filter=past&per_page=5
- Plan details: GET /services/v2/service_types/{id}/plans/{plan_id}
- Team members on a plan: GET /services/v2/service_types/{id}/plans/{plan_id}/team_members
- Songs: GET /services/v2/songs?per_page=25

### Calendar
- Upcoming events: GET /calendar/v2/events?filter=future&per_page=10
- Events this month: GET /calendar/v2/events?where[starts_at][gte]=2026-03-01&where[starts_at][lte]=2026-03-31
- Event details: GET /calendar/v2/events/{id}
- Event instances: GET /calendar/v2/event_instances?per_page=10

### Check-Ins
- Recent check-ins: GET /check_ins/v2/check_ins?per_page=25&order=-created_at
- By event: GET /check_ins/v2/events/{id}/check_ins
- Headcount summary: GET /check_ins/v2/check_ins?where[created_at][gte]=2026-03-01
- Events with check-ins: GET /check_ins/v2/events?per_page=25

### Groups
- All groups: GET /groups/v2/groups?per_page=25
- Group members: GET /groups/v2/groups/{id}/memberships

## Natural Language → API Mapping

| Question | Endpoint |
|----------|----------|
| "What's happening this Sunday?" | /services/v2/service_types/188895/plans?filter=future&per_page=1 |
| "Who's serving this week?" | /services/v2/service_types/{id}/plans/{id}/team_members |
| "How many kids checked in Sunday?" | /check_ins/v2/check_ins?where[created_at][gte]={sunday} |
| "What events are in March?" | /calendar/v2/events?filter=future&per_page=20 |
| "Find person named John" | /people/v2/people?where[search_name]=John |
| "What groups do we have?" | /groups/v2/groups?per_page=50 |
| "What songs did we do last week?" | /services/v2/service_types/{id}/plans/{last_id}/items |
