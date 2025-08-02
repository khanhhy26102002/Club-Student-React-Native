export default {
  expo: {
    name: "Your App Name",
    slug: "your-app-slug", // 👈 phải giống project bạn đã tạo
    version: "1.0.0",
    runtimeVersion: "1.0.0",
    android: {
      package: "com.ledangkhanhhy.finalprojectmobilejavascript",
      googleServicesFile: "./android/app/google-services.json"
    },
    extra: {
      eas: {
        projectId: "d2e79d09-e794-4f88-9128-c43c0b2e84d5"
      }
    }
  }
}