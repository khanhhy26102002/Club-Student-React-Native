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
  FlatList,
  Modal,
  Button
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

  const [editingComment, setEditingComment] = React.useState(null);
  const [newContent, setNewContent] = React.useState("");

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
        if (!response?.data) {
          Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
        } else setData(response.data);
      } catch (error) {
        Alert.alert("Lỗi khi tải bài viết", error.message || "Đã xảy ra lỗi");
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
      if (res.status === 200) setComments(res.data || []);
      else Alert.alert("Lỗi", "Không thể tải bình luận");
    } catch {
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
      } else Alert.alert("Lỗi", "Không thể gửi bình luận");
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || err.message || "Có lỗi khi gửi bình luận"
      );
    } finally {
      setPosting(false);
    }
  };

  // Edit comment
  const editComment = async (commentId, updatedContent) => {
    if (!updatedContent.trim()) {
      Alert.alert("Lỗi", "Nội dung bình luận không được để trống");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse(
        `/api/comment-blogs/edit/${commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { content: updatedContent }
        }
      );
      if (res.status === 200 && res.data) {
        Alert.alert(
          "Thành công",
          res.data.message || "Bình luận đã được cập nhật."
        );
        fetchComments();
      } else {
        Alert.alert("Lỗi", res.data?.message || "Không thể cập nhật bình luận");
      }
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi sửa bình luận"
      );
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá bình luận này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("jwt");
            const res = await fetchBaseResponse(
              `/api/comment-blogs/${commentId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );
            if (res.status === 200) {
              Alert.alert("Thành công", "Bình luận đã được xoá.");
              fetchComments();
            } else {
              Alert.alert(
                "Lỗi",
                res.data?.message || "Không thể xoá bình luận"
              );
            }
          } catch (err) {
            Alert.alert(
              "Lỗi",
              err.response?.data?.message ||
                err.message ||
                "Có lỗi xảy ra khi xoá bình luận"
            );
          }
        }
      }
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );

  if (!data)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy blog!</Text>
      </View>
    );

  return (
    <>
      <Header />
      <FlatList
        data={comments}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có bình luận nào.</Text>
        }
        ListHeaderComponent={
          <>
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
                <Text style={styles.description}>
                  {stripMarkdown(data.content) || "Không có nội dung"}
                </Text>
              </LinearGradient>
            </Animatable.View>

            {/* Input comment */}
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
        renderItem={({ item }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            style={styles.commentBox}
          >
            <Text style={styles.commentUser}>
              {item.userFullName || "Người dùng"}:
            </Text>
            <Text>{stripMarkdown(item.content)}</Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <TouchableOpacity
                onPress={() => {
                  setEditingComment(item);
                  setNewContent(item.content);
                }}
              >
                <Text style={styles.editText}>✏️ Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteComment(item.commentId)}
                style={{ marginLeft: 15 }}
              >
                <Text style={{ color: "red", fontWeight: "600" }}>🗑️ Xoá</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      />

      {/* Edit Comment Modal */}
      <Modal
        visible={!!editingComment}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingComment(null)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="slideInUp" style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa bình luận</Text>
            <TextInput
              value={newContent}
              onChangeText={setNewContent}
              style={styles.modalInput}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button
                title="Hủy"
                onPress={() => setEditingComment(null)}
                color="#888"
              />
              <View style={{ width: 10 }} />
              <Button
                title="Lưu"
                onPress={async () => {
                  const commentId =
                    editingComment?._id ||
                    editingComment?.id ||
                    editingComment?.commentId;
                  if (!commentId || !newContent.trim())
                    return Alert.alert("Lỗi", "Không thể lưu bình luận.");
                  await editComment(commentId, newContent);
                  setEditingComment(null);
                }}
                color="#2575fc"
              />
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8"
  },
  card: {
    margin: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 8
  },
  gradient: { borderRadius: 20, padding: 20, alignItems: "center" },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#eee"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center"
  },
  description: {
    color: "#E2E6EA",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  input: { flex: 1, minHeight: 45, maxHeight: 100, paddingLeft: 10 },
  sendBtn: {
    padding: 10,
    backgroundColor: "#2575fc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  commentBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3
  },
  commentUser: { fontWeight: "bold", color: "#3E63DD", marginBottom: 4 },
  editText: { color: "#2575fc", fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#888", marginTop: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20
  },
  modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  modalInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 70,
    textAlignVertical: "top"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15
  }
});
