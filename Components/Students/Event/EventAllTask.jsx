import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";
import { API_URL } from "@env";
import axios from "axios";

const EventAllTask = ({ navigation }) => {
  const route = useRoute();
  const { eventId, taskId } = route.params || {};
  console.log("TaskId", taskId);
  const [data, setData] = useState([]);
  const [eventRole, setEventRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // comment state theo taskId
  const [commentsMap, setCommentsMap] = useState({});
  const [contentMap, setContentMap] = useState({});
  const [filesMap, setFilesMap] = useState({});
  const [postingMap, setPostingMap] = useState({});
  const flatListRef = React.useRef(null);
  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse(`/api/tasks/${taskId}/status`, {
        method: "PUT", // axios dùng chữ thường
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(newStatus) // 👈 chỉ gửi raw string thôi
      });

      if (res.status === 200) {
        Alert.alert("✅ Thành công", res.message || "Đã cập nhật trạng thái");
        setData((prev) =>
          prev.map((task) =>
            task.taskId === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        Alert.alert("❌ Lỗi", res.message || "Không thể cập nhật");
      }
    } catch (error) {
      console.error("❌ updateStatus error:", error);
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi");
    }
  };

  const renderStatus = (status) => {
    let label = "Không xác định";
    switch (status) {
      case "TODO":
        label = "Chưa làm";
        break;
      case "IN_PROGRESS":
        label = "Đang làm";
        break;
      case "COMPLETED":
        label = "Hoàn thành";
        break;
      case "CANCELLED":
        label = "Đã hủy";
        break;
      default:
        label = status;
    }
    return <Text style={{ fontWeight: "bold" }}>📌 Trạng thái: {label}</Text>;
  };

  // Nạp task và role khi focus screen
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("jwt");
          const taskRes = await fetchBaseResponse(
            `/api/tasks/mytask?eventId=${eventId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          const roleRes = await fetchBaseResponse(
            `/api/event-roles/my/${eventId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setData(Array.isArray(taskRes.data) ? taskRes.data : [taskRes.data]);
          if (roleRes.status === 200) setEventRole(roleRes.data);

          // nạp comment cho tất cả task
          (Array.isArray(taskRes.data) ? taskRes.data : [taskRes.data]).forEach(
            (t) => loadComments(t.taskId)
          );
        } catch (error) {
          Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [eventId])
  );

  const loadComments = async (taskId) => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse(`/api/tasks/${taskId}/comments`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        setCommentsMap((prev) => ({ ...prev, [taskId]: res.data || [] }));
      }
    } catch (error) {
      console.error("❌ loadComments error:", error);
    }
  };

  const handlePickFiles = async (taskId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (result.type === "success") {
        setFilesMap((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), result]
        }));
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn file");
    }
  };

  const handleSubmitComment = async (taskId) => {
    const content = contentMap[taskId] || "";
    const selectedFiles = filesMap[taskId] || [];

    if (!content && selectedFiles.length === 0) {
      return Alert.alert("Lỗi", "Nhập nội dung hoặc chọn file");
    }

    setPostingMap((prev) => ({ ...prev, [taskId]: true }));
    try {
      const token = await AsyncStorage.getItem("jwt");
      const formData = new FormData();

      formData.append("taskId", taskId);
      formData.append("content", content);

      selectedFiles.forEach((file) => {
        formData.append("files", {
          uri: file.uri,
          type: file.mimeType || file.type || "application/octet-stream",
          name: file.name
        });
      });

      const res = await axios.post(`${API_URL}/api/tasks/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.status === 200) {
        const newComment = res.data.data;
        setCommentsMap((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), newComment]
        }));
        setContentMap((prev) => ({ ...prev, [taskId]: "" }));
        setFilesMap((prev) => ({ ...prev, [taskId]: [] }));
      } else {
        Alert.alert("Lỗi", res.data.message || "Không thể gửi bình luận");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      Alert.alert("Lỗi", error.response?.data?.message || error.message);
    } finally {
      setPostingMap((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const renderItem = ({ item }) => {
    const isHighlight = item.taskId === taskId;
    const comments = commentsMap[item.taskId] || [];
    const content = contentMap[item.taskId] || "";
    const files = filesMap[item.taskId] || [];
    const posting = postingMap[item.taskId] || false;

    return (
      <View
        style={[
          styles.taskCard,
          isHighlight && { borderColor: "#FF5722", borderWidth: 2 }
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.taskTitle}>{item.eventTitle}</Text>

          {eventRole?.roleName === "CHECKIN" && (
            <TouchableOpacity
              style={styles.checkinButton}
              onPress={() => navigation.navigate("Login", { eventId })}
            >
              <Text style={styles.checkinButtonText}>Checkin</Text>
            </TouchableOpacity>
          )}
        </View>

        {renderStatus(item.status)}
        <View style={{ flexDirection: "row", marginTop: 8, flexWrap: "wrap" }}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: "#ff7043" } // TODO - cam nhạt
            ]}
            onPress={() => handleUpdateStatus(item.taskId, "TODO")}
          >
            <Text style={styles.statusButtonText}>Chưa làm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: "#42a5f5" } // IN_PROGRESS - xanh biển nhạt
            ]}
            onPress={() => handleUpdateStatus(item.taskId, "IN_PROGRESS")}
          >
            <Text style={styles.statusButtonText}>Đang làm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: "#66bb6a" } // COMPLETED - xanh lá nhạt
            ]}
            onPress={() => handleUpdateStatus(item.taskId, "COMPLETED")}
          >
            <Text style={styles.statusButtonText}>Hoàn thành</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: "#ef5350" } // CANCELLED - đỏ nhạt
            ]}
            onPress={() => handleUpdateStatus(item.taskId, "CANCELLED")}
          >
            <Text style={styles.statusButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.taskDesc}>{stripMarkdown(item.description)}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{item.userName}</Text>
          <Text style={styles.infoText}>
            {new Date(item.createdAt).toLocaleString("vi-VN")}
          </Text>
          <Text style={styles.dueDate}>
            {new Date(item.dueDate).toLocaleString("vi-VN")}
          </Text>
        </View>

        {/* comment list */}
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            💬 Bình luận:
          </Text>
          {comments.map((cmt, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: "#f0f0f0",
                padding: 6,
                borderRadius: 6,
                marginTop: 4
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{cmt.userName}</Text>
              <Text>{cmt.content}</Text>
            </View>
          ))}
        </View>

        {/* form nhập bình luận */}
        <View style={{ marginTop: 10 }}>
          <TextInput
            placeholder="Nhập nội dung..."
            value={content}
            onChangeText={(txt) =>
              setContentMap((prev) => ({ ...prev, [item.taskId]: txt }))
            }
            style={styles.commentInput}
            multiline
          />
          <Button
            title="Chọn file"
            onPress={() => handlePickFiles(item.taskId)}
          />
          {files.map((file, index) => (
            <Text key={index} style={{ marginTop: 4 }}>
              📎 {file.name}
            </Text>
          ))}
          <View style={{ marginTop: 8 }}>
            <Button
              title={posting ? "Đang gửi..." : "Gửi"}
              onPress={() => handleSubmitComment(item.taskId)}
              disabled={posting}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Quay về</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fe8a3c" />
            <Text style={{ marginTop: 8 }}>Đang tải...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item.taskId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}
        {eventRole?.roleName === "CHECKIN" && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => navigation.navigate("Login", { eventId })}
          >
            <Text style={styles.checkinButtonText}>Checkin</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, marginBottom: -10 },
  container: { flex: 1, paddingHorizontal: 16, marginBottom: -100 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  taskCard: {
    backgroundColor: "#FFE0B2",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14
  },
  taskTitle: { fontSize: 16, fontWeight: "bold", color: "#E65100" },
  taskDesc: { fontSize: 14, color: "black", marginBottom: 10 },
  infoBox: { backgroundColor: "#FFE0B2", padding: 10, borderRadius: 8 },
  infoText: { fontSize: 13, color: "black", marginBottom: 4 },
  dueDate: { fontSize: 13, fontStyle: "italic", color: "#D84315" },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: "top"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  checkinButton: {
    backgroundColor: "#FB8C00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  checkinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14
  },
  backButton: { paddingHorizontal: 16, paddingVertical: 10, marginBottom: 10 },
  backButtonText: { color: "#FB8C00", fontWeight: "bold", fontSize: 16 },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  }
});

export default EventAllTask;
