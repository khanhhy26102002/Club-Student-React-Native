// utils/notification.js
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;
  console.log("🔍 Bắt đầu đăng ký push notification...");

  if (!Constants.isDevice) {
    console.warn(
      "⚠️ Không phải thiết bị thật – một số chức năng có thể không hoạt động đúng"
    );
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log("📋 Quyền hiện tại:", existingStatus);

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("📥 Quyền sau khi yêu cầu:", status);
  }

  if (finalStatus !== "granted") {
    alert("Không có quyền gửi thông báo!");
    console.log("❌ Không có quyền");
    return;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("✅ Expo Push Token:", token);
  } catch (err) {
    console.error("❌ Lỗi khi lấy token:", err);
  }

  return token;
}
