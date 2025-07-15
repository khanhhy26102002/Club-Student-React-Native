import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
const EventTask = ({ route }) => {
  const { eventId, title } = route.params;
  const [userId, setUserId] = React.useState(""); // string
  const [parentId, setParentId] = React.useState(""); // string
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const renderLabeledInput = (
    label,
    value,
    onChangeText,
    placeholder = "",
    multiline = false,
    keyboardType = "default"
  ) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={String(value)}
        onChangeText={(text) => onChangeText(text)} // 👇 sẽ ép về số sau nếu cần
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault?.();

    // Hiện loading
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    const isoDate = new Date(dueDate).toISOString();

    try {
      const response = await fetchBaseResponse("/api/tasks/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          eventId: Number(eventId),
          userId: Number(userId),
          parentId: Number(parentId),
          title,
          description,
          dueDate: isoDate
        }
      });

      // 🟢 Thành công
      if (response.status === 200) {
        Alert.alert("Thành công", "Bạn đã tạo task thành công");
      }
      // 🔴 Lỗi do validate bên backend (400 hoặc 422)
      else if (response.status === 400 || response.status === 422) {
        const errorData = response.data;

        // Nếu server trả về object như { errors: { title: "Đã tồn tại", userId: "Không hợp lệ" } }
        if (errorData.errors && typeof errorData.errors === "object") {
          const messages = Object.values(errorData.errors);
          Alert.alert("Lỗi xác thực", messages.join("\n"));
        }
        // Nếu là message đơn lẻ
        else if (errorData.message) {
          Alert.alert("Lỗi", errorData.message);
        }
        // Trường hợp khác
        else {
          Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi dữ liệu.");
        }
      }
      // 🔴 Các lỗi khác
      else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối hoặc lỗi không xác định.");
      console.log("Submit error:", error);
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
        <View style={styles.headerBox}>
          <View style={styles.headerRow}>
            <Text style={styles.headerEmoji}>🚩</Text>
            <Text style={styles.headerText}>Tạo task cho sự kiện</Text>
          </View>
        </View>
        <View style={styles.form}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1e3a8a",
              marginBottom: 12,
              textAlign: "center"
            }}
          >
            🎯 Thông tin tạo task
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📛 Tên sự kiện: </Text>
            <Text style={styles.value}>{title}</Text>
          </View>

          {renderLabeledInput(
            "📝 Tên user theo id",
            userId,
            setUserId,
            "Nhập ID user",
            false,
            "numeric"
          )}
          {renderLabeledInput(
            "📝 Tên parent theo id",
            parentId,
            setParentId,
            "Nhập ID parent",
            false,
            "numeric"
          )}
          {/* {renderLabeledInput(
            "📝 Tên chủ đề",
            title,
            setTitle,
            "Nhập tên chủ đề"
          )} */}
          {renderLabeledInput(
            "📝 Mô tả",
            description,
            setDescription,
            "Nhập mô tả"
          )}

          <View style={{ marginBottom: 18 }}>
            <Text style={styles.label}>📅 Ngày diễn ra</Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              activeOpacity={0.85}
              style={styles.datePickerButton}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#007AFF"
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 15, color: "#333" }}>
                {dueDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🚀 Tạo task ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EventTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f9ff",
    paddingBottom: -20,
    flexGrow: 1
  },
  headerBox: {
    backgroundColor: "#dbeafe",
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#60a5fa",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  headerEmoji: {
    fontSize: 28,
    marginRight: 10
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d4ed8"
  },
  form: {
    padding: 24,
    marginTop: 16
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#2563eb",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 12
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A"
  },
  value: {
    fontSize: 16,
    color: "#111827",
    flexShrink: 1 // để text không bị tràn nếu quá dài
  }
});
