// src/api/fetchClubRoleAndStatus.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

// Nếu hết hạn thì điều hướng ra Login
export const fetchClubRoleAndStatus = async (clubId, onTokenError) => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return null;
    const [roleRes, statusRes] = await Promise.all([
      fetchBaseResponse("/api/clubs/my-club-roles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }),
      fetchBaseResponse(`/api/memberships/status?clubId=${clubId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
    ]);

    if (roleRes.status === 401 || statusRes.status === 401) {
      await onTokenError();
      return;
    }

    const clubRole =
      roleRes.data.find((r) => r.clubId === Number(clubId)) || null;
    const status = statusRes.data;

    return {
      role: clubRole,
      hasApplied: !!status,
      isApproved: status === "APPROVED"
    };
  } catch (err) {
    console.error("Error fetching role/status:", err);
    return { role: null, hasApplied: false, isApproved: false };
  }
};
