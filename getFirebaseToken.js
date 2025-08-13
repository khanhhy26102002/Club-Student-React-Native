import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { fetchBaseResponse } from "./utils/api";

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
    const fcmToken = await messaging().getToken();
    console.log("✅ FCM Token mới:", fcmToken);

    const token = await AsyncStorage.getItem("jwt");
    if (!token) {
      console.warn("⚠️ Không tìm thấy JWT để gửi lên API");
      return fcmToken;
    }

    const response = await fetchBaseResponse(
      `/api/users/update-token?fcmToken=${encodeURIComponent(fcmToken)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Full response:", response);
    console.log("Response data:", response.data);
    console.log("Response status:", response.status);
    console.log("Response message:", response.message);
    if (response.status !== 200) {
      console.error("🔥 API cập nhật token thất bại:", response);
    } else {
      console.log("✅ Cập nhật token lên server thành công:", response.data);
    }

    return fcmToken;
  } catch (error) {
    console.error("🔥 Lỗi khi lấy hoặc cập nhật token:", error);
    return null;
  }
}
