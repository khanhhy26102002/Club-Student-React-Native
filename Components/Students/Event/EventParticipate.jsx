import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const EventParticipate = ({ navigation }) => {
  const route = useRoute();
  const { eventId, title } = route.params;
  const [data, setData] = React.useState([]);
  const [ticketId, setTicketId] = React.useState("");
  const [loading, setLoading] = React.useState(false); // 🆕 Loading state
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(`/tickets/event/${eventId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("Không fetching được data");
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  const handleOpenPayment = async (e) => {
    e.preventDefault();
    const token = await AsyncStorage.getItem("jwt");
    setLoading(true); // 🆕 Start loading
    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("ticketId", ticketId);
    try {
      const response = await fetchBaseResponse("/registrations/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: formData
      });

      if (response.status === 200) {
        Alert.alert("✅ Thành công", "Bạn đã đăng kí sự kiện thành công");
        navigation.navigate("Event", {
          screen: "Payment",
          params: {
            registrationId: response.data.registrationId,
            paymentUrl: response.data.message,
            qrCode: response.data.qrCode
          }
        });
      } else if (response.status === 400 || response.status === 422) {
        throw {
          ...response,
          message:
            response.data?.message ||
            "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại."
        };
      } else {
        throw response;
      }
    } catch (error) {
      // Xử lý dữ liệu lỗi linh hoạt và an toàn hơn
      const responseData =
        error?.response?.data && typeof error.response.data === "object"
          ? error.response.data
          : error?.data && typeof error.data === "object"
          ? error.data
          : {};

      const serverStatus = responseData.status ?? error?.status ?? null;
      const serverMessage =
        responseData.message ?? error?.message ?? "Không xác định";

      console.log("📦 error =", error);
      console.log("📦 responseData =", responseData);
      console.log("📦 serverStatus =", serverStatus);
      console.log("📦 serverMessage =", serverMessage);

      // ✅ Hiển thị alert dựa trên status
      if (serverStatus === 5005) {
        Alert.alert("Thông báo", "⚠️ Bạn đã đăng kí sự kiện này trước đó.");
      } else if (serverStatus === 5004) {
        Alert.alert("Thiếu thông tin", "Sự kiện này yêu cầu chọn vé.");
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
      setLoading(false); // 🆕 End loading
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎟️ Đăng ký sự kiện</Text>
        <Text style={styles.title}>Tên sự kiện: {title}</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🎫 Chọn vé</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              key={ticketId}
              selectedValue={ticketId}
              onValueChange={(itemValue) => setTicketId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Chọn vé --" value="" />
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
    color: "#1f2937"
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
  input: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
    color: "#111827"
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
  }
});

export default EventParticipate;
