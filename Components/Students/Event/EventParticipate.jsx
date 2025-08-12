import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const EventParticipate = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId, title } = route.params;

  const [data, setData] = React.useState([]);
  const [ticketId, setTicketId] = React.useState("");
  const [selectedTicketDetail, setSelectedTicketDetail] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingTickets, setLoadingTickets] = React.useState(true);
  const [loadingTicketDetail, setLoadingTicketDetail] = React.useState(false);

  // Fetch danh sách vé theo eventId
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("jwt");
    setLoadingTickets(true);
    try {
      const response = await fetchBaseResponse(
        `/api/tickets/event/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status === 200) {
        setData(response.data);
        if (response.data.length > 0) {
          setTicketId(response.data[0].ticketId); // auto chọn vé đầu tiên
        } else {
          setTicketId(""); // Không có vé
          setSelectedTicketDetail(null);
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không lấy được danh sách vé");
    } finally {
      setLoadingTickets(false);
    }
  };

  // Fetch chi tiết vé khi ticketId thay đổi
  const fetchTicketDetail = async () => {
    if (!ticketId) {
      setSelectedTicketDetail(null);
      return;
    }
    const token = await AsyncStorage.getItem("jwt");
    setLoadingTicketDetail(true);
    try {
      const response = await fetchBaseResponse(`/api/tickets/${ticketId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setSelectedTicketDetail(response.data);
      } else {
        setSelectedTicketDetail(null);
      }
    } catch (error) {
      setSelectedTicketDetail(null);
    } finally {
      setLoadingTicketDetail(false);
    }
  };

  // Khi ticketId thay đổi thì gọi lấy chi tiết vé
  React.useEffect(() => {
    fetchTicketDetail();
  }, [ticketId]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleOpenPayment = async () => {
    if (data.length > 0 && !ticketId) {
      Alert.alert("Lỗi", "Vui lòng chọn vé.");
      return;
    }

    if (data.length > 0 && !selectedTicketDetail) {
      Alert.alert("Lỗi", "Không lấy được thông tin vé.");
      return;
    }

    const token = await AsyncStorage.getItem("jwt");
    setLoading(true);
    const formData = new FormData();
    formData.append("eventId", eventId);

    if (data.length > 0) {
      formData.append("ticketId", ticketId);
    }

    try {
      const response = await fetchBaseResponse("/api/registrations/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      });

      if (response.status === 200) {
        Alert.alert("✅ Thành công", "Bạn đã đăng kí sự kiện thành công");

        if (data.length > 0 && selectedTicketDetail?.price === 0) {
          navigation.navigate("Home");
        } else if (data.length > 0) {
          navigation.navigate("Event", {
            screen: "PaymentWebView",
            params: {
              registrationId: response.data.registrationId,
              paymentUrl: response.data.message,
              qrCode: response.data.qrCode,
              title,
              eventId
            }
          });
        } else {
          // Không có vé, chuyển về Main (hoặc bạn có thể điều chỉnh)
          navigation.navigate("Home");
        }
      } else {
        throw {
          ...response,
          status: response.data?.status ?? response.status,
          message: response.data?.message ?? "Có lỗi xảy ra"
        };
      }
    } catch (error) {
      const responseData =
        error?.response?.data && typeof error.response.data === "object"
          ? error.response.data
          : error?.data && typeof error.data === "object"
          ? error.data
          : error;

      const serverStatus =
        typeof responseData.status === "number"
          ? responseData.status
          : typeof error?.status === "number"
          ? error.status
          : null;

      const serverMessage =
        responseData.message ?? error?.message ?? "Không xác định";

      if (serverStatus === 5005) {
        Alert.alert("Thông báo", "⚠️ Bạn đã đăng kí sự kiện này trước đó.");
      } else if (serverStatus === 5004) {
        Alert.alert("Thiếu thông tin", "Sự kiện này yêu cầu chọn vé.");
      } else if (serverStatus === 5003) {
        Alert.alert("Lỗi", "Sự kiện này không có vé");
      } else if (
        serverStatus === 1000 &&
        serverMessage === "Entity not found"
      ) {
        Alert.alert("Không tìm thấy", "Sự kiện hoặc vé không tồn tại.");
      } else if (serverMessage) {
        Alert.alert("Lỗi", serverMessage);
      } else {
        Alert.alert("Lỗi", "Không đăng kí được sự kiện");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Nút quay về */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Quay về</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🎟️ Đăng ký sự kiện</Text>
        <Text style={styles.title}>Tên sự kiện: {title}</Text>

        {loadingTickets ? (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={{ marginVertical: 20 }}
          />
        ) : data.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              marginVertical: 20,
              color: "green",
              fontSize: 16
            }}
          >
            Sự kiện này không yêu cầu vé, bạn có thể đăng ký ngay.
          </Text>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🎫 Chọn vé</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={ticketId}
                  onValueChange={(itemValue) => setTicketId(itemValue)}
                  style={styles.picker}
                >
                  {data.map((ticket) => (
                    <Picker.Item
                      key={ticket.ticketId}
                      label={`${ticket.name} - ${ticket.price} VNĐ`}
                      value={ticket.ticketId}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {loadingTicketDetail ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : selectedTicketDetail ? (
              <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
                <Text style={{ fontWeight: "600", color: "#333" }}>
                  Mô tả vé:
                </Text>
                <Text style={{ color: "#555" }}>
                  {selectedTicketDetail.description || "(Không có mô tả)"}
                </Text>
              </View>
            ) : null}
          </>
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleOpenPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng ký & Thanh toán</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#f3f4f6"
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 40,
    color: "#1f2937",
    marginTop: 10
  },
  inputGroup: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151"
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  picker: {
    height: 50,
    width: "100%"
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6
      },
      android: {
        elevation: 4
      }
    })
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700"
  },
  backButton: {
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    marginTop: -50
  },
  backButtonText: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600"
  }
});

export default EventParticipate;
