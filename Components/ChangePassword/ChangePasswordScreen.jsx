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
  ActivityIndicator
} from "react-native";
import { API_URL } from "@env";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../utils/api";

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

const validatePassword = (pw) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/.test(
    pw
  );

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const triggerFade = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true
    }).start();
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("jwt");
    setMsg("");
    setMsgType("");

    // Chỉ cần kiểm tra có nhập đầy đủ
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsg("Vui lòng nhập đầy đủ thông tin.");
      setMsgType("error");
      triggerFade();
      return;
    }

    // Bỏ validatePassword, chỉ check confirm
    if (newPassword !== confirmPassword) {
      setMsg("Mật khẩu xác nhận không khớp.");
      setMsgType("error");
      triggerFade();
      return;
    }

    setLoading(true);
    try {
      const res = await fetchBaseResponse(`/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: { oldPassword, newPassword, confirmPassword }
      });

      console.log("Data", res);
      if (res.status === 200) {
        setMsg("🎉 " + (res.message || "Đổi mật khẩu thành công!"));
        setMsgType("success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMsg(res.message || "Thay đổi thất bại, vui lòng thử lại!");
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
              <Text style={styles.title}>🔐 Đổi mật khẩu ClubSync</Text>
              <Text style={styles.subtitle}>
                Nhập email, mật khẩu cũ và mật khẩu mới để cập nhật.
              </Text>

              {/* Mật khẩu cũ */}
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.inputLabel}>Mật khẩu cũ</Text>
                <View style={styles.inputWrap}>
                  <Icon
                    name="lock-outline"
                    size={21}
                    color={COLORS.purple}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu hiện tại"
                    placeholderTextColor={COLORS.hint}
                    value={oldPassword}
                    secureTextEntry={!showOld}
                    onChangeText={setOldPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowOld((s) => !s)}>
                    <Icon
                      name={showOld ? "eye" : "eye-off"}
                      size={21}
                      color={COLORS.purple}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mật khẩu mới */}
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                <View style={styles.inputWrap}>
                  <Icon
                    name="form-textbox-password"
                    size={21}
                    color={COLORS.purple}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu mới mạnh"
                    placeholderTextColor={COLORS.hint}
                    value={newPassword}
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
              </View>
              <View style={{ marginBottom: 14 }}>
                <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                <View style={styles.inputWrap}>
                  <Icon
                    name="lock-check-outline"
                    size={21}
                    color={COLORS.purple}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    placeholderTextColor={COLORS.hint}
                    value={confirmPassword}
                    secureTextEntry={true}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={COLORS.btn}
                  start={{ x: 0.14, y: 1 }}
                  end={{ x: 1, y: 0.12 }}
                  style={styles.btn}
                >
                  {loading ? (
                    <ActivityIndicator
                      color={COLORS.white}
                      style={{ marginRight: 7 }}
                    />
                  ) : (
                    <Icon
                      name="account-check-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 7 }}
                    />
                  )}
                  <Text style={styles.btnText}>ĐỔI MẬT KHẨU</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

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
    shadowOpacity: 0.09,
    shadowRadius: 20,
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
    paddingHorizontal: 9
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
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
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
  hintTxt: {
    marginLeft: 2,
    fontSize: 12,
    color: COLORS.hint,
    marginBottom: 6,
    marginTop: -4
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
  }
});

export default ChangePasswordScreen;
