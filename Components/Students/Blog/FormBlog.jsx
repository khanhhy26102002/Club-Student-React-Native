import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from "@env";

const API = API_URL;

const FormBlog = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clubId } = route.params;
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageObj = result.assets[0];
      console.log("🔍 Thumbnail object:", imageObj);
      setImage(imageObj); // full object with uri, type
    }
  };

  const pickMultipleImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets);
    }
  };

  const compressImage = async (image) => {
    if (!image?.uri) throw new Error("❌ Image không có uri!");

    const result = await ImageManipulator.manipulateAsync(image.uri, [], {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG
    });

    return result;
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    if (!thumbnail?.uri) {
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

      formData.append("clubId", clubId.toString());
      formData.append("title", title);
      formData.append("content", content);

      console.log("🔍 Thumbnail trước khi nén:", thumbnail);

      const compressedThumbnail = await compressImage(thumbnail);
      formData.append("thumbnail", {
        uri: compressedThumbnail.uri,
        name: "thumbnail.jpg",
        type: "image/jpeg"
      });

      for (let i = 0; i < images.length; i++) {
        const compressed = await compressImage(images[i]);
        formData.append("images", {
          uri: compressed.uri,
          name: `image_${i}.jpg`,
          type: "image/jpeg"
        });
      }

      for (let pair of formData.entries()) {
        console.log("📝 FormData:", pair[0], pair[1]);
      }

      const response = await fetch(`${API}/api/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      console.log("📥 Blog response:", result);
      if (response.ok && result?.status === 200) {
        Alert.alert("🎉 Thành công", "Blog đã được tạo.");

        navigation.navigate("Club", {
          screen: "ClubGroup",
          params: {
            clubId: clubId,
            refresh: true // 👈 Gửi cờ refresh về
          }
        });
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
    <View style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      <Header />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={styles.header}>🌟 Tạo Blog Mới</Text>

        <Text style={styles.label}>🎯 Chủ đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Mời bạn nhập chủ đề"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>📖 Nội dung</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Mời bạn nhập nội dung"
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ec4899" }]}
          onPress={() => pickImage(setThumbnail)}
        >
          <Text style={styles.buttonText}>
            {thumbnail ? "✅ Đã chọn thumbnail" : "🖼️ Chọn ảnh thumbnail"}
          </Text>
        </TouchableOpacity>

        {thumbnail && thumbnail.uri && (
          <Image
            source={{ uri: thumbnail.uri }}
            style={styles.thumbnailPreview}
          />
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#10b981", marginTop: 16 }]}
          onPress={pickMultipleImages}
        >
          <Text style={styles.buttonText}>
            {images.length > 0
              ? `✅ Đã chọn ${images.length} ảnh`
              : "📷 Chọn ảnh nội dung"}
          </Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <ScrollView
            horizontal
            style={{ marginTop: 12 }}
            showsHorizontalScrollIndicator={false}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.uri }}
                style={styles.contentImagePreview}
              />
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#3b82f6", marginTop: 28 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "⏳ Đang gửi..." : "🚀 Tạo Blog"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 16,
    color: "#0c4a6e"
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
    marginTop: 18
  },
  input: {
    borderWidth: 1.3,
    borderColor: "#dbeafe",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
    color: "#0f172a",
    fontSize: 15
  },
  multiline: {
    minHeight: 120
  },
  button: {
    marginTop: 20,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
  thumbnailPreview: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 12,
    resizeMode: "cover"
  },
  contentImagePreview: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#bae6fd"
  }
});

export default FormBlog;
