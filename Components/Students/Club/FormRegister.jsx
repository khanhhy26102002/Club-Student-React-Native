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
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";

const FormRegister = ({ navigation }) => {
  const route = useRoute();
  const clubId = route.params?.clubId;
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("jwt");
    Alert.alert(
      "Xác nhận",
      `Bạn có muốn đăng ký vào CLB với mã ${clubId} không?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetchBaseResponse(
                "/api/memberships/membership-register",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                  data: { clubId: clubId }
                }
              );

              console.log("📦 API response:", response);
              if (response.status === 200) {
                Alert.alert(
                  "✅ Thành công",
                  "Bạn đã đăng kí thành công câu lạc bộ này"
                );
                navigation.goBack();
              } else {
                throw new Error(
                  `${response.message} (status ${
                    response.status ?? "không xác định"
                  })`
                );
              }
            } catch (error) {
              const serverMessage =
                error.response?.data?.message ||
                error.message ||
                "Có lỗi xảy ra.";
              console.error("❌ Lỗi đăng ký:", serverMessage);

              if (serverMessage.includes("Members of other clubs")) {
                Alert.alert(
                  "🚫 Không thể đăng ký",
                  "Bạn đã là thành viên của một CLB khác. Vui lòng rút khỏi CLB đó trước khi đăng ký."
                );
              } else if (serverMessage.includes("already applied")) {
                Alert.alert(
                  "⚠️ Đã đăng ký",
                  "Bạn đã từng gửi yêu cầu tham gia câu lạc bộ này rồi."
                );
              } else {
                Alert.alert("❌ Đăng ký thất bại", serverMessage);
              }
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  /* thông tin user không cần nhập tay lần nữa 
     sau khi đăng kí clb thì không cần hiển thị nút đăng kí nữa
     thêm nút truy cập vào clb đó sau khi đăng kí thành công
     cái đăng kí clb của bạn đang đợi duyệt(trừ trường hợp chưa có nút đăng kí thì sẽ hiển thị nút đăng kí)
     status 1: Cái nút đăng kí
     status 2: Đang đợi xét duyệt
     status 3: Show cái nút truy cập nhóm
     check user này đã vô clb này hay chưa

*/
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header />
        <View style={styles.content}>
          <Text style={styles.title}>Đăng ký Câu Lạc Bộ</Text>
          <Text style={styles.subtitle}>
            Bạn đang đăng ký vào CLB có mã{" "}
            <Text style={{ fontWeight: "700" }}>{clubId}</Text>
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🚀 Đăng ký</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "flex-start"
  },
  content: {
    padding: 24,
    marginTop: 32,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ff6600",
    marginBottom: 8,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3
  },
  buttonDisabled: {
    backgroundColor: "#d4d4d8"
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700"
  }
});

export default FormRegister;
