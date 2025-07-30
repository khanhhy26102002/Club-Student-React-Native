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
    const raw = response.data;

    // Nếu là mảng → bọc lại như bạn đã làm
    if (Array.isArray(raw)) {
      return {
        status: response.status,
        data: raw,
        message: "Success",
        serverStatus: response.status
      };
    }

    // Nếu là object nhưng không có key "data"
    if (typeof raw === "object" && raw !== null) {
      return {
        status: response.status,
        data: raw.data !== undefined ? raw.data : raw, // fallback
        message: raw.message || "Success",
        serverStatus: raw.status || response.status
      };
    }

    // Nếu là kiểu khác (string, number,...)
    return {
      status: response.status,
      data: raw,
      message: "Success",
      serverStatus: response.status
    };
  } catch (error) {
    console.log("❌ API Error:", error?.response?.data || error.message);
    throw error;
  }
}

export const checkEventRole = async (eventId) => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    const response = await fetchBaseResponse(`/api/event-roles/my/${eventId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return response.data.roleName; // "CHECKIN", "LEADER", etc.
    }
    return null;
  } catch (error) {
    console.error("❌ Lỗi checkEventRole:", error);
    return null;
  }
};

export default API;
