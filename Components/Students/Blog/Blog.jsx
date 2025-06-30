import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const Blog = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetchBaseResponse(`/blogs`, {
            method: "GET"
          });
          if (!response || response.length === 0) {
            Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
            setData([]);
          } else {
            setData(response.data);
          }
        } catch (error) {
          Alert.alert("Lỗi lấy dữ liệu", error.message || "Không xác định");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>
          Đăng bởi <Text style={styles.author}>{item.authorName}</Text> •{" "}
          {formatDate(item.createdAt)}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.content}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BlogId", { id: item.blogId })}
        >
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Bài viết Blog</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.blogId.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không có dữ liệu blog.</Text>
            }
          />
        )}
      </View>
    </>
  );
};

export default Blog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: "#6b7280", // Gray-500
    marginBottom: 10,
  },
  author: {
    fontWeight: "bold",
    color: "#2563eb", // Blue-600
  },
  description: {
    fontSize: 16,
    color: "#374151", // Gray-700
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 20,
  },
});

