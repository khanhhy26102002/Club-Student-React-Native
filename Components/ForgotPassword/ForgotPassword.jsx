import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL } from "@env";
const COLORS = {
  gradient: ["#43e97b", "#38f9d7", "#2193b0"],
  btn: ["#5EFCE8", "#736EFE"],
  white: "#fff",
  danger: "#ff5964",
  success: "#43e97b",
  purple: "#3d49fa",
  hint: "#999",
  cardBg: "#fff"
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function ChangePasswordScreen() {
  // Form states
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp + new password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Ẩn popup, reset OTP (nếu cần)
  const closePopup = () => {
    setPopupVisible(false);
    setOtp("");
    setMsg("");
    setMsgType("");
  };

  // Hiệu ứng hiện thông báo
  const triggerFade = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true
    }).start();
  };

  // B1: Gửi email để lấy OTP
  const handleEmailSubmit = async () => {
    setMsg("");
    setMsgType("");
    if (!validateEmail(email)) {
      setMsg("Email không hợp lệ!");
      setMsgType("error");
      triggerFade();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setPopupVisible(true);
        setMsg("");
        setMsgType("");
        triggerFade();
      } else {
        setMsg(data.message || "Không gửi được OTP.");
        setMsgType("error");
        triggerFade();
      }
    } catch (err) {
      setMsg("Lỗi kết nối, thử lại sau!");
      setMsgType("error");
      triggerFade();
    }
    setLoading(false);
  };

  // B2: Gửi OTP và New Password
  const sendNewPassword = async () => {
    setMsg("");
    setMsgType("");
    if (!otp || !newPassword) {
      setMsg("Vui lòng nhập đủ OTP và mật khẩu mới!");
      setMsgType("error");
      triggerFade();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("🎉 " + (data.message || "Đã đổi mật khẩu thành công!"));
        setMsgType("success");
        setPopupVisible(false);
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPass("");
        Alert.alert("Thành công", "Mật khẩu đã đổi, bạn có thể đăng nhập lại!");
      } else {
        setMsg(data.message || "Đổi mật khẩu thất bại. Thử lại!");
        setMsgType("error");
      }
    } catch (e) {
      setMsg("Lỗi kết nối máy chủ!");
      setMsgType("error");
    }
    setLoading(false);
    triggerFade();
  };

  return (
    <LinearGradient colors={COLORS.gradient} style={styles.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.msgBox,
                msgType === "success"
                  ? { backgroundColor: COLORS.success + "cc" }
                  : msgType === "error"
                  ? { backgroundColor: COLORS.danger + "cc" }
                  : {},
                { opacity: fadeAnim }
              ]}
            >
              {msg ? <Text style={styles.msgText}>{msg}</Text> : null}
            </Animated.View>

            <View style={styles.card}>
              <Text style={styles.title}>🔑 Đặt lại mật khẩu</Text>
              <Text style={styles.subtitle}>
                Nhập email đăng ký, hệ thống sẽ gửi mã xác thực (OTP) tới email
                của bạn.
              </Text>
              {step === 1 && (
                <View style={{ marginVertical: 16 }}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputWrap}>
                    <Icon
                      name="email-outline"
                      size={22}
                      color={COLORS.purple}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập email thành viên"
                      placeholderTextColor={COLORS.hint}
                      value={email}
                      keyboardType="email-address"
                      onChangeText={setEmail}
                      autoCapitalize="none"
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.btn}
                    onPress={handleEmailSubmit}
                    disabled={loading}
                  >
                    <Icon
                      name="send-circle-outline"
                      size={22}
                      color="#fff"
                      style={{ marginRight: 7 }}
                    />
                    <Text style={styles.btnText}>GỬI MÃ OTP</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Modal
                visible={popupVisible}
                transparent
                animationType="fade"
                onRequestClose={closePopup}
              >
                <View style={styles.overlay}>
                  <View style={styles.popup}>
                    <Text style={styles.popupTitle}>Nhập mã OTP!</Text>
                    <Text style={styles.popupDesc}>
                      Hệ thống đã gửi mã xác thực về email{" "}
                      <Text style={{ fontWeight: "bold", color: "#2e3fd5" }}>
                        {email}
                      </Text>
                      Vui lòng kiểm tra và nhập mã OTP bên dưới cùng mật khẩu
                      mới.
                    </Text>
                    <TextInput
                      style={styles.otpInput}
                      value={otp}
                      placeholder="Mã OTP"
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                    <View style={{ height: 16 }} />
                    <View>
                      <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                      <View style={styles.inputWrap}>
                        <Icon
                          name="lock-reset"
                          size={21}
                          color={COLORS.purple}
                          style={{ marginRight: 8 }}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Nhập mật khẩu mới mạnh"
                          placeholderTextColor={COLORS.hint}
                          value={newPass}
                          secureTextEntry={!showNew}
                          onChangeText={setNewPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowNew((s) => !s)}>
                          <Icon
                            name={showNew ? "eye" : "eye-off"}
                            size={21}
                            color={COLORS.purple}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.hintTxt}>
                        • 8 ký tự, chữ Hoa, thường, số & ký tự đặc biệt
                      </Text>
                    </View>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={closePopup}
                        disabled={loading}
                      >
                        <Text style={{ color: "#888", fontWeight: "bold" }}>
                          HỦY
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={sendNewPassword}
                        disabled={loading || !otp || !newPass}
                      >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                          XÁC NHẬN
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    paddingHorizontal: 22,
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 36
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 17,
    padding: 26,
    shadowColor: COLORS.purple,
    shadowOpacity: 0.1,
    shadowRadius: 17,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.purple,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.22
  },
  subtitle: {
    color: "#7b85a7",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 11,
    marginTop: 1
  },
  inputLabel: {
    color: COLORS.purple,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 7,
    fontSize: 15
  },
  inputWrap: {
    flexDirection: "row",
    borderWidth: 1.3,
    borderColor: "#ece3ff",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f7f4ff",
    paddingHorizontal: 9,
    marginBottom: 14
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: "#2b2c5e",
    letterSpacing: 0.2,
    paddingHorizontal: 7
  },
  btn: {
    flexDirection: "row",
    marginTop: 5,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4d79fe",
    shadowColor: "#8a2be2",
    shadowOpacity: 0.13,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16.5,
    letterSpacing: 0.7
  },
  msgBox: {
    position: "absolute",
    top: 20,
    left: 18,
    right: 18,
    zIndex: 10,
    padding: 13,
    borderRadius: 11,
    minHeight: 38,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#222",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 }
  },
  msgText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.12
  },
  // POPUP
  overlay: {
    flex: 1,
    backgroundColor: "#0008",
    alignItems: "center",
    justifyContent: "center"
  },
  popup: {
    width: 330,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 7
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3d49fa",
    marginBottom: 7
  },
  popupDesc: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center"
  },
  otpInput: {
    width: 130,
    height: 44,
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#f0f5ff",
    borderColor: "#aaa",
    borderRadius: 11,
    borderWidth: 1.1,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 10
  },
  actions: { flexDirection: "row", marginTop: 14 },
  cancelBtn: {
    paddingVertical: 11,
    paddingHorizontal: 21,
    borderRadius: 9,
    marginRight: 14,
    backgroundColor: "#ececec"
  },
  confirmBtn: {
    paddingVertical: 11,
    paddingHorizontal: 21,
    borderRadius: 9,
    backgroundColor: "#4d79fe",
    alignItems: "center"
  },
  hintTxt: {
    marginLeft: 2,
    fontSize: 12,
    color: COLORS.hint,
    marginBottom: 5,
    marginTop: -4
  }
});
