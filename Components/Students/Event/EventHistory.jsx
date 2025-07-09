import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const EventHistory = () => {
  const [loading, setLoading] = useState(false);
  const [qrBase64, setQrBase64] = useState("");
  const [eventId, setEventId] = useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  console.log("qrBase64:", qrBase64);
  const handleFetchQR = async () => {
    if (!eventId) {
      Alert.alert("Lỗi", "Vui lòng nhập mã sự kiện (eventId)");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    if (!token) {
      Alert.alert("Lỗi", "Không tìm thấy token đăng nhập");
      setLoading(false);
      return;
    }
    try {
      const response = await fetchBaseResponse(
        `/registrations/registrations/myqr?eventId=${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Response:", response);
      if (response.status === 200) {
        setQrBase64(response.data);
        setModalVisible(true);
      } else {
        Alert.alert("Lỗi", response.message || "Không lấy được dữ liệu");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        Alert.alert(
          "Lỗi",
          error.response.data?.message || "Lỗi không xác định"
        );
      } else {
        console.error("Fetch error:", error);
        Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📜 Lịch sử sự kiện</Text>

        <Text style={styles.label}>🔍 Nhập mã sự kiện để xem QR</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 12345"
          placeholderTextColor="#aaa"
          value={eventId}
          onChangeText={setEventId}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleFetchQR}>
          <Text style={styles.buttonText}>📥 Lấy mã QR</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Modal hiển thị mã QR */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>✖</Text>
              </TouchableOpacity>
              <Text style={styles.qrTitle}>🎫 Mã QR của bạn</Text>
              <Image
                source={{ uri: `data:image/png;base64,${qrBase64}` }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={styles.qrNote}>Đưa mã này khi tham gia sự kiện</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

export default EventHistory;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1
  },
  closeText: {
    fontSize: 20,
    color: "#666"
  },
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#444"
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  button: {
    backgroundColor: "#1f3c88",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  qrCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1f3c88"
  },
  qrImage: {
    width: 250, // 👉 tăng kích thước từ 200 → 250 (hoặc hơn)
    height: 250,
    marginVertical: 20
  },
  qrNote: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    fontStyle: "italic"
  }
});
