export default {
  name: "БПС",
  slug: "client",
  version: "1.0.0",
  scheme: "myapp",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#3C3C3C",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.vladnz.client",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#3C3C3C",
    },
    package: "com.vladnz.client",
  },
  plugins: ["expo-router"],
  extra: {
    apiUrl: process.env.SERVER_URL,
    router: {
      origin: false,
    },
    eas: {
      projectId: "5be776b2-82ea-494e-b63c-fb0fe66b6fe3",
    },
  },
};
