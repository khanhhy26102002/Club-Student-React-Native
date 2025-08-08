export default {
  expo: {
    name: "ClubSystem",
    slug: "clubsystem", // 👈 phải giống project bạn đã tạo
    version: "1.0.0",

    config: {
      googleSignIn: {
        certificateHash:
          "a3:07:d9:9f:00:c2:b8:b2:24:56:1c:c8:50:5d:69:af:85:80:b9:f3"
      }
    },
    runtimeVersion: "1.0.0",
    android: {
      package: "com.clubsystem.app",
      googleServicesFile: "./google-services.json",
      versionCode: 1
    },
    extra: {
      eas: {
        projectId: "ff75af8e-2b30-4f89-b037-95d096065768"
      }
    },
    plugins: [["@react-native-google-signin/google-signin"]]
  }
};
