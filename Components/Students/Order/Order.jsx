import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const Order = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/api/registrations/orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        // Nếu thành công
        setData(response.data);
      } catch (error) {
        console.error("❌ Error:", error);

        // TH1: Nếu là lỗi từ response trả về
        if (error?.message === "No orders found for this user") {
          Alert.alert("Thông báo", "Bạn không có đơn hàng nào.");
          setData([]);
        } else {
          Alert.alert("Lỗi", "Không lấy được đơn hàng.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.paymentDate).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={{ flex: 1 }}>
        <Header title="🧾 Đơn hàng đã thanh toán" navigation={navigation} />
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ fontSize: 16, color: "#666" }}>
              Bạn không có đơn hàng nào.
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.paymentId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </View>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return {
          badge: { backgroundColor: "#fff3e0", borderColor: "#ff9800" },
          text: { color: "#ef6c00" }
        };
      case "COMPLETED":
        return {
          badge: { backgroundColor: "#e8f5e9", borderColor: "#4caf50" },
          text: { color: "#388e3c" }
        };
      case "FAILED":
        return {
          badge: { backgroundColor: "#ffebee", borderColor: "#f44336" },
          text: { color: "#c62828" }
        };
      default:
        return {
          badge: { backgroundColor: "#eceff1", borderColor: "#90a4ae" },
          text: { color: "#607d8b" }
        };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ thanh toán";
      case "COMPLETED":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return "Không rõ trạng thái";
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={{ marginTop: 10 }}>Đang tải đơn hàng...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.paymentId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Không có đơn hàng nào 🥲</Text>
          }
        />
      )}
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5faff",
    padding: 16
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10
  },
  line: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 10
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 50
  }
});
