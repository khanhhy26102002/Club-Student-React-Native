import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";

const getStatusColor = (status) => {
  switch (status) {
    case "TODO":
      return "#FBBF24"; // vàng
    case "IN_PROGRESS":
      return "#3B82F6"; // xanh biển
    case "COMPLETED":
      return "#10B981"; // xanh lá
    case "CANCELLED":
      return "#EF4444"; // đỏ
    default:
      return "#9CA3AF"; // xám
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "TODO":
      return "🕐 Chưa làm";
    case "IN_PROGRESS":
      return "🔧 Đang làm";
    case "COMPLETED":
      return "✅ Hoàn thành";
    case "CANCELLED":
      return "❌ Đã huỷ";
    default:
      return "❓ Không xác định";
  }
};

const EventTaskView = ({ navigation }) => {
  const { eventId } = useRoute().params;
  console.log("EventId", eventId);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(`/api/tasks/${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 1003) {
          setErrorMessage("Không có nhiệm vụ nào trong sự kiện này.");
          setData([]);
        } else if (response.status === 6001) {
          setErrorMessage("Sự kiện không tồn tại hoặc đã bị xoá.");
          setData([]);
          setTimeout(() => {
            navigation.goBack();
          }, 3000);
        } else if (response.status !== 200 || !response.data) {
          setErrorMessage("Lỗi không xác định khi lấy nhiệm vụ.");
          setData([]);
        } else {
          const tasks = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setData(tasks);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error("❌ Task fetch error:", error);
        setErrorMessage("Đã xảy ra lỗi trong quá trình tải dữ liệu.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

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

  return (
    <>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🎯 Nhiệm vụ của bạn trong sự kiện</Text>

        {data.map((task) => {
          const dueDate = new Date(task.dueDate).toLocaleString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          const createdAt = new Date(task.createdAt).toLocaleString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <TouchableOpacity
              key={task.taskId}
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "EventTaskViewId",
                  params: {
                    eventId: eventId,
                    taskId: task.taskId
                  }
                })
              }
              style={styles.taskTouchable}
              activeOpacity={0.85}
            >
              <View style={styles.taskCard}>
                <View style={styles.headerRow}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    📝 {task.title}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(task.status) }
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusLabel(task.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.taskDesc} numberOfLines={2}>
                  📄 {task.description}
                </Text>
                <Text style={styles.checkinNote}>
                  🎫 Bạn đang ở vai trò <Text style={styles.bold}>checkin</Text>
                  , hãy kiểm tra nhiệm vụ cần làm tại sự kiện này:
                </Text>
                <Text style={styles.taskDate}>⏰ Hạn chót: {dueDate}</Text>
                <Text style={styles.taskDate}>🕓 Tạo lúc: {createdAt}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
};

export default EventTaskView;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F97316", // cam nổi bật
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    alignSelf: "flex-start",
    marginBottom: 20,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16
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
  taskTouchable: {
    marginBottom: 16
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8
  },
  taskDesc: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6
  },
  checkinNote: {
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 12,
    lineHeight: 22
  },
  bold: {
    fontWeight: "700",
    color: "#2563EB"
  },
  taskDate: {
    fontSize: 13,
    color: "#6B7280"
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  }
});
