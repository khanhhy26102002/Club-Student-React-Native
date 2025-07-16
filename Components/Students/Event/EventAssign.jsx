import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput
} from "react-native";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { Picker } from "@react-native-picker/picker";
// bị lỗi create-event-request
// lỗi assign-role khi đã làm chủ event là eventId 2
const EventAssign = ({ route, navigation }) => {
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [roleName, setRoleName] = React.useState("VOLUNTEER");
  const { eventId, title } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [hasPermission, setHasPermission] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/api/event-roles/my/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status === 200 && response.data.roleName === "ORGANIZER") {
          setHasPermission(true);
        } else {
          Alert.alert(
            "🚫 Không đủ quyền",
            "Bạn không có quyền phân vai trong sự kiện này."
          );
        }
        const listRes = await fetchBaseResponse(
          `/api/event-roles/event/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (listRes.status === 200) {
          setData(listRes.data);
        } else {
          throw new Error(`HTTP Status:${listRes.status}`);
        }
      } catch (error) {
        console.error("Error: ", error);
        Alert.alert("Không fetching được data");
      }
    };
    fetchData();
  }, [eventId]);

  const handleAssign = async () => {
    if (!selectedUserId) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng chọn người dùng.");
      return;
    }

    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");

    try {
      const response = await fetchBaseResponse(
        `/api/event-roles/assign/${eventId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { userId: selectedUserId, roleName }
        }
      );

      const resStatus = response?.status;
      const resMessage = response?.message || "";

      if (resStatus === 200) {
        Alert.alert("🎉 Thành công", "Bạn đã phân role thành công.");
        navigation.navigate("Event", {
          screen: "EventTask",
          params: {
            eventId: eventId,
            title: title
          }
        });
      }
    } catch (error) {
      const fallbackMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi không xác định.";
      if (fallbackMsg === "You do not have permission to use this") {
        Alert.alert("🚫 Không được phép", "Bạn không có quyền gán vai trò.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎯 Phân vai trò thành viên</Text>

        <View style={styles.card}>
          <Text style={styles.eventLabel}>🎟️ Tên sự kiện:</Text>
          <Text style={styles.eventTitle}>{title}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>👥 Chọn người dùng:</Text>
          <View style={styles.pickerWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã số người dùng"
              value={selectedUserId ? selectedUserId.toString() : ""}
              onChangeText={(text) => {
                const parsed = parseInt(text);
                setSelectedUserId(isNaN(parsed) ? null : parsed);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>🎖️ Vai trò:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={roleName}
              onValueChange={(itemValue) => setRoleName(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="🎉 Tình nguyện viên" value="VOLUNTEER" />
              <Picker.Item label="🛠️ Ban tổ chức" value="ORGANIZER" />
              <Picker.Item label="✅ Check-in" value="CHECKIN" />
              <Picker.Item label="📤 Check-out" value="CHECKOUT" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!hasPermission || loading) && {
              backgroundColor: "#93C5FD",
              opacity: 0.6
            }
          ]}
          onPress={handleAssign}
          disabled={!hasPermission || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {hasPermission ? "🚀 Gán vai trò" : "⛔ Không đủ quyền"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default EventAssign;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#2563EB",
    marginBottom: 28
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20
  },
  eventLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280"
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    overflow: "hidden"
  },
  picker: {
    height: 56,
    backgroundColor: "#F3F4F6"
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
  }
});
