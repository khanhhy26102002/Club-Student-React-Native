import {
  Alert,
  Button,
  Image,
  StyleSheet,
  View,
  ActivityIndicator
} from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { fetchBaseResponse } from "../../utils/api";
import Header from "../../Header/Header";

const ImageController = () => {
  const [file, setFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      Alert.alert(
        "⚠️ Không có quyền",
        "Bạn cần cấp quyền truy cập thư viện ảnh."
      );
      return;
    }
    if (!file) {
      Alert.alert(
        "❗ Chưa chọn ảnh",
        "Vui lòng chọn một ảnh trước khi tải lên."
      );
      return;
    }

    console.log("🖼️ Chọn ảnh:", file);

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.fileName || "image.jpg",
      type: file.type || "image/jpeg"
    });

    try {
      setUploading(true);

      const response = await fetchBaseResponse("/images/upload", {
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("✅ Server response:", response);

      const imageUrl = response?.url || response?.data?.url;
      if (imageUrl) {
        Alert.alert("✅ Thành công", "Ảnh đã được tải lên.");
        console.log("🖼️ URL:", imageUrl);
      } else {
        Alert.alert("❌ Lỗi", "Server không trả URL.");
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);

      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Lỗi không xác định.";

      Alert.alert("❌ Upload thất bại", serverMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Button title="Chọn ảnh" onPress={pickImage} />
        {file && (
          <Image
            source={{ uri: file.uri }}
            style={{ width: 200, height: 200, marginVertical: 16 }}
          />
        )}
        <Button title="Tải ảnh lên" onPress={uploadImage} />
        {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </View>
    </>
  );
};

export default ImageController;

const styles = StyleSheet.create({
  container: {
    padding: 16
  }
});
