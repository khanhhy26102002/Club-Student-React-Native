import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const BlogId = () => {
  const route = useRoute();
  const { blogId } = route.params;

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse(`/api/blogs/${blogId}`, {
          method: "GET"
        });

        if (!response || response.length === 0) {
          Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
        } else {
          setData(response.data);
        }
      } catch (error) {
        Alert.alert("Lỗi khi tải bài viết", error.message || "Đã xảy ra lỗi");
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
      <ScrollView contentContainerStyle={styles.container}>
        {data.coverImage && (
          <Image source={{ uri: data.coverImage }} style={styles.coverImage} />
        )}

        <Text style={styles.title}>{data.title}</Text>

        <View style={styles.metaWrapper}>
          <Text style={styles.author}>✍️ {data.authorName || "Không rõ"}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>
            📅{" "}
            {new Date(data.createdAt).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.content}>{data.content}</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default BlogId;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
    padding: 20
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
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center"
  },
  metaWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  author: {
    fontSize: 14,
    color: "#6b7280"
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 14,
    color: "#6b7280"
  },
  date: {
    fontSize: 14,
    color: "#6b7280"
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4
  },
  content: {
    fontSize: 18,
    lineHeight: 30,
    color: "#374151"
  }
});
