echo $GOOGLE_SERVICES_JSON | base64 -d > android/app/google-services.json
eas build --platform android --profile production --clear-cache

