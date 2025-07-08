import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../../../Header/Header";
import { LinearGradient } from "expo-linear-gradient";

const Payment = () => {
  const route = useRoute();
  const { registrationId, paymentUrl, qrCode } = route.params;
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

              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() => Linking.openURL(paymentUrl)}
                activeOpacity={0.8}
              >
                <Text style={styles.paymentButtonText}>
                  💳 Mở trang thanh toán
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            {qrCode ? (
              <View style={styles.qrBox}>
                <View style={styles.qrWrapper}>
                  <Image
                    source={{ uri: `data:image/png;base64,${qrCode}` }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.qrNote}>📷 Quét mã QR để thanh toán</Text>
              </View>
            ) : (
              <Text style={styles.noQrText}>Không có mã QR</Text>
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
    marginTop: 16,
    alignItems: "center"
  },
  qrWrapper: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12
  },
  qrNote: {
    marginTop: 12,
    fontSize: 15,
    color: "#374151",
    fontStyle: "italic"
  },
  noQrText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 16
  }
});
