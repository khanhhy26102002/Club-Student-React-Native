import messaging from "@react-native-firebase/messaging";

export async function getFirebaseToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!enabled) {
    console.warn("Không được cấp quyền nhận FCM");
    // return null;
  }
  try {
    const fcmToken = await messaging().getToken();
    console.log("✅ FCM Token:", fcmToken);
    return fcmToken;
  } catch (error) {
    console.error("🔥 Lỗi getToken:", error); // In chi tiết lỗi
  }
}
