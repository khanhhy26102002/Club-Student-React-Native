import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Alert
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../../Header/Header";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const Payment = ({ navigation }) => {
  const route = useRoute();
  const { registrationId, paymentUrl, qrCode } = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // giả lập delay 1s

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.headerText}>Bạn đã đăng ký thành công!</Text>

            <LinearGradient
              colors={["#fdfbfb", "#ebedee"]}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.row}>
                <Text style={styles.cardLabel}>Mã đăng ký:</Text>
                <Text style={styles.cardValue}>{registrationId}</Text>
              </View>
            </LinearGradient>
            {qrCode ? (
              <View style={styles.qrBox}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <View style={styles.qrWrapper}>
                    <Image
                      source={{ uri: `data:image/png;base64,${qrCode}` }}
                      style={styles.qrImage}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.qrNote}>
                  📷 Nhấn vào mã QR để xem lớn hơn
                </Text>
                <Modal visible={modalVisible} transparent animationType="fade">
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                  >
                    <View style={styles.modalContent}>
                      <Image
                        source={{ uri: `data:image/png;base64,${qrCode}` }}
                        style={styles.modalImage}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.paymentButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("Event", {
                    screen: "PaymentWebView",
                    params: { paymentUrl }
                  })
                }
              >
                <Text style={styles.paymentButtonText}>💳 Thanh toán</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 24,
    alignItems: "center"
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12
  },
  headerText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 24
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 32
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  cardLabel: {
    fontSize: 17,
    color: "#6b7280"
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginLeft: 8
  },
  paymentButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignSelf: "center"
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  qrBox: {
    alignItems: "center",
    marginTop: 20
  },
  qrWrapper: {
    width: 200,
    height: 200,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3
  },
  qrImage: {
    width: "100%",
    height: "100%"
  },
  qrNote: {
    marginTop: 10,
    fontSize: 16,
    color: "#333"
  },
  noQrText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: "80%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden"
  },
  modalImage: {
    width: "100%",
    height: "100%"
  }
});
