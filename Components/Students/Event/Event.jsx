import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import React from "react";
// event controller get Id số 5 bị lỗi trừ số 3 thì get Id được còn lại lỗi events public
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
const Event = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState("ALL");
  const [status, setStatus] = React.useState("");
  const statusLabels = {
    DRAFT: "Nháp",
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    STARTED: "Đang diễn ra",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy"
  };
  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const statusParam = status ? `&status=${status}` : "";
      const endpoint =
        filter === "INTERNAL"
          ? `/events/by-visibility-status?visibility=INTERNAL${statusParam}`
          : filter === "PUBLIC"
          ? `/events/by-visibility-status?visibility=PUBLIC${statusParam}`
          : `/events/public${status ? `?status=${status}` : ""}`;

      console.log("Fetching:", endpoint);

      const response = await fetchBaseResponse(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("📌 filter:", filter);
      console.log("✅ RESPONSE RAW:", response);

      // 🔐 Luôn đảm bảo response.data là array
      const events = Array.isArray(response.data) ? response.data : [];
      setData(events);
    } catch (error) {
      console.error("❌ FETCH ERROR:", error);
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      setData([]); // fallback nếu gặp lỗi
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [filter])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: `Thg ${date.getMonth() + 1}`
    };
  };

  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingRow}>
          <Text style={styles.heading}>🎉 Sự Kiện Nổi Bật</Text>
          <TouchableOpacity
            style={styles.eventButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("Event", {
                screen: "History"
              })
            }
          >
            <View style={styles.eventButtonContent}>
              <Icon name="calendar-check" size={18} color="#1E40AF" />
              <Text style={styles.eventButtonText}>Sự kiện đã đăng kí</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["ALL", "PUBLIC", "INTERNAL"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  filter === type && { backgroundColor: "#93C5FD" }
                ]}
                onPress={() => setFilter(type)}
              >
                <Text style={styles.filterText}>
                  {type === "ALL"
                    ? "Tất cả"
                    : type === "PUBLIC"
                    ? "Công Khai"
                    : "Nội Bộ"}
                </Text>
              </TouchableOpacity>
            ))}
            {[
              "DRAFT",
              "PENDING",
              "APPROVED",
              "REJECTED",
              "STARTED",
              "COMPLETED",
              "CANCELLED"
            ].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.filterChip,
                  status === s && { backgroundColor: "#93C5FD" }
                ]}
                onPress={() => {
                  setStatus(s);
                  fetchData(filter, s);
                }}
              >
                <Text style={styles.filterText}>{statusLabels[s]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/7466/7466140.png"
              }}
              style={styles.emptyIcon}
            />
            <Text style={styles.noEventText}>Chưa có sự kiện nào</Text>
            <Text style={styles.noEventSubText}>
              Hãy quay lại sau để cập nhật các sự kiện mới nhất nhé!
            </Text>
          </View>
        ) : (
          data.map((event) => {
            const { day, month } = formatDate(event.eventDate);
            return (
              <TouchableOpacity
                key={event.eventId} // Sử dụng eventId làm key sẽ tốt hơn index
                style={styles.card}
                onPress={() =>
                  navigation.navigate("EventId", {
                    eventId: event.eventId
                  })
                }
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: event.imageUrl || DEFAULT_EVENT_IMAGE }}
                    style={styles.cardImage}
                  />
                  <View style={styles.dateOverlay}>
                    <Text style={styles.dateDay}>{day}</Text>
                    <Text style={styles.dateMonth}>{month}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.title} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={styles.description} numberOfLines={3}>
                    {event.description}
                  </Text>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>📍</Text>
                      <Text style={styles.detailText}>{event.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>💻</Text>
                      <Text style={styles.detailText}>{event.format}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F4F6F8"
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: -10
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  heading: {
    fontSize: 23,
    fontWeight: "condensedBold",
    color: "#1D2C4D",
    marginTop: -10
  },
  eventButton: {
    alignSelf: "flex-end",
    marginRight: -10,
    marginTop: -6,
    borderWidth: 1,
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  eventButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  eventButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
    marginTop: -1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    opacity: 0.7
  },
  noEventText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8
  },
  noEventSubText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center"
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#99AAB5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  imageContainer: {
    position: "relative"
  },
  cardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  dateOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F" // Màu đỏ để nổi bật ngày
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: "600",
    color: "#424242",
    marginTop: -2
  },
  cardContent: {
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50", // Màu chữ chính
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: "#566573", // Màu mô tả, nhẹ hơn màu tiêu đề
    lineHeight: 21, // Giãn dòng cho dễ đọc
    marginBottom: 16
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#EAECEE",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-around" // Căn đều các mục
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1 // Chia đều không gian
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8
  },
  detailText: {
    fontSize: 13,
    color: "#616A6B",
    fontWeight: "500",
    flexShrink: 1
  },
  filterBar: {
    flexDirection: "row",
    marginBottom: 20,
    paddingLeft: 2
  },
  filterChip: {
    backgroundColor: "#E0ECFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#B0C4DE"
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E40AF"
  }
});
