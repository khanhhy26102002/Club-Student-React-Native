import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import Header from "../../../Header/Header";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
const API = API_URL;
const UpdateBlog = ({ navigation }) => {
  const route = useRoute();
  const { blogId } = route.params;
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState(null);
  const [images, setImages] = React.useState([]); // ✅ default = []
  const [loading, setLoading] = React.useState(false);
  const compressImage = async (image) => {
    const result = await ImageManipulator.manipulateAsync(image.uri, [], {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG
    });
    return result;
  };
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền truy cập ảnh.");
      return false;
    }
    return true;
  };

  const pickImage = async (setImage) => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImage(asset);
    }
  };

  const pickMultipleImages = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // ⚠️ Expo chỉ hỗ trợ cái này với `expo-image-picker >= 14` + `expo-dev-client`
      quality: 1
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets);
    }
  };

  console.log("FormData debug:", {
    title,
    content,
    blogId,
    thumbnail: thumbnail?.uri,
    images: images?.map((img) => img.uri)
  });

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    if (!thumbnail) {
      Alert.alert("⚠️ Thiếu ảnh", "Vui lòng chọn ảnh thumbnail cho blog.");
      return;
    }

    if (!images || images.length === 0) {
      Alert.alert("⚠️ Thiếu ảnh", "Vui lòng chọn ít nhất 1 ảnh minh họa.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        Alert.alert("❌ Lỗi", "Không tìm thấy token đăng nhập.");
        return;
      }

      const formData = new FormData();

      // Append basic text fields
      formData.append("blogId", blogId.toString());
      formData.append("title", title);
      formData.append("content", content);

      // Compress and append thumbnail image
      const compressedThumbnail = await compressImage(thumbnail);
      formData.append("thumbnail", {
        uri: compressedThumbnail.uri,
        name: "thumbnail.jpg",
        type: "image/jpeg"
      });

      // Compress and append multiple content images
      for (let i = 0; i < images.length; i++) {
        const compressed = await compressImage(images[i]);
        formData.append("images", {
          uri: compressed.uri,
          name: `image_${i}.jpg`,
          type: "image/jpeg"
        });
      }

      // Debug FormData content
      for (let pair of formData.entries()) {
        console.log("📝 FormData:", pair[0], pair[1]);
      }

      // Send API request
      const response = await fetch(`${API}/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
          // ❗ Không thêm "Content-Type" khi gửi FormData
        },
        body: formData
      });

      // Parse response (support JSON or plain text)
      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      console.log("📥 Blog response:", result);

      if (response.ok && result?.status === 200) {
        Alert.alert("🎉 Thành công", "Blog đã được cập nhật");
        navigation.goBack();
      } else {
        Alert.alert("❌ Lỗi", result?.message || "Tạo blog thất bại.");
      }
    } catch (err) {
      console.error("❌ Error submitting blog:", err);
      Alert.alert("Lỗi", "Không thể gửi blog: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{blogId}</Text>
        <Text style={styles.label}>Chủ đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Mời bạn nhập chủ đề"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Mời bạn nhập nội dung"
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4B5563", marginTop: 16 }]}
          onPress={() => pickImage(setThumbnail)}
        >
          <Text style={styles.buttonText}>
            {thumbnail ? "✅ Đã chọn thumbnail" : "🖼️ Chọn ảnh thumbnail"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6B7280", marginTop: 12 }]}
          onPress={pickMultipleImages}
        >
          <Text style={styles.buttonText}>
            {images.length > 0
              ? `✅ ${images.length} ảnh đã chọn`
              : "🖼️ Chọn ảnh nội dung"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {loading ? "Đang gửi..." : "Tạo Blog"}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#2563eb" />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
    color: "#111827"
  },
  multiline: {
    height: 120
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default UpdateBlog;
