import messaging from "@react-native-firebase/messaging";

export async function getFirebaseToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.warn("❌ Không được cấp quyền nhận FCM");
    return null;
  }

  try {
    // // 👇 Xoá token cũ nếu cần (đảm bảo tạo lại mới)
    // await messaging().deleteToken();

    // 👇 Lấy token mới
    const fcmToken = await messaging().getToken();
    console.log("✅ FCM Token mới:", fcmToken);
    return fcmToken;
  } catch (error) {
    console.error("🔥 Lỗi khi lấy token mới:", error);
    return null;
  }
}
