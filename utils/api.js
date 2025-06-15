import axios from "axios";
import { API_URL } from "@env";
const API = axios.create({
  baseURL: API_URL,
  timeout: 5000
});
console.log("API_URL", API_URL);
export default API;
