#!/bin/bash
# Extract key
API_KEY=$(grep GOOGLE_GENERATIVE_AI_API_KEY .env.local | cut -d '=' -f2)

if [ -z "$API_KEY" ]; then
  echo "Key not found"
  exit 1
fi

echo "Testing Key: ${API_KEY:0:5}..."

curl -s -H 'Content-Type: application/json' \
     -d '{"contents":[{"parts":[{"text":"Hi"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$API_KEY"
