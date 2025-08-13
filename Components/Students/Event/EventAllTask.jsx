import { useFocusEffect, useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";

const EventAllTask = ({ navigation }) => {
  const route = useRoute();
  const { eventId, taskId } = route.params;
  console.log("EventId", eventId);
  console.log("TaskId", taskId);
  const [data, setData] = React.useState([]);
  const [eventRole, setEventRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const renderStatus = (status) => {
    let color = "#888"; // mặc định màu xám
    let label = status || "UNKNOWN";

    switch (status) {
      case "TODO":
        color = "#f39c12"; // cam
        label = "Chưa làm";
        break;
      case "DONE":
        color = "#27ae60"; // xanh lá
        label = "Hoàn thành";
        break;
      case "IN_PROGRESS":
        color = "#2980b9"; // xanh dương
        label = "Đang làm";
        break;
      default:
        color = "#888";
        label = status;
    }

    return (
      <Text style={{ color, fontWeight: "bold", fontSize: 13, marginTop: 6 }}>
        📌 Trạng thái: {label}
      </Text>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("jwt");

          // Fetch task data
          const taskRes = await fetchBaseResponse(
            `/api/tasks/${eventId}/${taskId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );

          // Fetch event role data
          const roleRes = await fetchBaseResponse(
            `/api/event-roles/my/${eventId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );

          if (taskRes.status === 200) {
            const tasks = Array.isArray(taskRes.data)
              ? taskRes.data
              : [taskRes.data];
            setData(tasks);
          } else {
            setData([]);
          }

          if (roleRes.status === 200) {
            setEventRole(roleRes.data);
          } else {
            setEventRole(null);
          }
        } catch (error) {
          if (error.status === 1003) {
            Alert.alert(
              "Thông báo",
              error.message || "Không có task trong sự kiện"
            );
            setData([]);
            setEventRole(null);
          } else {
            console.log("❌ Lỗi khi fetch data:", error);
            Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu.");
            setEventRole(null);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [eventId, taskId])
  );

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.taskDesc}>{stripMarkdown(item.description)}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📅 {item.title}</Text>
        <Text style={styles.infoText}>
          📌 {stripMarkdown(item.description)}
        </Text>
        <Text style={styles.infoText}>👤 {item.assignedUser}</Text>
        <Text style={styles.infoText}>
          📝 {new Date(item.createdAt).toLocaleString("vi-VN")}
        </Text>
        <Text style={styles.dueDate}>
          ⏰ {new Date(item.dueDate).toLocaleString("vi-VN")}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fe8a3c" />
            <Text style={{ marginTop: 8 }}>Đang tải...</Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ fontSize: 16, color: "#777" }}>
              Không có task nào.
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={data}
              keyExtractor={(item) => item.taskId.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            />
            {eventRole && eventRole.roleName && (
              <TouchableOpacity
                style={styles.checkinButton}
                onPress={() =>
                  Alert.alert("Checkin", "Bạn đã checkin sự kiện!")
                }
              >
                <Text style={styles.checkinButtonText}>Checkin</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8F9FA" },
  container: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  taskCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    marginTop: 30
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  statusContainer: {
    backgroundColor: "#fe8a3c", // màu nền cam
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },

  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff" // chữ màu trắng cho tương phản
  },

  taskDesc: { fontSize: 14, color: "#555", marginBottom: 10 },
  infoBox: { backgroundColor: "#F1F5F9", padding: 10, borderRadius: 8 },
  infoText: { fontSize: 13, color: "#555", marginBottom: 4 },
  dueDate: { fontSize: 13, fontStyle: "italic", color: "#888", marginTop: 4 },
  checkinButton: {
    backgroundColor: "#fe8a3c",
    padding: 14,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center"
  },
  checkinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default EventAllTask;
