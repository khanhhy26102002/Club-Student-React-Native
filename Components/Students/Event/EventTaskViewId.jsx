import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from "react-native";
import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native"; // thêm useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons"; // thêm icon

const getStatusColor = (status) => {
  switch (status) {
    case "TODO":
      return "#FACC15"; // vàng
    case "IN_PROGRESS":
      return "#3B82F6"; // xanh biển
    case "COMPLETED":
      return "#10B981"; // xanh lá
    case "CANCELLED":
      return "#EF4444"; // đỏ
    default:
      return "#6B7280"; // xám
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
      return "Không xác định";
  }
};

const possibleStatuses = ["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const EventTaskViewId = () => {
  const route = useRoute();
  const navigation = useNavigation(); // lấy navigation
  const { eventId, taskId } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    fetchTaskDetail();
  }, [eventId, taskId]);

  const fetchTaskDetail = async () => {
    setLoading(true);
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

  const updateTaskStatus = async (newStatus) => {
    if (newStatus === data.status) {
      Alert.alert("Thông báo", "Trạng thái này đang được chọn rồi.");
      return;
    }

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      console.log("🔹 updateTaskStatus token:", token);
      console.log("🔹 updateTaskStatus URL:", `/api/tasks/${taskId}/status`);
      console.log("🔹 updateTaskStatus payload:", { status: newStatus });

      const response = await fetchBaseResponse(`/api/tasks/${taskId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(newStatus) // gửi object trực tiếp, không stringify
      });

      console.log("🔹 updateTaskStatus response:", response);

      if (response.status === 200) {
        Alert.alert("Thành công", "Cập nhật trạng thái thành công.");
        // cập nhật local state trực tiếp để UI nhanh phản hồi
        setData((prev) => ({
          ...prev,
          status: newStatus
        }));
      } else {
        Alert.alert(
          "Lỗi",
          `Không thể cập nhật trạng thái. (Mã lỗi: ${response.status})`
        );
      }
    } catch (error) {
      console.error("❌ Update task status error:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Đã xảy ra lỗi khi cập nhật trạng thái."
      );
    } finally {
      setUpdating(false);
    }
  };

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>

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

          <Text style={[styles.title, { marginTop: 20, fontSize: 18 }]}>
            Cập nhật trạng thái nhiệm vụ:
          </Text>

          {possibleStatuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                status === data.status && styles.statusButtonActive
              ]}
              onPress={() => updateTaskStatus(status)} // chỉ truyền status
              disabled={updating}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === data.status && styles.statusButtonTextActive
                ]}
              >
                {getStatusLabel(status)}
              </Text>
            </TouchableOpacity>
          ))}

          {updating && (
            <ActivityIndicator
              size="small"
              color="#2563EB"
              style={{ marginTop: 10 }}
            />
          )}
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  backButtonText: {
    fontSize: 16,
    color: "#2563EB",
    marginLeft: 6,
    fontWeight: "600"
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
  },
  statusButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 10,
    marginVertical: 6,
    alignItems: "center"
  },
  statusButtonActive: {
    backgroundColor: "#2563EB"
  },
  statusButtonText: {
    color: "#374151",
    fontWeight: "600"
  },
  statusButtonTextActive: {
    color: "#fff"
  }
});
