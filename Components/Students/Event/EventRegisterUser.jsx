import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import React from "react";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";

const EventRegisterUser = ({ route }) => {
  const { userId, eventId } = route.params;
  console.log("📦 route.params:", route.params);
  const [filter, setFilter] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const fetchData = async () => {
  if (!userId) {
    Alert.alert("❌ Thiếu thông tin", "Không tìm thấy userId.");
    return;
  }

  setLoading(true);
  const token = await AsyncStorage.getItem("jwt");
  let endpoint = `/api/registrations/registered-event/${userId}`;
  if (filter) {
    endpoint += `?status=${filter}`;
  }

  console.log("🔑 Token:", token);
  console.log("📡 Endpoint:", endpoint);
  console.log("🧾 eventId:", eventId);

  try {
    const response = await fetchBaseResponse(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const allData = response.data;
      const filtered = eventId
        ? allData.filter((item) => item.eventId === eventId)
        : allData;
      setData(filtered);
    } else {
      throw new Error(`Lỗi API: ${response.message}`);
    }
  } catch (error) {
    const serverMessage =
      error?.response?.data?.message ||
      error.message ||
      "Đã xảy ra lỗi không xác định.";

    console.error("❌ API Error:", error?.response?.data || error);

    if (
      error?.response?.data?.status === 5007 ||
      serverMessage.includes("not registered")
    ) {
      Alert.alert("🚫 Không tìm thấy", "Bạn chưa đăng ký sự kiện này.");
    } else {
      Alert.alert("Lỗi", serverMessage);
    }
  } finally {
    setLoading(false);
  }
};


  React.useEffect(() => {
    fetchData();
  }, [filter, userId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>📌 {item.title}</Text>
      <Text style={styles.description}>📝 {item.description}</Text>
      <Text style={styles.detail}>
        🗓️ Thời gian:{" "}
        {new Date(item.eventDate).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </Text>
      <Text style={styles.detail}>📍 Địa điểm: {item.location}</Text>
      <Text style={styles.detail}>🎯 Hình thức: {item.format}</Text>
      <Text style={styles.status}>📣 Trạng thái: {item.status}</Text>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      {["All", "PENDING", "COMPLETED", "FAILED"].map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filterButton,
            filter === status || (status === "ALL" && filter === null)
              ? styles.activeFilter
              : null
          ]}
          onPress={() => setFilter(status === "ALL" ? null : status)}
        >
          <Text
            style={[
              styles.filterText,
              filter === status || (status === "ALL" && filter === null)
                ? styles.activeFilterText
                : null
            ]}
          >
            {status === "ALL" ? "Tất cả" : status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.heading}>📚 Sự kiện bạn đã đăng ký</Text>
        {renderFilters()}
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : data?.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item.eventId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        ) : (
          <Text style={styles.noData}>🙁 Không có sự kiện nào.</Text>
        )}
      </View>
    </>
  );
};

export default EventRegisterUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827"
  },
  description: {
    marginTop: 4,
    color: "#4B5563"
  },
  detail: {
    marginTop: 4,
    color: "#6B7280"
  },
  status: {
    marginTop: 6,
    fontWeight: "600",
    color: "#2563EB"
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  filterButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8
  },
  activeFilter: {
    backgroundColor: "#2563EB"
  },
  filterText: {
    color: "#374151",
    fontWeight: "500"
  },
  activeFilterText: {
    color: "#FFFFFF"
  },
  noData: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
    color: "#9CA3AF"
  }
});
