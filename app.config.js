export default {
  expo: {
    name: "Your App Name",
    slug: "your-app-slug", // 👈 phải giống project bạn đã tạo
    version: "1.0.0",

    config: {
      googleSignIn: {
        certificateHash:
          "22:3f:35:94:1c:ec:a5:cc:46:f9:ed:44:c5:e9:82:dc:79:f7:8f:9c"
      }
    },
    runtimeVersion: "1.0.0",
    android: {
      package: "com.ledangkhanhhy.finalprojectmobilejavascript",
      googleServicesFile: "./google-services.json",
      versionCode: 1
    },
    extra: {
      eas: {
        projectId: "381e44fe-e63e-49a9-9f1c-08e32118af09"
      }
    },
    plugins: [["@react-native-google-signin/google-signin"]]
  }
};
