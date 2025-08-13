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
  const { eventId } = route.params;
  console.log("EventId", eventId);
  const [data, setData] = React.useState([]);
  const [eventRole, setEventRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState(null); // user đang filter

  const renderStatus = (status) => {
    let color = "#888"; // default
    let label = status || "UNKNOWN";

    switch (status) {
      case "TODO":
        color = "#fff"; // cam sáng
        label = "Chưa làm";
        break;
      case "IN_PROGRESS":
        color = "#fff"; // cam đậm
        label = "Đang làm";
        break;
      case "DONE":
        color = "#fff"; // xanh lá
        label = "Hoàn thành";
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
          const taskRes = await fetchBaseResponse(
            `/api/tasks/mytask?eventId=${eventId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
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
            setData(
              Array.isArray(taskRes.data) ? taskRes.data : [taskRes.data]
            );
          } else setData([]);
          if (roleRes.status === 200) setEventRole(roleRes.data);
          else setEventRole(null);
        } catch (error) {
          console.log("❌ Lỗi khi fetch data:", error);
          Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu.");
          setEventRole(null);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [eventId])
  );

  // Lọc data theo user
  // Lọc data theo user và sắp xếp theo ngày tạo mới nhất
  const filteredData = (
    selectedUser ? data.filter((item) => item.userName === selectedUser) : data
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text style={styles.taskTitle}>{item.eventTitle}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{renderStatus(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.taskDesc}>{stripMarkdown(item.description)}</Text>

      <View style={styles.infoBox}>
        <TouchableOpacity onPress={() => setSelectedUser(item.userName)}>
          <Text
            style={[styles.infoText, { fontWeight: "bold", color: "#FB8C00" }]}
          >
            {item.userName}
          </Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>{item.eventTitle}</Text>
        <Text style={styles.infoText}>
          {stripMarkdown(item.description)}
        </Text>
        <Text style={styles.infoText}>
          {new Date(item.createdAt).toLocaleString("vi-VN")}
        </Text>
        <Text style={styles.dueDate}>
          {new Date(item.dueDate).toLocaleString("vi-VN")}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Quay về</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fe8a3c" />
            <Text style={{ marginTop: 8 }}>Đang tải...</Text>
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ fontSize: 16, color: "#777" }}>
              Không có task nào.
            </Text>
            {selectedUser && (
              <TouchableOpacity onPress={() => setSelectedUser(null)}>
                <Text style={{ color: "#FB8C00", marginTop: 10 }}>
                  Xem tất cả task
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.taskId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {eventRole?.roleName === "CHECKIN" && filteredData.length > 0 && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => navigation.navigate("Login", { eventId })}
          >
            <Text style={styles.checkinButtonText}>Checkin</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 }, // nền nhạt cam
  container: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  taskCard: {
    backgroundColor: "#FFE0B2", // card nhạt cam
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#F57C00",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    marginTop: 30,
    marginBottom: -10
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E65100", // chữ cam đậm
    marginBottom: 10
  },
  statusContainer: {
    backgroundColor: "#FB8C00", // cam sáng
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  taskDesc: { fontSize: 14, color: "black", marginBottom: 10 }, // chữ cam đỏ
  infoBox: { backgroundColor: "#FFE0B2", padding: 10, borderRadius: 8 },
  infoText: { fontSize: 13, color: "black", marginBottom: 4 },
  dueDate: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#D84315",
    marginTop: 4
  },
  checkinButton: {
    backgroundColor: "#FB8C00", // nút cam sáng
    padding: 14,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center"
  },
  checkinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10
  },
  backButtonText: {
    color: "#FB8C00",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default EventAllTask;
