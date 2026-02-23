#!/bin/sh
set -e

echo "Running DB seed..."
npm run db:seed
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "Seeder exited with code $EXIT_CODE"
fi
exit $EXIT_CODE
