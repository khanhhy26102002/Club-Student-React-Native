import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import QuillEditor from "../../QuillEditor";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@env";
import dayjs from "dayjs";
const EventRegister = ({ navigation }) => {
  const route = useRoute();
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const quillRef = React.useRef(null);
  const [eventDate, setEventDate] = React.useState(null);
  const [format, setFormat] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [maximumParticipants, setMaximumParticipants] = React.useState(0);
  const [visibility, setVisibility] = React.useState("");
  const [eventType, setEventType] = React.useState("TICKET");
  const [useLab, setUseLab] = React.useState(true);
  const { clubId, name } = route.params;
  console.log("📌 clubId từ params:", clubId);
  const [clubName, setClubName] = React.useState("");
  const [projectFile, setProjectFile] = React.useState(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const formattedDate = dayjs(eventDate).format("YYYY-MM-DDTHH:mm:ss");
  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(`/api/clubs/${clubId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setClubName(response.data.name);
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sự kiện");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mô tả sự kiện");
      return false;
    }
    if (!format) {
      Alert.alert("Lỗi", "Vui lòng chọn hình thức tổ chức");
      return false;
    }
    if (!location.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập địa điểm tổ chức");
      return false;
    }
    if (maximumParticipants <= 0) {
      Alert.alert("Lỗi", "Số lượng tối đa phải lớn hơn 0");
      return false;
    }
    if (!visibility) {
      Alert.alert("Lỗi", "Vui lòng chọn mức độ công khai");
      return false;
    }
    return true;
  };
  React.useEffect(() => {
    fetchData();
  }, [clubId]);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      const htmlDescription = await quillRef.current.getHtml();
      const formData = new FormData();
      formData.append("projectFile", {
        uri: projectFile.uri,
        name: projectFile.name,
        type: projectFile.type || "application/octet-stream"
      });
      formData.append("title", title);
      formData.append("description", htmlDescription);
      formData.append("eventDate", formattedDate);
      formData.append("format", format);
      formData.append("location", location);
      formData.append("maximumParticipants", maximumParticipants.toString());
      formData.append("visibility", visibility);
      formData.append("useLab", useLab.toString());
      formData.append("clubId", clubId.toString());
      formData.append("eventType", eventType);
      const response = await fetch(
        `${API_URL}/api/events/create-event-request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          body: formData
        }
      );

      const responseJson = await response.json();
      console.log("📥 Server response:", responseJson);

      if (responseJson.message === "Event creation request successful") {
        Alert.alert("🎉 Thành công", "Tạo sự kiện thành công chờ admin duyệt");
        navigation.navigate("Club", {
          screen: "ClubGroup",
          params: {
            clubId
          }
        });
      } else {
        Alert.alert("❌", responseJson.message || "Có lỗi xảy ra.");
      }
    } catch (err) {
      console.log("❌ Upload error:", err);
      Alert.alert("❌ Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (projectFile) console.log("🖼️ projectFile đã được set:", projectFile);
  }, [projectFile]);
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Hoặc chỉ định như: "application/pdf" nếu muốn chỉ chọn PDF
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result.canceled) return;

      const file = result.assets[0];

      const fileObj = {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream"
      };

      setProjectFile(fileObj);
      console.log("✅ File đã chọn:", fileObj);
    } catch (err) {
      console.error("❌ Lỗi khi chọn file:", err);
      Alert.alert("Lỗi", "Không thể chọn tệp");
    }
  };

  const renderLabeledInput = (
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = "default"
  ) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
  const renderLabeledSelect = (
    label,
    value,
    setValue,
    placeholder,
    options
  ) => (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontSize: 16, marginBottom: 15 }}>{label}</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          backgroundColor: "#fff"
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => setValue(itemValue)}
          style={{ height: 55 }}
        >
          {options.map((option) => (
            <Picker.Item
              label={option.label}
              value={option.value}
              key={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
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
            <Text
              style={{ fontSize: 16, textAlign: "center", marginBottom: 10 }}
            >
              🎓 Tạo sự kiện cho CLB:{" "}
              <Text style={{ fontWeight: "bold", color: "#2563eb" }}>
                {clubName || name}
              </Text>
            </Text>
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
            🎯 Thông tin sự kiện
          </Text>
          {renderLabeledInput(
            "📛 Tên sự kiện",
            title,
            setTitle,
            "VD: Developer Club"
          )}
          {/* {renderLabeledInput(
            "📝 Mô tả",
            description,
            setDescription,
            "Miêu tả ngắn gọn về sự kiện...",
            true
          )} */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>📄 Miêu tả *</Text>
            <View style={styles.editorWrapper}>
              <QuillEditor
                ref={quillRef}
                initialHtml={description}
                style={styles.editor}
                containerStyle={styles.editorContainer}
                theme="light"
                placeholder="Nhập miêu tả ở đây..."
                onFocus={() => {
                  // Có thể thêm animation nhẹ nếu muốn
                }}
              />
            </View>
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
                {eventDate
                  ? eventDate.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : "Chọn ngày diễn ra"}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={eventDate || new Date()} // fallback nếu eventDate đang null
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange}
              />
            )}
          </View>
          {renderLabeledSelect(
            "🎭 Hình thức",
            format,
            setFormat,
            "Chọn hình thức tổ chức",
            [
              { label: "Offline", value: "OFFLINE" },
              { label: "Online", value: "ONLINE" },
              { label: "Kết hợp giữa Online và Offline", value: "MIX" }
            ]
          )}
          {renderLabeledInput(
            "📍 Địa điểm",
            location,
            setLocation,
            "Ví dụ: Hội trường A1",
            true
          )}
          {renderLabeledInput(
            "👥 Số lượng tối đa",
            maximumParticipants.toString(),
            (text) =>
              setMaximumParticipants(
                isNaN(parseInt(text)) ? 0 : parseInt(text)
              ),
            "0",
            false,
            "numeric"
          )}
          {renderLabeledSelect(
            "👁️‍🗨️ Mức độ hiển thị",
            visibility,
            setVisibility,
            "Chọn hình thức hiển thị",
            [
              { label: "Công Khai", value: "PUBLIC" },
              { label: "Nội bộ", value: "INTERNAL" }
            ]
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18
            }}
          >
            <Text style={styles.label}>🔬 Dùng phòng Lab:</Text>
            <Switch
              value={useLab}
              onValueChange={setUseLab}
              trackColor={{ false: "#aaa", true: "#007AFF" }}
              thumbColor={useLab ? "#fff" : "#f4f3f4"}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18
            }}
          >
            <Text style={styles.label}>Chọn file document</Text>
            <TouchableOpacity
              onPress={pickDocument}
              style={[styles.uploadButton, { marginLeft: 10, marginTop: -5 }]}
            >
              <Text style={styles.uploadText}>📎 Chọn file đính kèm</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{ marginBottom: 18 }}>
            <Text style={styles.label}>🏷️ Tên câu lạc bộ</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#f0f0f0" }]}
              value={clubName || name}
              editable={false}
              selectTextOnFocus={false}
              placeholder="Tên câu lạc bộ"
              placeholderTextColor="#aaa"
            />
          </View> */}
          {renderLabeledSelect(
            "🎫 Loại sự kiện",
            eventType,
            setEventType,
            "Chọn loại sự kiện",
            [
              { label: "TICKET", value: "TICKET" },
              { label: "PRODUCT", value: "PRODUCT" }
            ]
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🚀 Tạo sự kiện ngay</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EventRegister;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f9ff",
    paddingBottom: -20,
    flexGrow: 1
  },
  fieldContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333"
  },
  editorWrapper: {
    height: 100, // ✅ chiều cao thu gọn
    padding: 10,
    minHeight: 70,
    marginBottom: -20
  },
  editor: {
    flex: 1,
    fontSize: 14
  },
  editorContainer: {
    backgroundColor: "transparent",
    height: -110
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
  }
});
