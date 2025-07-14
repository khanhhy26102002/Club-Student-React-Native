import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { Picker } from "@react-native-picker/picker";

const EventAssign = () => {
  const [userId, setUserId] = useState(0);
  const [roleName, setRoleName] = useState("VOLUNTEER");
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = React.useState(false);
  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(
        `/api/event-roles/assign/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { userId, roleName }
        }
      );
      console.log("📦 Payload gửi lên:", {
        userId: Number(userId),
        roleName: roleName.trim()
      });
      if (response.status === 200) {
        Alert.alert("Thành công", "Bạn đã phân chia task thành công");
      } else if (response.status === 6003) {
        Alert.alert(
          "Thất bại",
          "User Id này đã có phân role trong sự kiện này"
        );
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      Alert.alert("⚠️ Lỗi", error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎯 Phân vai trò cho thành viên</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🎟️ Mã sự kiện (Event ID)</Text>
          <TextInput
            placeholder="Nhập mã sự kiện"
            value={eventId}
            onChangeText={setEventId}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>👤 Mã người dùng (User ID)</Text>
          <TextInput
            placeholder="Nhập mã người dùng"
            value={userId}
            onChangeText={setUserId}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🎖️ Vai trò</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={roleName}
              onValueChange={(itemValue) => setRoleName(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="🎉 Tình nguyện viên" value="VOLUNTEER" />
              <Picker.Item label="🛠️ Ban tổ chức" value="ORGANIZER" />
              <Picker.Item label="✅ Check-in" value="CHECKIN" />
              <Picker.Item label="📤 Check-out" value="CHECKOUT" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#9CA3AF" }]}
          onPress={handleAssign}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang xử lý..." : "🚀 Gán vai trò"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default EventAssign;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1D4ED8",
    marginBottom: 24
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 16
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  picker: {
    height: 55,
    width: "100%"
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  }
});
