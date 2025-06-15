import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
const Payment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const event = route.params?.event;

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          ❌ Không tìm thấy thông tin sự kiện.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handlePayment = () => {
    Alert.alert(
      "💸 Thanh toán thành công",
      `Bạn đã thanh toán ${event.fee.toLocaleString()} VND cho "${event.title}"`
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>💳 Thanh toán sự kiện</Text>
        <Text style={styles.label}>📌 Tên sự kiện:</Text>
        <Text style={styles.value}>{event.title}</Text>

        <Text style={styles.label}>💰 Phí tham dự:</Text>
        <Text style={styles.value}>{event.fee.toLocaleString()} VND</Text>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f6fc"
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 24
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333"
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginTop: 10
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222"
  },
  payButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center"
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 16
  },
  backButton: {
    alignSelf: "center",
    padding: 10
  },
  backButtonText: {
    color: "#1e90ff",
    fontSize: 16
  }
});

export default Payment;
