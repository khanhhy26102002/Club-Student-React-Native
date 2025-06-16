import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import API, { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
const BlogId = () => {
  const route = useRoute();
  const { id } = route.params;

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse(`/blogs/${id}`, {
          method: "GET"
        });
        if (!response || response.length === 0) {
          Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        Alert.alert("Lỗi khi tải bài viết", error.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.date}>
            {new Date(data.createdAt).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{data.content}</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default BlogId;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F9FAFB",
    flexGrow: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB"
  },
  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    fontWeight: "600"
  },
  headerContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 6,
    lineHeight: 34
  },
  date: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic"
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  content: {
    fontSize: 16,
    lineHeight: 28,
    color: "#444444"
  }
});
