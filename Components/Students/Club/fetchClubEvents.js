// src/api/fetchClubEvents.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";


export const fetchClubEvents = async (clubId, onTokenError) => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return null;

    const [pubRes, intRes] = await Promise.all([
      fetchBaseResponse(`/api/clubs/${clubId}/events?visibility=PUBLIC`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }),
      fetchBaseResponse(`/api/clubs/${clubId}/events?visibility=INTERNAL`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
    ]);

    if (pubRes.status === 401 || intRes.status === 401) {
      await onTokenError();
      return [];
    }

    const now = new Date();
    const merged = [...(pubRes.data || []), ...(intRes.data || [])];
    return merged.filter(
      (e) => e.status === "APPROVED" && new Date(e.eventDate) > now
    );
  } catch (err) {
    console.error("Error fetching club events:", err);
    return [];
  }
};
