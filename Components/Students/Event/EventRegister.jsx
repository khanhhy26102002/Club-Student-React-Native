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
  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };
  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const isoDate = new Date(eventDate).toISOString();
    try {
      await fetchBaseResponse("/events/create-event-request", {
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
      Alert.alert("Bạn tạo sự kiện thành công", "Đang chờ admin duyệt");
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("Không tạo được sự kiện", error);
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
            <Text style={styles.headerText}>Tạo câu lạc bộ cho riêng bạn</Text>
          </View>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="📛 Nhập tên câu lạc bộ (VD: Developer Club)"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input]}
            placeholder="📝 Miêu tả ngắn gọn về câu lạc bộ của bạn..."
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={{ marginBottom: 18 }}>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
                backgroundColor: "#fff",
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 2
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#666"
                style={{ marginRight: 8 }}
              />
              <Text style={{ fontSize: 15, color: "#333" }}>
                {eventDate.toLocaleDateString("vi-VN")}
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
          <TextInput
            style={[styles.input]}
            placeholder="Điền format"
            placeholderTextColor="#aaa"
            value={format}
            onChangeText={setFormat}
            multiline
          />
          <TextInput
            style={[styles.input]}
            placeholder="Điền địa điểm"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
            multiline
          />
          <TextInput
            style={[styles.input]}
            placeholder="Điền tối thiểu người tham gia"
            placeholderTextColor="#aaa"
            value={minimumParticipants.toString()}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              setMinimumParticipants(isNaN(parsed) ? 0 : parsed);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input]}
            placeholder="Điền tối đa người tham gia"
            placeholderTextColor="#aaa"
            value={maximumParticipants.toString()}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              setMaximumParticipants(isNaN(parsed) ? 0 : parsed);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input]}
            placeholder="Điền điểm thực hành"
            placeholderTextColor="#aaa"
            value={visibility}
            onChangeText={setVisibility}
            multiline
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10
            }}
          >
            <Text style={{ marginRight: 10 }}>🔬 Dùng phòng lab:</Text>
            <Switch
              value={useLab}
              onValueChange={setUseLab}
              trackColor={{ false: "#aaa", true: "#0f0" }}
              thumbColor={useLab ? "#fff" : "#f4f3f4"}
            />
          </View>
          <TextInput
            style={[styles.input]}
            placeholder="Điền câu lạc bộ"
            placeholderTextColor="#aaa"
            value={clubId.toString()}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              setClubId(isNaN(parsed) ? 0 : parsed);
            }}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
            activeOpacity={0.85}
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
    paddingBottom: 32,
    backgroundColor: "#f2f4f8",
    flexGrow: 1
  },
  headerBox: {
    backgroundColor: "#ff660020",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#ff6600",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  headerEmoji: {
    fontSize: 26,
    marginRight: 8
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff6600",
    textAlign: "center"
  },
  form: {
    padding: 24,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    fontSize: 15,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#ff6600",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4
  },
  buttonDisabled: {
    backgroundColor: "#ccc"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});
