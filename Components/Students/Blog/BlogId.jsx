import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";
export default function BlogId() {
  const route = useRoute();
  const { blogId } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [commentLoading, setCommentLoading] = React.useState(true);
  const [content, setContent] = React.useState("");
  const [posting, setPosting] = React.useState(false);
  // Fetch blog
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

  // Fetch comments
  const fetchComments = async () => {
    setCommentLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse(`/api/comment-blogs/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        setComments(res.data || []);
      } else {
        Alert.alert("Lỗi", "Không thể tải bình luận");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  React.useEffect(() => {
    if (blogId) fetchComments();
  }, [blogId]);

  // Post comment
  const postComment = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse(`/api/comment-blogs/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: { content, blogId }
      });
      if (res.status === 200) {
        setContent("");
        fetchComments();
      } else {
        Alert.alert("Lỗi", "Không thể gửi bình luận");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi bình luận");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy blog!</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <FlatList
        data={comments}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <Text style={styles.commentUser}>
              {item.userFullName || "Người dùng"}:
            </Text>
            <Text>{stripMarkdown(item.content)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888" }}>Chưa có bình luận nào.</Text>
        }
        ListHeaderComponent={
          <>
            {/* Blog card */}
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              style={styles.card}
            >
              <LinearGradient
                colors={["#6a11cb", "#2575fc"]}
                style={styles.gradient}
              >
                <Image
                  source={{
                    uri:
                      data.thumbnailUrl ||
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                  }}
                  style={styles.image}
                />
                <Text style={styles.title}>
                  {data.title || "Không có tiêu đề"}
                </Text>
                <Text style={styles.description} selectable>
                  {stripMarkdown(data.content) || "Không có nội dung"}
                </Text>
              </LinearGradient>
            </Animatable.View>

            {/* Ô nhập bình luận */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Viết bình luận..."
                value={content}
                onChangeText={setContent}
                editable={!posting}
                multiline
              />
              <TouchableOpacity
                onPress={postComment}
                disabled={posting || !content.trim()}
                style={styles.sendBtn}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {posting ? "..." : "Gửi"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    backgroundColor: "#F5F7FA",
    flexGrow: 1,
    alignItems: "center"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  card: {
    width: "100%",
    borderRadius: 22,
    shadowColor: "#333",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 24
  },
  gradient: {
    borderRadius: 22,
    padding: 22,
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    backgroundColor: "#eee"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#6a11cb60",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 4,
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: "center"
  },
  description: {
    color: "#E2E6EA",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 6,
    marginBottom: 16
  },
  commentBox: {
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 9,
    marginBottom: 7,
    shadowColor: "#aaa",
    shadowOpacity: 0.12,
    shadowOffset: { width: 2, height: 2 }
  },
  commentUser: {
    fontWeight: "bold",
    color: "#3E63DD"
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    shadowColor: "#888",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 10
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 85,
    paddingLeft: 8
  },
  sendBtn: {
    padding: 10,
    backgroundColor: "#2575fc",
    borderRadius: 7,
    marginLeft: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});
