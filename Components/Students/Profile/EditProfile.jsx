import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchBaseResponse } from "../../../utils/api"; // file bên dưới
import Header from "../../../Header/Header";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@env";
const EditProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const academicYears = ["YEAR_ONE", "YEAR_TWO", "YEAR_THREE", "YEAR_FOUR"];
  const [loading, setLoading] = useState(false);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      setAvatarFile({
        uri: selected.uri,
        type: selected.type || "image/jpeg",
        name: selected.fileName || "avatar.jpg"
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwt");

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("academicYear", academicYear);

      if (avatarFile) {
        formData.append("avatarFile", {
          uri: avatarFile.uri,
          type: "image/jpeg", // đảm bảo là MIME type đúng
          name: avatarFile.name
        });
      }

      console.log("👀 FormData:", formData);

      const response = await fetch(`${API_URL}/api/users/editProfile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const json = await response.json();
      console.log("📥 Response:", json);

      if (response.status === 200) {
        Alert.alert("✅ Thành công", "Bạn đã cập nhật thành công");
        navigation.navigate("Profile", { screen: "ProfileNo" });
      } else {
        Alert.alert("❌ Lỗi", json.message || "Không cập nhật được profile");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("❌ Lỗi", "Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sửa hồ sơ</Text>

        <Text style={styles.label}>Họ và tên *</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ và tên"
        />

        <Text style={styles.label}>Năm học *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={academicYear}
            onValueChange={(value) => setAcademicYear(value)}
          >
            <Picker.Item label="-- Chọn năm học --" value="" />
            {academicYears.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Ảnh đại diện</Text>
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={handlePickAvatar}
        >
          <Text style={styles.buttonTextOutline}>📷 Chọn ảnh từ thiết bị</Text>
        </TouchableOpacity>

        {avatarFile && (
          <Image
            source={{ uri: avatarFile.uri }}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#f8fafc",
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937",
    textAlign: "center"
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#1f2937"
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 18
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 18
  },
  button: {
    backgroundColor: "#1877f2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  buttonOutline: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1877f2",
    marginBottom: 10,
    alignItems: "center"
  },
  buttonTextOutline: {
    color: "#1877f2",
    fontWeight: "600"
  },
  avatar: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 20
  }
});

export default EditProfile;
