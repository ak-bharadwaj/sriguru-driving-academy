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
      clientId: '1064521036931-ako2v5m58nbc0hbra9p5a5h7an1tm4be.apps.googleusercontent.com',
    },
  },
};

export default config;
