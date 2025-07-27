import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const EventHistory = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params;
  const [statusFilter, setStatusFilter] = React.useState("COMPLETED");
  const [registeredEvents, setRegisteredEvents] = React.useState([]);
  const [loadingEvents, setLoadingEvents] = React.useState(false);
  const [eventId, setEventId] = React.useState("");
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const fetchEventsByStatus = async (status) => {
    setLoadingEvents(true);
    const token = await AsyncStorage.getItem("jwt");

    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token");
      return;
    }

    try {
      const response = await fetchBaseResponse(
        `/api/registrations/registered-event/${userId}?status=${status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        console.log("✅ Registered events:", response.data);
        setRegisteredEvents(response.data || []);
      } else if (response.status === 5008) {
        Alert.alert("Thất bại", "Bạn chưa đăng ký sự kiện này");
        setRegisteredEvents([]); // đảm bảo danh sách rỗng
      } else {
        Alert.alert("Lỗi", response.message || "Không lấy được sự kiện");
      }
    } catch (error) {
      console.error("Fetch error:", error);

      // Nếu có response từ server
      if (error.response && error.response.data) {
        const { status, message } = error.response.data;

        if (status === 5008) {
          setRegisteredEvents([]);
          Alert.alert("Thông báo", "Bạn chưa đăng ký sự kiện nào."); // Thêm dòng này
        } else {
          Alert.alert("Lỗi", message || "Lỗi không xác định từ máy chủ");
        }
      } else {
        Alert.alert("Lỗi", "Không thể kết nối máy chủ");
      }
    } finally {
      setLoadingEvents(false);
    }
  };

  React.useEffect(() => {
    fetchEventsByStatus(statusFilter);
  }, [statusFilter]);

  const handleFetchQR = () => {
    if (!eventId) {
      Alert.alert("Lỗi", "Vui lòng nhập mã sự kiện.");
      return;
    }

    Alert.alert("QR", `Lấy QR cho sự kiện ID: ${eventId}`);
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📜 Lịch sử sự kiện</Text>

        <View style={styles.filterGroup}>
          {["COMPLETED", "PENDING", "FAILED"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.activeFilterButton
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.activeFilterButtonText
                ]}
              >
                {status === "COMPLETED"
                  ? "✅ Đã tham gia"
                  : status === "PENDING"
                  ? "⏳ Đang chờ"
                  : "❌ Thất bại"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loadingEvents ? (
          <ActivityIndicator
            size="large"
            color="#1f3c88"
            style={{ marginVertical: 20 }}
          />
        ) : registeredEvents.length === 0 ? (
          <Text style={styles.emptyText}>
            Không có sự kiện nào phù hợp với trạng thái này.
          </Text>
        ) : (
          <View style={{ width: "100%", marginBottom: 20 }}>
            {registeredEvents.map((event) => (
              <TouchableOpacity
                key={event.eventId}
                style={styles.eventCard}
                onPress={() => {
                  setEventId(String(event.eventId));
                  setSelectedEvent(event); // lưu cả sự kiện để kiểm tra status
                  navigation.navigate("Event", {
                    screen: "EventRegistration",
                    params: {
                      eventId: event.eventId,
                      title: event.title
                    }
                  });
                }}
              >
                <Text style={styles.eventTitle}>📌 {event.title}</Text>
                <Text style={styles.eventDate}>
                  🕓 {new Date(event.eventDate).toLocaleString("vi-VN")}
                </Text>
                <Text style={styles.eventLocation}>📍 {event.location}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedEvent ? (
          selectedEvent.status === "COMPLETED" ? (
            <>
              <Text style={styles.label}>🔍 Mã QR của sự kiện đã tham gia</Text>
              <TouchableOpacity style={styles.button} onPress={handleFetchQR}>
                <Text style={styles.buttonText}>
                  📥 Lấy mã QR cho sự kiện #{selectedEvent.eventId}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.label} color="red">
              ❗ Bạn chưa thanh toán hoặc sự kiện chưa hoàn tất nên không thể
              lấy mã QR.
            </Text>
          )
        ) : (
          <Text style={styles.label}>📌 Bấm vào một sự kiện để hiện mã QR</Text>
        )}

        {loadingEvents && (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    </>
  );
};

export default EventHistory;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 20,
    textAlign: "center"
  },
  filterGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 8,
    flexWrap: "wrap"
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1f3c88",
    backgroundColor: "#fff"
  },
  filterButtonText: {
    color: "#1f3c88",
    fontWeight: "600"
  },
  activeFilterButton: {
    backgroundColor: "#1f3c88"
  },
  activeFilterButtonText: {
    color: "#fff"
  },
  eventCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 4
  },
  eventDate: {
    fontSize: 14,
    color: "#555"
  },
  eventLocation: {
    fontSize: 14,
    color: "#888"
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    color: "#333"
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12
  },
  button: {
    backgroundColor: "#1f3c88",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginBottom: 10
  }
});
