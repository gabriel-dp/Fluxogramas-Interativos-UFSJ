#!/bin/bash

echo "Database setup in progress..."
npm run db:setup
echo "\nDatabase setup finished"

echo "\nStarting server..."
npm start &
npx wait-on ${SERVER_URL:-http://server-test:3001}

echo "\nStarting test..."
npm run test