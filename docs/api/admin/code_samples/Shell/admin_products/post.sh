curl --location --request POST 'https://medusa-url.com/admin/products' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Shirt"
}'
