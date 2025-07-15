import axios from "axios";
import { API_URL } from "@env";
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
        serverStatus
      };
    } else {
      const error = new Error(message || "Đã có lỗi xảy ra");
      error.response = {
        data: {
          status: serverStatus,
          message
        }
      };
      throw error; // 🔥 Quan trọng nhất
    }
  } catch (error) {
    console.log("❌ API Error:", error?.response?.data || error.message);
    throw error; // 🔥 Quan trọng: ném lại lỗi cho component xử lý
  }
}

export default API;
