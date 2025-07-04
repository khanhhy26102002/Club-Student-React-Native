import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentCode || !email | !fullName || !major || !clubId) {
      Alert.alert("Điền vào ô trống");
      return;
    }
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");

    try {
      const response = await fetchBaseResponse("/clubs/club-register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          studentCode,
          email,
          fullName,
          major,
          clubId
        }
      });
      console.log("✅ Đăng ký thành công:", response);
      if (
        response.message === "Club registered successfully, pending approval"
      ) {
        Alert.alert("🎉 Thành công", "Bạn đã đăng ký vào CLB thành công!");
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("❌ Lỗi đăng ký:", error.message);
      Alert.alert("❌ Đăng ký thất bại", error.message || "Không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Header />
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Đăng ký Câu Lạc Bộ</Text>
            <Text style={styles.bannerSubtitle}>
              Hãy điền đầy đủ thông tin của bạn để tham gia vào CLB mong muốn.
            </Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="🎓 Mã số sinh viên"
              value={studentCode}
              onChangeText={setStudentCode}
              placeholder="VD: B21DCCN001"
            />
            <FormField
              label="📧 Email trường"
              value={email}
              onChangeText={setEmail}
              placeholder="VD: mail của trường đó"
              keyboardType="email-address"
            />
            <FormField
              label="👤 Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              placeholder="VD: Nguyễn Văn A"
            />
            <FormField
              label="🏫 Ngành học"
              value={major}
              onChangeText={setMajor}
              placeholder="VD: Công nghệ thông tin"
            />
            <FormField
              label="🏷️ Mã CLB muốn tham gia"
              value={clubId}
              onChangeText={setClubId}
              placeholder="VD: 63c212fd64a4cc36df5b08f5"
            />

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>🚀 Tham gia ngay</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default"
}) => (
  <View style={{ marginBottom: 18 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "flex-start"
  },
  banner: {
    backgroundColor: "#fff4ec",
    padding: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: "center",
    shadowColor: "#ff7a00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6600",
    marginBottom: 6
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center"
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    marginLeft: 4
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#ff6600",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: "#d4d4d8"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default FormRegister;
