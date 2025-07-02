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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const EventRegister = () => {
  const [title, setTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [eventDate, setEventDate] = React.useState(new Date());
  const [format, setFormat] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [minimumParticipants, setMinimumParticipants] = React.useState(0);
  const [maximumParticipants, setMaximumParticipants] = React.useState(0);
  const [visibility, setVisibility] = React.useState("");
  const [useLab, setUseLab] = React.useState(true);
  const [clubId, setClubId] = React.useState(0);
  const [showPicker, setShowPicker] = React.useState(false);

  const onChange = (selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    const isoDate = new Date(eventDate).toISOString();
    try {
      const response = await fetchBaseResponse("/events/create-event-request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: {
          title,
          description,
          eventDate: isoDate,
          format,
          location,
          minimumParticipants,
          maximumParticipants,
          visibility,
          useLab,
          clubId
        }
      });
      if (response.message === "event creation request successful") {
        Alert.alert("Bạn tạo sự kiện thành công", "Đang chờ admin duyệt");
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("Không tạo được sự kiện", error.message);
    } finally {
      setLoading(false);
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
          <Picker.Item label={placeholder} value="" />
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
            <Text style={styles.headerText}>Tạo sự kiện cho câu lạc bộ</Text>
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
          {renderLabeledInput(
            "📝 Mô tả",
            description,
            setDescription,
            "Miêu tả ngắn gọn về sự kiện...",
            true
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
                {eventDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={eventDate}
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
            "Chọn hình thức",
            [
              { label: "Offline", value: "OFFLINE" },
              { label: "Online", value: "ONLINE" }
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
            "👥 Số lượng tối thiểu",
            minimumParticipants.toString(),
            (text) =>
              setMinimumParticipants(
                isNaN(parseInt(text)) ? 0 : parseInt(text)
              ),
            "0",
            false,
            "numeric"
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
            "👁️‍🗨️ Mức độ công khai",
            visibility,
            setVisibility,
            "Chọn hình thức công khai",
            [
              { label: "Công Khai", value: "PUBLIC" },
              { label: "Riêng tư", value: "PRIVATE" }
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
          {renderLabeledInput(
            "🆔 Mã câu lạc bộ",
            clubId.toString(),
            (text) => setClubId(isNaN(parseInt(text)) ? 0 : parseInt(text)),
            "Ví dụ: 123",
            false,
            "numeric"
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
