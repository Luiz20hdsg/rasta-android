#!/bin/bash
set -e
echo "Running custom prebuild script"
echo "GOOGLE_SERVICES_JSON content:"
echo $GOOGLE_SERVICES_JSON
echo $GOOGLE_SERVICES_JSON | base64 -d > android/app/google-services.json || { echo "Failed to decode GOOGLE_SERVICES_JSON"; exit 1; }
echo "google-services.json created:"
cat android/app/google-services.json
echo "Running expo prebuild"
npx expo prebuild --clean'
