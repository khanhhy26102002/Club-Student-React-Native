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
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
const Event = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true); // Bắt đầu loading mỗi khi focus
        const token = await AsyncStorage.getItem("jwt");
        try {
          const response = await fetchBaseResponse(`/events/public`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          // Giả sử API trả về trong response.data
          const events = response.data || response;
          if (!events || events.length === 0) {
            setData([]);
          } else {
            setData(events);
          }
        } catch (error) {
          Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
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
        <Text style={styles.heading}>🎉 Sự Kiện Nổi Bật</Text>

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
                  navigation.navigate("EventId", { eventId: event.eventId })
                }
              >
                <View style={styles.imageContainer}>
                  <Image
                    // Ưu tiên ảnh từ API, nếu không có thì dùng ảnh mặc định
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
    backgroundColor: "#F4F6F8" // Một màu nền nhẹ nhàng, sạch sẽ
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: -10
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1D2C4D", // Màu xanh đậm, sang trọng
    textAlign: "center",
    marginBottom: 24
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
    // Shadow tinh tế hơn cho iOS và Android
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
    flexShrink: 1 // Cho phép text co lại nếu quá dài
  }
});
