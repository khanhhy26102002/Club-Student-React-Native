import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
// list event của user
const EventRoles = () => {
  const route = useRoute();
  const { eventId } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/event-roles/my/${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setData(response.data);
        } else if (response.status === 1002) {
          Alert.alert(
            "Thông báo",
            "Bạn chưa được phân vai trò nào trong sự kiện này."
          );
        } else if (response.status === 403) {
          Alert.alert(
            "🚫 Không có quyền",
            "Bạn không có quyền truy cập sự kiện này."
          );
        } else if (response.status === 404) {
          Alert.alert("❌ Không tìm thấy", "Không tìm thấy vai trò sự kiện.");
        } else {
          throw new Error(`Lỗi không xác định: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Lỗi lấy vai trò sự kiện:", error);
        Alert.alert(
          "Lỗi",
          error.message || "Đã xảy ra lỗi khi kết nối đến máy chủ."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>👤 {item?.userFullName}</Text>
      <Text style={styles.role}>🔖 Vai trò: {item?.roleName}</Text>
      <Text style={styles.date}>
        🕓 Ngày phân công:{" "}
        {new Date(item?.assignedAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </Text>
    </View>
  );
  return (
    <>
      <Header />
      <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <Text style={styles.title}>📋 Danh sách vai trò sự kiện</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 30 }}
          />
        ) : data?.length === 0 ? (
          <Text
            style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}
          >
            Không có thành viên nào được phân vai trong sự kiện này.
          </Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.userId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </View>
    </>
  );
};

export default EventRoles;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#2563EB",
    marginTop: 12,
    marginBottom: 16
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6
  },
  role: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4
  },
  date: {
    fontSize: 14,
    color: "#6B7280"
  }
});
