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

const FormRegister = () => {
  const [data, setData] = React.useState([]);
  const [studentCode, setStudentCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [major, setMajor] = React.useState("");
  const [clubId, setClubId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/majors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.log("Error: ", error);
        Alert.alert("Không lấy được ngành");
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedStudentCode = studentCode.trim();
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();
    const trimmedMajor = major.trim();
    const clubIdNumber = Number(clubId);

    // Validate rỗng
    if (
      !trimmedStudentCode ||
      !trimmedEmail ||
      !trimmedFullName ||
      !trimmedMajor ||
      !clubId
    ) {
      Alert.alert(
        "⚠️ Thiếu thông tin",
        "Vui lòng nhập đầy đủ tất cả các trường."
      );
      return;
    }

    // Validate mã số sinh viên: chỉ cho chữ, số, dài ít nhất 5 ký tự
    const studentCodeRegex = /^[a-zA-Z0-9]{5,}$/;
    if (!studentCodeRegex.test(trimmedStudentCode)) {
      Alert.alert(
        "⚠️ Mã sinh viên không hợp lệ",
        "Mã sinh viên chỉ được chứa chữ/số và tối thiểu 5 ký tự."
      );
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert(
        "⚠️ Email không hợp lệ",
        "Vui lòng nhập đúng định dạng email."
      );
      return;
    }

    // Validate clubId
    if (isNaN(clubIdNumber) || clubIdNumber <= 0) {
      Alert.alert(
        "⚠️ Câu lạc bộ không hợp lệ",
        "Vui lòng chọn một CLB hợp lệ."
      );
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");

    try {
      const response = await fetchBaseResponse(
        "/memberships/membership-register",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            studentCode: trimmedStudentCode,
            email: trimmedEmail,
            fullName: trimmedFullName,
            major: trimmedMajor,
            clubId: clubIdNumber
          }
        }
      );

      console.log("✅ Server response:", response);

      if (response.status === 200) {
        if (
          response.message === "Club registered successfully, pending approval"
        ) {
          Alert.alert("🎉 Thành công", "Bạn đã đăng ký vào CLB thành công!");
        } else {
          // Trường hợp thành công nhưng message khác
          Alert.alert("✅ Phản hồi", response.message || "Đăng ký thành công.");
        }
      } else {
        // Nếu không phải status 200 thì ném lỗi để xuống catch xử lý
        throw new Error(response.message || `Lỗi status ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Lỗi đăng ký:", error.message);
      if (error.message.includes("Members of other clubs")) {
        Alert.alert(
          "🚫 Không thể đăng ký",
          "Bạn đã là thành viên của một CLB khác. Vui lòng rút khỏi CLB đó trước khi đăng ký."
        );
      } else {
        Alert.alert("❌ Đăng ký thất bại", error.message || "Có lỗi xảy ra.");
      }
    } finally {
      setLoading(false);
    }
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
              placeholder="VD: SE1xxxxx"
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
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                🏫 Ngành học
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#cbd5e1",
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: "#fff"
                }}
              >
                <Picker
                  selectedValue={major}
                  onValueChange={(itemValue) => setMajor(itemValue)}
                  style={{ height: 55 }}
                >
                  <Picker.Item label="Chọn ngành học" value="" />
                  {data.map((item) => (
                    <Picker.Item
                      key={item.majorId}
                      label={`${item.majorName}`}
                      value={item.majorId.toString()}
                    />
                  ))}
                </Picker>
              </View>
            </View>

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
