import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Header/Header";

const Payment = ({ navigation }) => {
  const [eventId, setEventId] = React.useState(0);
  const [ticketId, setTicketId] = React.useState(0);

  const handleRegister = async () => {
     
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Ionicons name="card-outline" size={60} color="#1D4ED8" />
        <Text style={styles.title}>Xác nhận đăng ký sự kiện</Text>
        <Text style={styles.text}>Vui lòng nhập thông tin sự kiện:</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Mã sự kiện (eventId):</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập ID sự kiện"
            value={eventId}
            onChangeText={setEventId}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Mã vé (ticketId):</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập ID vé"
            value={ticketId}
            onChangeText={setTicketId}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký và Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#1F2937"
  },
  text: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    color: "#1E3A8A",
    fontWeight: "600",
    marginBottom: 6
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  }
});
