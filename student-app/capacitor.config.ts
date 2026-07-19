import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sriguru.rto',
  appName: 'Sri Guru RTO Study',
  webDir: 'cap-web',
  server: {
    // Points directly to your production Vercel deployment
    url: 'https://srigururto.vercel.app',
    cleartext: true
  },
  plugins: {
    GoogleSignIn: {
      clientId: '1064521036931-ako2v5m58nbc0hbra9p5a5h7an1tm4be.apps.googleusercontent.com',
      serverClientId: '1064521036931-ako2v5m58nbc0hbra9p5a5h7an1tm4be.apps.googleusercontent.com',
    },
  },
  android: {
    overrideUserAgent: 'Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
  }
};

export default config;
