import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

const EventHistory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const [statusFilter, setStatusFilter] = React.useState("COMPLETED");
  const [registeredEvents, setRegisteredEvents] = React.useState([]);
  const [loadingEvents, setLoadingEvents] = React.useState(false);
  const [qrValue, setQrValue] = React.useState(null);
  const [showQRModal, setShowQRModal] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);

  const fetchEventsByStatus = async (status) => {
    setLoadingEvents(true);
    const token = await AsyncStorage.getItem("jwt");

    if (!token) {
      if (!firstLoad) {
        Alert.alert("Lỗi", "Không tìm thấy token");
      }
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
        setRegisteredEvents(response.data || []);
      } else if (response.status === 5008) {
        setRegisteredEvents([]);
        if (!firstLoad) {
          Alert.alert("Thông báo", "Bạn chưa đăng ký sự kiện nào.");
        }
      } else {
        if (!firstLoad) {
          Alert.alert("Lỗi", response.message || "Không lấy được sự kiện");
        }
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      if (!firstLoad) {
        Alert.alert("Lỗi", error.message || "Không thể kết nối máy chủ");
      }
    } finally {
      setLoadingEvents(false);
      if (firstLoad) setFirstLoad(false);
    }
  };

  React.useEffect(() => {
    if (userId) {
      fetchEventsByStatus(statusFilter);
    }
  }, [statusFilter, userId]);

  const handleFetchQR = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        Alert.alert("Lỗi", "Không tìm thấy token.");
        return;
      }

      const response = await fetchBaseResponse(
        `/api/registrations/myqr?eventId=${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        let qrData = response.data;
        if (typeof qrData === "object" && qrData.image) {
          qrData = qrData.image;
        }
        setQrValue(qrData);
      } else {
        Alert.alert("Lỗi", response.message || "Không thể lấy mã QR.");
      }
    } catch (error) {
      console.error("❌ QR error:", error);
      Alert.alert("Lỗi", error.message || "Lỗi máy chủ khi lấy mã QR.");
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử sự kiện</Text>
        <View style={styles.filterGroup}>
          {["COMPLETED", "PENDING", "FAILED"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.activeFilterButton
              ]}
              onPress={() => {
                setStatusFilter(status);
                setQrValue(null);
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.activeFilterButtonText
                ]}
              >
                {status === "COMPLETED"
                  ? " Đã tham gia"
                  : status === "PENDING"
                  ? " Đang chờ"
                  : " Thất bại"}
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
              <View key={event.eventId} style={styles.eventCardWrapper}>
                <TouchableOpacity
                  style={styles.eventCard}
                  onPress={async () => {
                    if (event.paymentStatus === "COMPLETED") {
                      setQrValue(null);
                      await handleFetchQR(event.eventId);
                      setShowQRModal(true);
                    } else if (event.paymentStatus === "PENDING") {
                      navigation.navigate("Event", {
                        screen: "EventRegistration",
                        params: {
                          eventId: event.eventId,
                          title: event.title
                        }
                      });
                    } else {
                      Alert.alert(
                        "Thông báo",
                        "Sự kiện chưa thanh toán hoặc chưa hoàn tất."
                      );
                    }
                  }}
                >
                  <Text style={styles.eventTitle}>📌 {event.title}</Text>
                  <Text style={styles.eventDate}>
                    🕓 {new Date(event.eventDate).toLocaleString("vi-VN")}
                  </Text>
                  <Text style={styles.eventLocation}>📍 {event.location}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal QR */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📎 Mã QR sự kiện của bạn</Text>
            {qrValue ? (
              <QRCode value={qrValue} size={200} />
            ) : (
              <Text>Đang tải mã QR...</Text>
            )}
            <TouchableOpacity
              onPress={() => setShowQRModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EventHistory;

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#f57c00",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 40,
    height: 40,
    marginTop: 10,
    marginLeft: 10
  },
  container: {
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 20,
    textAlign: "center",
    marginTop: -33
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
  eventCardWrapper: {
    marginBottom: 20
  },
  eventCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
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
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginBottom: 10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f3c88"
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#1f3c88",
    borderRadius: 10
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600"
  }
});
