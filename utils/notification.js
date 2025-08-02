import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
export async function registerForPushNotificationsAsync() {
  console.log("🔔 Bắt đầu đăng ký nhận Push Notification...");

  // ✅ Kiểm tra nếu không phải thiết bị thật (Expo Go không hỗ trợ push)
  if (!Constants.isDevice) {
    console.warn(
      "⚠️ Không phải thiết bị thật – một số chức năng có thể không hoạt động đúng"
    );
    console.warn("⚠️ Phải dùng thiết bị thật để nhận push notification.");
    return null;
  }

  try {
    // ✅ Kiểm tra quyền hiện tại
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
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    console.log("✅ Đã lấy được Expo Push Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký push notification:", error);
    return null;
  }
}
