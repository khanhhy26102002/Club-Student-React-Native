import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const getStatusColor = (status) => {
  switch (status) {
    case "TODO":
      return "#FACC15";
    case "IN_PROGRESS":
      return "#3B82F6";
    case "DONE":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "TODO":
      return "🕐 Chưa làm";
    case "IN_PROGRESS":
      return "🔧 Đang làm";
    case "DONE":
      return "✅ Đã hoàn thành";
    default:
      return "Không xác định";
  }
};

const EventTaskViewId = () => {
  const route = useRoute();
  const { eventId, taskId } = route.params;
  console.log("🧾 eventId:", eventId);
  console.log("🧾 taskId:", taskId);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(
          `/api/tasks/${eventId}/${taskId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200 && response.data) {
          setData(response.data);
          setErrorMessage(null);
        } else {
          setErrorMessage("Không tìm thấy nhiệm vụ hoặc sự kiện.");
        }
      } catch (error) {
        console.error("❌ Fetch task detail error:", error);
        setErrorMessage("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, taskId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  const dueDate = new Date(data.dueDate).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const createdAt = new Date(data.createdAt).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>📋 Chi tiết nhiệm vụ</Text>
        <View style={styles.card}>
          <Text style={styles.taskTitle}>{data.title}</Text>
          <Text style={styles.taskDesc}>{data.description}</Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(data.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(data.status)}</Text>
          </View>

          <Text style={styles.taskMeta}>
            👤 Người giao nhiệm vụ: {data.assignedUser}
          </Text>
          <Text style={styles.taskMeta}>📅 Hạn chót: {dueDate}</Text>
          <Text style={styles.taskMeta}>🕓 Tạo lúc: {createdAt}</Text>
        </View>
      </View>
    </>
  );
};

export default EventTaskViewId;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8
  },
  taskDesc: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 8
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 6
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500"
  },
  taskMeta: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4
  }
});
