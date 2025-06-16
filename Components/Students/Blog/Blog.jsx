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
            setData(response);
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
    padding: 16,
    backgroundColor: "#FAFAFA"
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333"
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#007AFF"
  },
  meta: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10
  },
  author: {
    fontWeight: "bold",
    color: "#555"
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20
  }
});
