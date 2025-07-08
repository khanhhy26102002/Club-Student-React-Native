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

const EventParticipate = ({ navigation }) => {
  const [eventId, setEventId] = React.useState("");
  const [ticketId, setTicketId] = React.useState("");
  const [loading, setLoading] = React.useState(false); // 🆕 Loading state

  const handleOpenPayment = async () => {
    if (!eventId) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập cả Mã sự kiện và Mã vé.");
      return;
    }

    const token = await AsyncStorage.getItem("jwt");
    const formData = new FormData();
    formData.append("eventId", Number(eventId));
    formData.append("ticketId", Number(ticketId));

    setLoading(true); // 🆕 Start loading
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
        throw new Error(
          response.data?.message ||
            "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại."
        );
      } else {
        throw new Error(`Lỗi không xác định: ${response.status}`);
      }
    } catch (error) {
      const serverStatus = error?.response?.data?.status;
      const serverMessage = error?.response?.data?.message || error.message;

      if (serverStatus === 5005) {
        Alert.alert("Thông báo", "⚠️ Bạn đã đăng kí sự kiện này trước đó.");
      } else {
        Alert.alert("Lỗi", serverMessage || "Không đăng kí được sự kiện");
      }
      console.warn("❌ Server Error:", serverStatus, serverMessage);
    } finally {
      setLoading(false); // 🆕 End loading
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎟️ Đăng ký sự kiện</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>📌 Mã sự kiện</Text>
          <TextInput
            style={styles.input}
            value={eventId}
            onChangeText={setEventId}
            placeholder="Nhập mã sự kiện"
            keyboardType="numeric"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🎫 Mã vé</Text>
          <TextInput
            style={styles.input}
            value={ticketId}
            onChangeText={setTicketId}
            placeholder="Nhập mã vé"
            keyboardType="numeric"
            placeholderTextColor="#9ca3af"
          />
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
