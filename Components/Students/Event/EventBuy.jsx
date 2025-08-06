import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { useNavigation } from "@react-navigation/native";

const EventBuy = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedQR, setSelectedQR] = React.useState(null);

  const navigation = useNavigation();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(
          `/api/registrations/my-buy-events`,
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
        } else {
          throw new Error(`HTTP Status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFormatStyle = (format) => {
    switch (format) {
      case "OFFLINE":
        return { backgroundColor: "#ffebee", borderColor: "#e53935" };
      case "ONLINE":
        return { backgroundColor: "#e3f2fd", borderColor: "#1e88e5" };
      case "MIX":
        return { backgroundColor: "#f3e5f5", borderColor: "#8e24aa" };
      default:
        return { backgroundColor: "#eceff1", borderColor: "#90a4ae" };
    }
  };

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.eventDate).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    const isPaid = item.paymentStatus === "COMPLETED";

    return (
      <View
        style={[
          styles.eventContainer,
          { borderColor: isPaid ? "#4caf50" : "#f44336" }
        ]}
      >
        {item.thumbnail && (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        )}

        <Text style={styles.eventTitle}>Tên sự kiện: {item.title}</Text>

        <Text style={styles.detailLine}>🗓 Ngày tổ chức: {formattedDate}</Text>
        <Text style={styles.detailLine}>📍 Địa điểm: {item.location}</Text>

        <View style={styles.detailLineRow}>
          <Text style={styles.detailLabel}>🎯 Hình thức:</Text>
          <View style={[styles.formatBadge, getFormatStyle(item.format)]}>
            <Text style={styles.formatText}>
              {item.format === "OFFLINE"
                ? "Offline"
                : item.format === "ONLINE"
                ? "Online"
                : "Offline & Online"}
            </Text>
          </View>
        </View>

        <View style={styles.detailLineRow}>
          <Text style={styles.detailLabel}>💳 Trạng thái:</Text>
          <View
            style={[
              styles.formatBadge,
              {
                backgroundColor: isPaid ? "#e8f5e9" : "#ffebee",
                borderColor: isPaid ? "#388e3c" : "#d32f2f"
              }
            ]}
          >
            <Text
              style={[
                styles.formatText,
                { color: isPaid ? "#388e3c" : "#d32f2f" }
              ]}
            >
              {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </Text>
          </View>
        </View>

        <Text style={styles.detailLine}>
          📝 Ngày đăng ký:{" "}
          {new Date(item.registrationDate).toLocaleString("vi-VN")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedQR(item.qrCode);
            setModalVisible(true);
          }}
          style={styles.qrBox}
        >
          <Text style={styles.qrText}>🎟 Mã QR Check-in (bấm để phóng to):</Text>
          <Image
            source={{ uri: `data:image/png;base64,${item.qrCode}` }}
            style={styles.qrImage}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f8ff" }}>
      {/* Nút back thủ công */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      <Header title="🎫 Sự kiện đã mua" navigation={navigation} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={{ marginTop: 10, fontSize: 16 }}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.registrationId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Bạn chưa đăng ký sự kiện nào 🥲</Text>
          }
        />
      )}

      {/* Modal phóng to QR */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔍 Mã QR Check-in</Text>
            <Image
              source={{ uri: `data:image/png;base64,${selectedQR}` }}
              style={styles.modalImage}
            />
            <Text style={styles.modalHint}>(Chạm bất kỳ đâu để thoát)</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default EventBuy;

const styles = StyleSheet.create({
  list: {
    marginTop: 100
  },
  eventContainer: {
    padding: 18,
    marginBottom: 20
  },
  thumbnail: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10
  },
  detailLine: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6
  },
  detailLineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8
  },
  detailLabel: {
    fontSize: 15,
    color: "#333"
  },
  formatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1
  },
  formatText: {
    fontSize: 13,
    fontWeight: "600"
  },
  qrBox: {
    marginTop: 14,
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#90caf9",
    padding: 12,
    alignItems: "center"
  },
  qrText: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
    color: "#0d47a1"
  },
  qrImage: {
    width: 140,
    height: 140,
    resizeMode: "contain"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888"
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    maxWidth: "90%"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  modalImage: {
    width: 260,
    height: 260,
    resizeMode: "contain"
  },
  modalHint: {
    marginTop: 12,
    fontSize: 13,
    color: "#777"
  },
  backButtonContainer: {
    position: "absolute",
    top: 110,
    left: 20,
    zIndex: 100,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },

  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600"
  }
});
