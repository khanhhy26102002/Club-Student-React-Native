import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import API, { fetchBaseResponse } from "../../../utils/api";

const FormClub = () => {
  const [clubName, setClubName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!clubName || !description) {
      Alert.alert("⚠️ Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");

    try {
      const response = await fetchBaseResponse(`/clubs/createClub`, {
        method: "POST",
        data: { clubName, description },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("📦 API Response:", response);
      if (response.status === 200 && response.message === "Success") {
        Alert.alert("✅ Thành công", "Bạn đã tạo câu lạc bộ thành công!");
      } else {
        throw new Error(`Lỗi: ${response.message || "Không xác định"}`);
      }
    } catch (error) {
      Alert.alert("❌ Thất bại", "Không thể tạo câu lạc bộ: " + error.message);
      console.error("❌ API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <View style={styles.headerBox}>
          <View style={styles.headerRow}>
            <Text style={styles.headerEmoji}>🚩</Text>
            <Text style={styles.headerText}>Tạo câu lạc bộ cho riêng bạn</Text>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="📛 Nhập tên câu lạc bộ (VD: Developer Club)"
            placeholderTextColor="#aaa"
            value={clubName}
            onChangeText={setClubName}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="📝 Miêu tả ngắn gọn về câu lạc bộ của bạn..."
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🚀 Tạo câu lạc bộ ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
    backgroundColor: "#f2f4f8",
    flexGrow: 1
  },
  headerBox: {
    backgroundColor: "#ff660020",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#ff6600",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  headerEmoji: {
    fontSize: 26,
    marginRight: 8
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff6600",
    textAlign: "center"
  },
  form: {
    padding: 24,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#ff6600",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4
  },
  buttonDisabled: {
    backgroundColor: "#ccc"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});

export default FormClub;
