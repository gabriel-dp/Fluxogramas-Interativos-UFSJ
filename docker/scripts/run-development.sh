#!/bin/sh
set -e

DB_SETUP_FLAG="/app/.server_db_setup_done"

if [ ! -f "$DB_SETUP_FLAG" ]; then
    echo "Database setup in progress..."
    npm run db:setup
    echo "Database setup finished"
    touch "$DB_SETUP_FLAG"
fi

npm start
