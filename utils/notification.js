import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export async function registerForPushNotificationsAsync() {
  console.log("🔔 Bắt đầu đăng ký nhận Push Notification...");

  // ⚠️ Cảnh báo nhưng KHÔNG return để vẫn tiếp tục trên máy giả
  if (!Constants.isDevice) {
    console.warn("⚠️ Đây không phải thiết bị thật – một số chức năng có thể không hoạt động đúng.");
    // ❗️ KHÔNG return null ở đây
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("🚫 Không được cấp quyền nhận thông báo.");
      return null;
    }

    // ✅ Lấy Expo Push Token
    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
      
    });
console.log("ℹ️ projectId:", Constants.expoConfig?.extra?.eas?.projectId);

    console.log("✅ Đã lấy được Expo Push Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký push notification:", error);
    return null;
  }
}
