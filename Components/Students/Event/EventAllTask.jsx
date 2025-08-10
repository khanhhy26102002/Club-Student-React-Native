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

const EventAllTask = ({ navigation }) => {
  const route = useRoute();
  const { eventId } = route.params;
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [roleName, setRoleName] = React.useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("jwt");

          // Song song gọi 2 API bằng Promise.all
          const [taskRes, roleRes] = await Promise.all([
            fetchBaseResponse(`/api/tasks/mytask?eventId=${eventId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }),
            fetchBaseResponse(`/api/event-roles/my/${eventId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            })
          ]);

          // Xử lý dữ liệu task
          if (taskRes.status === 200) {
            setData(taskRes.data);
          } else {
            setData([]);
          }

          // Xử lý role
          if (roleRes.status === 200 && roleRes.data?.roleName) {
            setRoleName(roleRes.data.roleName);
          } else {
            setRoleName(null);
          }
        } catch (error) {
          if (error.status === 1003) {
            Alert.alert(
              "Thông báo",
              error.message || "Không có task trong sự kiện"
            );
            setData([]);
          } else {
            console.log("❌ Lỗi khi fetch data:", error);
            Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu.");
          }
          setRoleName(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [eventId])
  );

  const renderItem = ({ item }) => {
    const statusColors = {
      TODO: "#FF9800",
      IN_PROGRESS: "#2196F3",
      DONE: "#4CAF50"
    };

    return (
      <View style={styles.taskCard}>
        <View style={styles.headerRow}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[item.status] || "#9E9E9E" }
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.taskDesc}>{item.description}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📅 {item.eventTitle}</Text>
          <Text style={styles.infoText}>📌 {item.parentTitle}</Text>
          <Text style={styles.infoText}>👤 {item.userName}</Text>
          <Text style={styles.infoText}>📝 {item.parentUserName}</Text>
          <Text style={styles.dueDate}>
            ⏰ {new Date(item.dueDate).toLocaleString("vi-VN")}
          </Text>
        </View>
      </View>
    );
  };

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
          <FlatList
            data={data}
            keyExtractor={(item) => item.taskId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Nút Checkin cố định dưới cùng */}
        {roleName === "CHECKIN" && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => navigation.navigate("Login", { eventId })}
            activeOpacity={0.8}
          >
            <Text style={styles.checkinText}>📍 Checkin Event</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8F9FA"
  },
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  taskCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
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
    fontWeight: "bold",
    color: "#333",
    flex: 1
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  },
  taskDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10
  },
  infoBox: {
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 8
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4
  },
  dueDate: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#888",
    marginTop: 4
  },
  checkinButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fe8a3c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5
  },
  checkinText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});

export default EventAllTask;
