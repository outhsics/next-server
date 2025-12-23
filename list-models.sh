#!/bin/bash
API_KEY=$(grep GOOGLE_GENERATIVE_AI_API_KEY .env.local | cut -d '=' -f2)

echo "Listing Models..."
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$API_KEY" | grep "\"name\":"
