curl -X POST '{backend_url}/admin/tax-rates/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "New Tax Rate"
}'
