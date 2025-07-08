import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TextInput
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const EventParticipate = ({ navigation }) => {
  const [eventId, setEventId] = React.useState("");
  const [ticketId, setTicketId] = React.useState("");

  const handleOpenPayment = async () => {
    if (!eventId || !ticketId) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập cả Mã sự kiện và Mã vé.");
      return;
    }

    const token = await AsyncStorage.getItem("jwt");
    const formData = new FormData();
    formData.append("eventId", Number(eventId));
    formData.append("ticketId", Number(ticketId));

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
        Alert.alert("✅ Bạn đã đăng kí sự kiện thành công");
      } else {
        throw new Error(`HTTP Status: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không đăng kí được sự kiện"
      );
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đăng ký tham gia sự kiện</Text>
        <Text style={styles.label}>Mã sự kiện:</Text>
        <TextInput
          style={styles.input}
          value={eventId}
          onChangeText={setEventId}
          placeholder="Nhập mã sự kiện"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Mã vé:</Text>
        <TextInput
          style={styles.input}
          value={ticketId}
          onChangeText={setTicketId}
          placeholder="Nhập mã vé"
          keyboardType="numeric"
        />

        <View style={styles.buttonWrapper}>
          <Button title="Đăng ký" onPress={handleOpenPayment} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    alignItems: "stretch"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center"
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12
  },
  buttonWrapper: {
    marginTop: 16
  }
});

export default EventParticipate;
