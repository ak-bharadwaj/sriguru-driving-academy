import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sriguru.academy',
  appName: 'Sri Guru Driving School',
  webDir: 'public',
  server: {
    url: 'http://10.0.2.2:3000',
    cleartext: true
  },
  plugins: {
    GoogleSignIn: {
      clientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
    },
  },
};

export default config;
