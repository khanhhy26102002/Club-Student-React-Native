import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { fetchBaseResponse } from "../../utils/api";
import { Picker } from "@react-native-picker/picker";
import OtpModal from "./OtpModal";

const RegisterPage = ({ navigation }) => {
  const [studentCode, setStudentCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState("");
  const [major, setMajor] = React.useState("");
  const [majors, setMajors] = React.useState([]);
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/majors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.message === "Success") {
          setMajors(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchData();
  });
  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Bạn nhập lại mật khẩu để nó khớp mật khẩu trên");
      return;
    }

    try {
      const response = await fetchBaseResponse("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          studentCode,
          email,
          password,
          fullName,
          academicYear,
          major: major
        }
      });
      console.log("RESPONSE", response);
      if (response.message === "Registration successful") {
        setShowOtpModal(true);
      } else {
        Alert.alert("Lỗi", response.message || "Không đăng ký được");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);
      if (error.response?.data?.message) {
        Alert.alert("Lỗi đăng ký", error.response.data.message);
      } else {
        Alert.alert("Lỗi hệ thống", "Không thể kết nối tới máy chủ.");
      }
    }
  };
  const handleVerifyOtp = async (otp) => {
    try {
      const response = await fetchBaseResponse("/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: { email, otp }
      });

      if (response.message === "Email verified successfully") {
        Alert.alert("✅ Thành công", "Tài khoản của bạn đã được xác minh!");
        setShowOtpModal(false);
        navigation.navigate("Login");
      } else {
        Alert.alert("❌ Lỗi", response.message || "Sai mã OTP");
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
      Alert.alert("❌ Lỗi", error.message || "Không xác minh được OTP");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Chào mừng bạn tới trang đăng ký</Text>
        <Text style={styles.subtitle}>
          Hãy điền thông tin bên dưới để tạo tài khoản mới
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mã số Sinh Viên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã số sinh viên"
            placeholderTextColor="#bbb"
            keyboardType="default"
            value={studentCode}
            onChangeText={setStudentCode}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#bbb"
            keyboardType="default"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Năm học</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={academicYear}
              onValueChange={(itemValue) => setAcademicYear(itemValue)}
              style={styles.picker}
              dropdownIconColor="#555"
            >
              <Picker.Item label="Chọn năm học..." value="" />
              <Picker.Item label="Năm nhất" value="YEAR_ONE" />
              <Picker.Item label="Năm hai" value="YEAR_TWO" />
              <Picker.Item label="Năm ba" value="YEAR_THREE" />
              <Picker.Item label="Năm bốn" value="YEAR_FOUR" />
            </Picker>
            <FontAwesome
              name="caret-down"
              size={20}
              color="#777"
              style={styles.pickerIcon}
              pointerEvents="none"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ngành học</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={major}
              onValueChange={(itemValue) => setMajor(itemValue)}
              style={styles.picker}
              dropdownIconColor="#555"
            >
              <Picker.Item label="Chọn ngành học..." value="" />
              {majors.map((item) => (
                <Picker.Item
                  key={item.majorId}
                  label={item.majorName}
                  value={item.majorId}
                />
              ))}
            </Picker>
            <FontAwesome
              name="caret-down"
              size={20}
              color="#777"
              style={styles.pickerIcon}
              pointerEvents="none"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#bbb"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>
        <OtpModal
          visible={showOtpModal}
          onSubmit={handleVerifyOtp}
          onCancel={() => setShowOtpModal(false)}
        />

        <View style={styles.socialWrapper}>
          <Text style={styles.orText}>Hoặc đăng ký bằng</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.google]}
              activeOpacity={0.8}
            >
              <FontAwesome
                name="google"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.socialText}>Đăng nhập với Google</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.wrapper}>
          <Text style={styles.infoText}>Bạn đã có tài khoản?</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Đăng nhập tại đây</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: "#f0f4f8"
  },
  container: {
    padding: 24,
    paddingBottom: 50
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 24,
    textAlign: "center"
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 6,
    fontWeight: "700"
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d8e0",
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#2d3436",
    shadowColor: "#2d3436",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3
  },
  pickerWrapper: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d8e0",
    overflow: "hidden",
    shadowColor: "#2d3436",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3
  },
  picker: {
    height: 55,
    width: "100%",
    color: "#34495e"
  },
  pickerIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
    pointerEvents: "none"
  },
  registerButton: {
    backgroundColor: "#0984e3",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
    shadowColor: "#0984e3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1
  },
  socialWrapper: {
    alignItems: "center",
    marginBottom: 40
  },
  orText: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 20,
    fontWeight: "600"
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#db4437",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: "#db4437",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7
  },
  google: {
    backgroundColor: "#db4437"
  },
  icon: {
    marginRight: 14
  },
  socialText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18
  },
  wrapper: {
    alignItems: "center"
  },
  infoText: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 14,
    fontWeight: "600"
  },
  button: {
    backgroundColor: "#0984e3",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#0984e3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  }
});

export default RegisterPage;
