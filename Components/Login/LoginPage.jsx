import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal
} from "react-native";
import { fetchBaseResponse } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginPage = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [roleName, setRoleName] = React.useState("");
  const handleLogin = async () => {
    try {
      const response = await fetchBaseResponse("/login", {
        method: "POST",
        data: { email, password }
      });

      if (response.message === "Login successful") {
        Alert.alert("Đăng nhập thành công", "Chào mừng bạn!");
        const token = response.data.token;
        const roles = response.data.roles || [];
        const roleName = roles?.[0]?.role || "GUEST";

        await AsyncStorage.setItem("jwt", token);
        await AsyncStorage.setItem("role", JSON.stringify(roles));
        await AsyncStorage.setItem("email", email);
        setRoleName(roleName);

        const clubResponse = await fetchBaseResponse("/clubs/my-club-roles", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });

        const ownedClubs = (clubResponse.data || []).filter(
          (c) => c.role === "CLUBLEADER"
        );

        if (ownedClubs.length > 0) {
          ownedClubs.forEach((club) => {
            console.log("Bạn thuộc CLB:", club.clubName);
          });
        }

        if (roleName === "MEMBER") {
          navigation.navigate("Main");
        } else if (roleName === "EVENT_ORGANZERS") {
          navigation.navigate("Organizer");
        }
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (err) {
      Alert.alert("Đăng nhập thất bại", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Chào mừng bạn trở lại!</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email sinh viên"
            placeholderTextColor="#a3a3a3"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#a3a3a3"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.noteWrapper}>
          <Text style={styles.noteText}>Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Đăng ký tại đây</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialWrapper}>
          <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.google]}
              activeOpacity={0.7}
            >
              <FontAwesome
                name="google"
                size={24}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.socialText}>Đăng nhập với Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 28,
    justifyContent: "center",
    paddingVertical: 40
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#004aad",
    marginBottom: 8,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: "#606060",
    marginBottom: 32,
    textAlign: "center"
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 8,
    fontWeight: "600"
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
  loginButton: {
    backgroundColor: "#004aad",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#004aad",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5
  },
  noteWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24
  },
  noteText: {
    fontSize: 14,
    color: "#555"
  },
  linkText: {
    fontSize: 14,
    color: "#004aad",
    fontWeight: "700"
  },
  socialWrapper: {
    marginTop: 36,
    alignItems: "center"
  },
  orText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
    fontWeight: "500"
  },
  socialContainer: {
    width: "100%",
    alignItems: "center"
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
    fontSize: 17,
    fontWeight: "700"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    alignItems: "center",
    elevation: 10, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333"
  },
  modalScroll: {
    width: "100%",
    maxHeight: 300,
    marginBottom: 20
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    marginBottom: 10
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333"
  },
  modalClose: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#ff6666",
    borderRadius: 10
  },
  modalCloseText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600"
  }
});

export default LoginPage;
