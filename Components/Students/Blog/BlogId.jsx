import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const BlogId = ({ navigation }) => {
  const route = useRoute();
  const { blogId } = route.params;

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/api/blogs/public/${blogId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response || !response.data) {
          Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
        } else {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
        if (error?.status === 3001) {
          Alert.alert(
            "🚫 Không thể truy cập",
            "Bạn không có quyền xem blog này vì nó thuộc một CLB khác."
          );
        } else {
          Alert.alert("Lỗi khi tải bài viết", error.message || "Đã xảy ra lỗi");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [blogId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy bài viết.</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Club",{
          screen:"Blog"
        })}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={[styles.backText, { marginLeft: 25, marginTop: -22 }]}>
          Quay về trang chủ
        </Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Thumbnail đẹp như banner */}
        {data.thumbnailUrl && (
          <Image
            source={{ uri: data.thumbnailUrl }}
            style={styles.bannerImage}
          />
        )}

        {/* Nội dung chính */}
        <View style={styles.card}>
          <Text style={styles.title}>{data.title}</Text>

          <View style={styles.metaWrapper}>
            <Text style={styles.metaText}>
              ✍️ {data.authorName || "Không rõ"}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>
              📅{" "}
              {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </Text>
          </View>

          <Text style={styles.content}>{data.content}</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default BlogId;

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#f0f0f0", // hoặc màu theo chủ đề
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start", // để nó không chiếm toàn bộ chiều ngang
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    marginBottom: 20
  },
  backText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500"
  },
  container: {
    backgroundColor: "#f2f4f8",
    paddingBottom: 40
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f"
  },
  bannerImage: {
    width: screenWidth,
    height: 220,
    resizeMode: "cover",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 14,
    lineHeight: 34
  },
  metaWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18
  },
  metaText: {
    fontSize: 14,
    color: "#6b7280"
  },
  dot: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#9ca3af"
  },
  content: {
    fontSize: 17,
    lineHeight: 28,
    color: "#374151",
    marginTop: 6
  }
});
