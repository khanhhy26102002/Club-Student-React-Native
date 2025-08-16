import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// ⭐ Component hiển thị rating
const StarRating = ({ rating, onChange }) => (
  <View style={{ flexDirection: "row" }}>
    {Array.from({ length: 5 }).map((_, idx) => (
      <TouchableOpacity key={idx} onPress={() => onChange && onChange(idx + 1)}>
        <Text style={styles.star}>{idx < rating ? "★" : "☆"}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const EventAllFeedback = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/api/feedback/my-feedbacks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Lỗi", "Không lấy được dữ liệu phản hồi");
      }
    };
    fetchData();
  }, []);

  const openFeedbackModal = (item) => {
    setSelectedFeedback(item);
    setRating(item.rating);
    setComments(item.comments);
    setModalVisible(true);
  };

  const updateFeedback = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(
        `/api/feedback/${selectedFeedback.feedbackId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { rating, comments }
        }
      );
      if (response.status === 200) {
        Alert.alert("Thành công", "Cập nhật feedback thành công");
        setData((prev) =>
          prev.map((item) =>
            item.feedbackId === selectedFeedback.feedbackId
              ? { ...item, rating, comments }
              : item
          )
        );
        setModalVisible(false);
      } else {
        throw new Error(`HTTP Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      Alert.alert("Lỗi", "Cập nhật feedback thất bại");
    }
  };

  const deleteFeedback = async (item) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa feedback này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("jwt");
          try {
            const response = await fetchBaseResponse(
              `/api/feedback/${item.feedbackId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );
            if (response.status === 200) {
              Alert.alert("Đã xóa", "Feedback đã được xóa");
              setData((prev) =>
                prev.filter((f) => f.feedbackId !== item.feedbackId)
              );
            } else {
              throw new Error(`HTTP Status: ${response.status}`);
            }
          } catch (error) {
            console.error("Error deleting feedback:", error);
            Alert.alert("Lỗi", "Xóa feedback thất bại");
          }
        }
      }
    ]);
  };

  const FeedbackCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userFullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{item.userFullName}</Text>
        <StarRating rating={item.rating} />
        <MaterialIcons
          name="edit"
          size={20}
          color="#0ea5e9"
          onPress={() => openFeedbackModal(item)}
        />
        <MaterialIcons
          name="delete"
          size={20}
          color="#ef4444"
          onPress={() => deleteFeedback(item)}
          style={{ marginLeft: 6 }}
        />
      </View>
      <View>
        <Text style={styles.eventTitle}>{item.eventTitle}</Text>
        <Text style={styles.comment}>“{item.comments}”</Text>
      </View>
    </View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.heading}>Phản hồi của tôi 💬</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.feedbackId.toString()}
          renderItem={({ item }) => <FeedbackCard item={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Bạn chưa có feedback nào</Text>
          }
          contentContainerStyle={{ paddingBottom: 70 }}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {loadingDetail ? (
              <ActivityIndicator size="large" color="#0ea5e9" />
            ) : selectedFeedback ? (
              <>
                <Text style={styles.modalTitle}>
                  {selectedFeedback.userFullName}
                </Text>
                <StarRating rating={rating} onChange={setRating} />
                <Text style={styles.modalEventTitle}>
                  {selectedFeedback.eventTitle}
                </Text>
                <TextInput
                  style={styles.input}
                  value={comments}
                  onChangeText={setComments}
                  multiline
                />
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <Pressable style={styles.saveButton} onPress={updateFeedback}>
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.saveButton,
                      { backgroundColor: "#f87171", marginLeft: 10 }
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.saveButtonText}>Hủy</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9", padding: 14 },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0ea5e9",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#00b4d8",
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 3
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8
  },
  avatar: {
    backgroundColor: "#a5b4fc",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  userName: { fontWeight: "bold", color: "#374151", fontSize: 16, flex: 1 },
  eventTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 6,
    fontStyle: "italic"
  },
  comment: {
    color: "#3b3a39",
    fontSize: 15,
    backgroundColor: "#fae8ff",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    lineHeight: 20
  },
  star: { color: "#facc15", fontSize: 18, marginRight: 1 },
  emptyText: { color: "#64748b", textAlign: "center", marginTop: 80 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#374151"
  },
  modalEventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
    marginVertical: 8
  },
  input: {
    width: "100%",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f1f5f9",
    textAlignVertical: "top",
    minHeight: 80
  },
  saveButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});

export default EventAllFeedback;
