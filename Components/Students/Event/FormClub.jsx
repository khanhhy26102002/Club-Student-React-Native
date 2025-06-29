import React from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import Markdown from "react-native-markdown-display";

const FormClub = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [mentorId, setMentorId] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !fullName) {
      Alert.alert(
        "⚠️ Thiếu thông tin",
        "Vui lòng nhập đủ các trường bắt buộc."
      );
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");

    try {
      await fetchBaseResponse(`/clubs/create-club-request`, {
        method: "POST",
        data: {
          name,
          description,
          logoUrl,
          fullName,
          mentorId: Number(mentorId)
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      Alert.alert("🎉 Thành công", "Câu lạc bộ đã được gửi để xét duyệt.");
    } catch (error) {
      console.log("Error:", error);
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors) {
        const messages = Object.values(backendErrors).join("\n");
        Alert.alert("❌ Lỗi xác thực", messages);
      } else {
        // Trường hợp không có field cụ thể
        Alert.alert("❌ Lỗi", "Không thể gửi yêu cầu: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label,
    iconName,
    value,
    setValue,
    placeholder,
    multiline = false,
    keyboardType = "default"
  ) => (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Icon
          name={iconName}
          size={18}
          color="#ff6600"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, multiline && styles.textarea]}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          multiline={multiline}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Tạo Câu Lạc Bộ</Text>
          <Text style={styles.bannerSubtitle}>
            Điền đầy đủ thông tin để gửi yêu cầu tạo CLB của bạn.
          </Text>
        </View>

        <View style={styles.formContainer}>
          {renderField(
            "Tên CLB *",
            "group",
            name,
            setName,
            "Nhập tên câu lạc bộ"
          )}
          {renderField(
            "Miêu tả *",
            "description",
            description,
            setDescription,
            "Mô tả ngắn gọn",
            true
          )}
          {description ? (
            <View
              style={{
                backgroundColor: "#fff",
                marginTop: 8,
                padding: 12,
                borderRadius: 8
              }}
            >
              <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
                Xem trước:
              </Text>
              <Markdown>{description}</Markdown>
            </View>
          ) : null}
          {renderField(
            "Logo (link ảnh)",
            "image",
            logoUrl,
            setLogoUrl,
            "https://..."
          )}
          {renderField(
            "Họ tên người đại diện *",
            "person",
            fullName,
            setFullName,
            "Nguyễn Văn A"
          )}
          {renderField(
            "ID giảng viên phụ trách",
            "badge",
            mentorId,
            setMentorId,
            "123456",
            false,
            "numeric"
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Gửi Yêu Cầu</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10
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
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24
  },
  field: {
    marginBottom: 18
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827"
  },
  textarea: {
    height: 100,
    textAlignVertical: "top"
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
    marginTop: -8
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

export default FormClub;
