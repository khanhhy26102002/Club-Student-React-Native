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
    const { status, message, data } = response.data;

    if (status >= 200 && status < 300) {
      return { status, data, message };
    } else {
      throw new Error(message || "Đã có lỗi xảy ra");
    }
  } catch (error) {
    console.error("API ERROR:", error);
    throw new Error(error.message || "Lỗi kết nối");
  }
}
export default API;
