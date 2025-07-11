import axios from "axios";
import { API_URL } from "@env";
import { Alert } from "react-native";
const API = axios.create({
  baseURL: API_URL,
  timeout: 15000
});
console.log("API_URL", API_URL);
export async function fetchBaseResponse(url, config) {
  try {
    const response = await API(url, config);
    const { message, data, status: serverStatus } = response.data;
    if (response.status >= 200 && response.status < 300) {
      return {
        status: response.status,
        data,
        message,
        serverStatus // Có thể thêm nếu cần
      };
    } else {
      // ✅ giữ nguyên toàn bộ dữ liệu trả về để dùng ở catch
      const error = new Error(message || "Đã có lỗi xảy ra");
      error.response = {
        data: {
          status: serverStatus,
          message
        }
      };
      throw error;
    }
  } catch (error) {
    console.log("❌ API Error:", error?.response?.data || error.message);
    Alert.alert("Lỗi", error?.response?.data?.message || error.message);

    // ✅ THÊM RETURN để không bị undefined
    return {
      status: error?.response?.data?.status || 500,
      data: [],
      message: error?.response?.data?.message || "Unknown error"
    };
  }
}

export default API;
