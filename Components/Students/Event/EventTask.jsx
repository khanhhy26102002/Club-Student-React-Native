import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { API_URL } from "@env";
import dayjs from "dayjs";
import { fetchBaseResponse } from "../../../utils/api";
import { Picker } from "@react-native-picker/picker";
const EventTask = ({ route }) => {
  const { eventId, clubId } = route.params;
  const [title, setTitle] = React.useState("");
  const [userId, setUserId] = React.useState(""); // string
  const [parentId, setParentId] = React.useState(""); // string
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [attachmentFile, setAttachmentFile] = React.useState(null);
  const formattedDate = dayjs(dueDate).format("YYYY-MM-DDTHH:mm:ss");
  const [members, setMembers] = React.useState([]);
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
  const pickAttachmentFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false
    });

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setAttachmentFile({
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream"
      });
    }
  };
  React.useEffect(() => {
    const fetchMembers = async () => {
      if (!clubId) {
        console.log("❌ Không có clubId, không gọi API members");
        return;
      }
      try {
        const token = await AsyncStorage.getItem("jwt");
        const res = await fetchBaseResponse(
          `/api/clubs/${clubId}/members`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("📌 Members:", res.data);
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        }
      } catch (err) {
        console.log("❌ Fetch members error:", err);
      }
    };

    fetchMembers();
  }, [clubId]);
  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    console.log("🔍 Sending data", {
      eventId,
      userId,
      parentId,
      title,
      description,
      formattedDate,
      attachmentFile
    });
    try {
      const formData = new FormData();
      formData.append("eventId", eventId.toString());
      formData.append("userId", userId.toString());
      formData.append("parentId", parentId ? parentId.toString() : "");
      formData.append("title", title);
      formData.append("description", description || "");
      formData.append("dueDate", formattedDate);

      if (attachmentFile) {
        formData.append("attachmentFile", {
          uri: attachmentFile.uri,
          type: attachmentFile.type || "application/octet-stream",
          name: attachmentFile.name || "file"
        });
      }
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      console.log("🔍 FINAL description:", description);
      const response = await fetch(`${API_URL}/api/tasks/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        body: formData
      });

      const result = await response.json();
      console.log("Result", result);
      console.log("Response", response);
      if (result.status === 8001) {
        Alert.alert(
          "❌ Không có quyền",
          "Bạn không có vai trò trong sự kiện này."
        );
        return;
      }

      if (response.status === 200) {
        Alert.alert("✅ Thành công", "Bạn đã tạo task thành công.");
      } else if (response.status === 400 || response.status === 422) {
        if (result?.errors) {
          const messages = Object.values(result.errors).join("\n");
          Alert.alert("Lỗi xác thực", messages);
        } else {
          Alert.alert("Lỗi", result.message || "Có lỗi xảy ra.");
        }
      } else {
        throw new Error(`Unexpected status ${response.status}`);
      }
    } catch (error) {
      console.log("❌ Submit error:", error);
      Alert.alert("Lỗi", "Không thể gửi dữ liệu. Vui lòng thử lại.");
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
            <Text style={styles.label}>📛 Mã sự kiện: </Text>
            <Text style={styles.value}>{eventId}</Text>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userId}
              onValueChange={(value) => setUserId(value)}
            >
              <Picker.Item label="-- Chọn thành viên --" value="" />
              {members.map((m) => (
                <Picker.Item
                  key={m.userId}
                  label={m.fullName}
                  value={m.userId}
                />
              ))}
            </Picker>
          </View>
          {renderLabeledInput(
            "📝 Tên parent theo id",
            parentId,
            setParentId,
            "Nhập ID parent",
            false,
            "numeric"
          )}
          {renderLabeledInput(
            "📝 Tên chủ đề",
            title,
            setTitle,
            "Nhập tên chủ đề"
          )}
          {renderLabeledInput(
            "Miêu tả",
            description,
            setDescription,
            "Nhập miêu tả"
          )}
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.label}>📎 File đính kèm</Text>
            <TouchableOpacity
              onPress={pickAttachmentFile}
              style={styles.filePickerButton}
              activeOpacity={0.85}
            >
              <Ionicons
                name="attach-outline"
                size={20}
                color="#007AFF"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#007AFF" }}>
                {attachmentFile ? attachmentFile.name : "Chọn file"}
              </Text>
            </TouchableOpacity>
          </View>

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
  fieldContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1e3a8a"
  },
  editorWrapper: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: 120 // ✅ set ở đây thay vì editor/editorContainer
  },
  editor: {
    height: "100%", // ✅ chiếm hết chiều cao cha
    padding: 8
  },
  editorContainer: {
    // nếu cần cũng có thể set maxHeight ở đây
    maxHeight: 200
  },
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
