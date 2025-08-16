import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, FlatList, Image, Alert } from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";

// ⭐️ Component đánh giá sao
const StarsRating = ({ rating }) => (
  <View style={{ flexDirection: "row", marginVertical: 2 }}>
    {Array.from({ length: 5 }).map((_, idx) => (
      <Text key={idx} style={styles.star}>
        {idx < rating ? "★" : "☆"}
      </Text>
    ))}
  </View>
);

const FeedbackCard = ({ item }) => (
  <View style={styles.card}>
    {/* Avatar + Tên người dùng */}
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.userFullName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.userName}>{item.userFullName}</Text>
        <Text style={styles.eventTitle}>{item.eventTitle}</Text>
      </View>
      <StarsRating rating={item.rating} />
    </View>
    {/* Bình luận */}
    <Text style={styles.comment}>“{item.comments}”</Text>
  </View>
);

const EventFeedback = () => {
  const { eventId } = useRoute().params;
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/api/feedback/event/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Lỗi", "Không lấy được data theo eventId");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.header}>Phản hồi sự kiện ✨</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.feedbackId.toString()}
          renderItem={({ item }) => <FeedbackCard item={item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#555", marginTop: 40 }}>
              Chưa có phản hồi nào
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7c3aed",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  avatar: {
    width: 42,
    height: 42,
    backgroundColor: "#c7d2fe",
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontWeight: "bold",
    color: "#7c3aed",
    fontSize: 20
  },
  userName: {
    fontWeight: "bold",
    color: "#18181b",
    fontSize: 16
  },
  eventTitle: {
    color: "#6366f1",
    fontSize: 13,
    marginTop: 4,
    fontStyle: "italic"
  },
  comment: {
    marginTop: 6,
    color: "#444",
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 22,
    backgroundColor: "#eef2ff",
    padding: 9,
    borderRadius: 8
  },
  star: {
    fontSize: 18,
    color: "#facc15",
    marginRight: 2
  }
});

export default EventFeedback;
