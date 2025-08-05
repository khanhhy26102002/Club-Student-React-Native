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
  Platform,
  Image
} from "react-native";
import { fetchBaseResponse } from "../../utils/api";
import { Picker } from "@react-native-picker/picker";
import OtpModal from "./OtpModal";
import { LinearGradient } from "expo-linear-gradient";

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
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/api/majors", {
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
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Bạn nhập lại mật khẩu để nó khớp mật khẩu trên");
      return;
    }
    if (!specialCharRegex.test(password)) {
      Alert.alert(
        "Lỗi",
        "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$...)"
      );
      return;
    }
    try {
      const response = await fetchBaseResponse("/api/register", {
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
          major
        }
      });

      console.log("RESPONSE", response);

      if (response.message === "Registration successful") {
        setShowOtpModal(true);
      } else {
        // ❗ Nếu API trả về lỗi dạng { message: "..." }
        Alert.alert("Lỗi", response.message || "Không đăng ký được");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);

      // 🛠 Nếu API trả về lỗi dạng { response: { data: { message: "..." } } }
      if (error.response?.data?.message) {
        Alert.alert("Lỗi đăng ký", error.response.data.message);
      } else {
        Alert.alert("Lỗi hệ thống", "Không thể kết nối tới máy chủ.");
      }
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      const response = await fetchBaseResponse("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: { email, otp }
      });

      if (response.message === "Email verified successfully") {
        Alert.alert("✅ Thành công", "Tài khoản của bạn đã được xác minh!");
        setShowOtpModal(false);
        Alert.alert(
          "🎉 Tạo tài khoản thành công",
          "Bây giờ bạn có thể đăng nhập vào ứng dụng!",
          [
            {
              text: "Đăng nhập ngay",
              onPress: () => {
                setShowOtpModal(false);
                navigation.navigate("Login");
              }
            }
          ]
        );
      } else {
        Alert.alert("❌ Lỗi", response.message || "Sai mã OTP");
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
      Alert.alert("❌ Lỗi", error.message || "Không xác minh được OTP");
    }
  };

  return (
    <LinearGradient
      colors={["#f0f4ff", "#dbeafe", "#e0f2fe"]} // hoặc tone FPT như ["#fff0e0", "#ffe0cc"]
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrapper}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/vi/thumb/2/2d/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_FPT.svg/2560px-Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_FPT.svg.png"
              }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Chào mừng bạn tới trang đăng ký</Text>
          <Text style={styles.subtitle}>
            Tạo tài khoản để tiếp tục cái câu lạc bộ của bạn
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
              placeholder="Nhập email trường"
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
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome
                  name={showPassword ? "eye-slash" : "eye"}
                  size={20}
                  color="#a3a3a3"
                />
              </TouchableOpacity>
            </View>
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
            <Text style={styles.registerButtonText}>Tạo tài khoản</Text>
          </TouchableOpacity>
          <OtpModal
            visible={showOtpModal}
            onSubmit={handleVerifyOtp}
            onCancel={() => setShowOtpModal(false)}
          />

          <View style={styles.socialWrapper}>
            <Text style={styles.orText}>Hoặc tạo bằng</Text>
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
                <Text style={styles.socialText}>Google</Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: "#f0f4f8"
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10
  },
  passwordWrapper: {
    position: "relative"
  },
  eyeButton: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: [{ translateY: -10 }]
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 32
  },
  logoImage: {
    width: 200,
    height: 60,
    resizeMode: "contain"
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  title: {
    fontSize: 20,
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
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#c3cfe0",
    shadowColor: "#004aad",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    color: "#222"
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
    backgroundColor: "#5B9DF9",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#ff5722",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700"
  },

  socialWrapper: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 30
  },
  orText: {
    fontSize: 15,
    color: "#FF8C42",
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
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 40,
    width: "70%",
    marginVertical: 8,
    shadowColor: "#aaa",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -10
  },
  infoText: {
    fontSize: 14,
    color: "#444"
  },
  buttonText: {
    fontSize: 14,
    color: "#2563eb",
    marginLeft: 6,
    textDecorationLine: "none"
  }
});

export default RegisterPage;
