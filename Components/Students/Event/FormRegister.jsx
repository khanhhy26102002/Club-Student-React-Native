import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";

const FormRegister = () => {
  const [studentCode, setStudentCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [major, setMajor] = React.useState("");
  const [clubId, setClubId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse("/clubs/clubregister", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          studentCode,
          email,
          fullName,
          major,
          clubId
        }
      });
      console.log("Response:", response);
      if (response.message === "Đăng ký CLB thành công!") {
        Alert.alert("✅ Thành công", "Bạn đã đăng ký câu lạc bộ thành công!");
      } else {
        throw new Error(`HTTP Status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert("❌ Lỗi", "Không thể đăng ký: " + error.message);
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
        <View style={styles.form}>
          <Text style={styles.title}>📥 Đăng ký tham gia câu lạc bộ</Text>

          <TextInput
            style={styles.input}
            placeholder="📛 Mã số Sinh viên"
            placeholderTextColor="#aaa"
            value={studentCode}
            onChangeText={setStudentCode}
          />
          <TextInput
            style={styles.input}
            placeholder="📧 Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="👤 Họ và tên"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="🎓 Ngành học"
            placeholderTextColor="#aaa"
            value={major}
            onChangeText={setMajor}
          />
          <TextInput
            style={styles.input}
            placeholder="🏢 Mã câu lạc bộ"
            placeholderTextColor="#aaa"
            value={clubId}
            onChangeText={setClubId}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🚀 Đăng ký ngay</Text>
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
    backgroundColor: "#f2f2f7",
    flexGrow: 1
  },
  form: {
    padding: 24,
    marginTop: 8
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 14,
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
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
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

export default FormRegister;
