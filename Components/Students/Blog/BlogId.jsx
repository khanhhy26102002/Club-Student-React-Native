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
          <View style={styles.dateWrapper}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.date}>
              {new Date(data.createdAt).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </Text>
          </View>
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
    backgroundColor: "#f3f4f6"
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24
  },
  coverImage: {
    width: "100%",
    height: 220
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827", // Slate-900
    textAlign: "center",
    marginBottom: 10
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb", // light gray background
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  calendarIcon: {
    marginRight: 6,
    fontSize: 16
  },
  date: {
    fontSize: 14,
    color: "#4b5563" // Gray-600
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3
  },
  content: {
    fontSize: 17,
    lineHeight: 28,
    color: "#374151" // Gray-700
  }
});
