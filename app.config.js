export default {
  expo: {
    name: "Your App Name",
    slug: "your-app-slug", // 👈 phải giống project bạn đã tạo
    version: "1.0.0",
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
    }
  }
};
