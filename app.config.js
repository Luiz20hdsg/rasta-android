// app.config.js
import appJson from './app.json';

export default {
  ...appJson.expo,
  android: {
    ...appJson.expo.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
  },
  extra: {
    ...appJson.expo.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://fpyxdxuceinuvagmovsg.supabase.co',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweXhkeHVjZWludXZhZ21vdnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzQ3MjgsImV4cCI6MjA1OTY1MDcyOH0.HeXThSqm2BMc7PBc56nARIGTjfGY68v9Z54IMCPJmtE',
    staticAuthorizationToken: process.env.STATIC_AUTHORIZATION_TOKEN || '3xV7fPWZ5RwT!aZ@9Lk#D2mNbG%e6Xy&',
    oneSignalAppId: process.env.ONESIGNAL_APP_ID || '8a665c1f-f02f-4cf1-a06a-aa18cd41ae69',
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://your-production-api.com',
  },
};
