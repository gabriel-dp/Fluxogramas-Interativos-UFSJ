#!/bin/bash
echo "Database setup in progress..."
npm run db:setup
echo "\nDatabase setup finished"

echo "\nStarting server..."
npm start &
npx wait-on http://localhost:3000

echo "\nStarting test..."
npm run test