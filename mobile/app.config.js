const config = {
  name: "Clearledger",
  slug: "clearledger",
  scheme: "clearledger",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: { resizeMode: "contain", backgroundColor: "#0b0f17" },
  ios: { supportsTablet: true, bundleIdentifier: "com.clearledger.app" },
  android: { package: "com.clearledger.app" },
  web: { bundler: "metro" },
  plugins: ["expo-router"],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
};
export default config;
