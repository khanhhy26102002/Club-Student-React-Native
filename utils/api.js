import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API = axios.create({
  baseURL: API_URL,
  timeout: 15000
});
console.log("API_URL", API_URL);
export async function fetchBaseResponse(url, config) {
  try {
    const response = await API(url, config);
    const raw = response.data;

    if (Array.isArray(raw)) {
      return {
        status: response.status,
        data: raw,
        message: "Success",
        serverStatus: response.status
      };
    }

    if (typeof raw === "object" && raw !== null) {
      return {
        status: response.status,
        data: raw.data !== undefined ? raw.data : raw,
        message: raw.message || "Success",
        serverStatus: raw.status || response.status
      };
    }

    return {
      status: response.status,
      data: raw,
      message: "Success",
      serverStatus: response.status
    };
  } catch (error) {
    const raw = error?.response?.data;
    console.log("❌ API Error:", raw || error.message);

    throw {
      status: raw?.status || error?.response?.status || 500,
      message: raw?.message || "Lỗi kết nối máy chủ"
    };
  }
}

export const checkEventRole = async (eventId) => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    const response = await fetchBaseResponse(`/api/event-roles/my/${eventId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200 && response.data?.roleName) {
      return response.data.roleName;
    }
    return null; // Không có role
  } catch (error) {
    if (error.status === 1002) {
      console.warn(`User has no role in event ${eventId}`);
    } else {
      console.error("❌ Lỗi checkEventRole:", error);
    }
    return null;
  }
};

export default API;
