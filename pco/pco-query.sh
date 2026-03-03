#!/bin/bash
# PCO Quick Query Helper
# Usage: ./pco-query.sh <endpoint> [params]
# Example: ./pco-query.sh "services/v2/service_types/20111/plans?filter=future&per_page=5"

source ~/.openclaw/.secrets

BASE="https://api.planningcenteronline.com"
ENDPOINT="${1}"

curl -s \
  -u "$PCO_APP_ID:$PCO_SECRET" \
  -H "Accept: application/json" \
  "${BASE}/${ENDPOINT}" | python3 -m json.tool 2>/dev/null
