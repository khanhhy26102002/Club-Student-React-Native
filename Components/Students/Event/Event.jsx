import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput
} from "react-native";
import React from "react";
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
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const endpoint = "/api/events/public";
      const response = await fetchBaseResponse(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const events = Array.isArray(response.data) ? response.data : [];
      setData(events);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const formatDate = dateString => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: `Thg ${date.getMonth() + 1}`
    };
  };

  const filteredData = data.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingRow}>
          <Text style={styles.heading}>🎉 SỰ Kiện Nổi Bật</Text>
          <TouchableOpacity
            style={styles.eventButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Event", { screen: "History" })}
          >
            <View style={styles.eventButtonContent}>
              <Icon name="calendar-check" size={18} color="#1E40AF" />
              <Text style={styles.eventButtonText}>Sự kiện đã đăng ký</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Tìm sự kiện..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/7466/7466140.png" }}
              style={styles.emptyIcon}
            />
            <Text style={styles.noEventText}>Chưa có sự kiện nào</Text>
            <Text style={styles.noEventSubText}>
              Hãy quay lại sau để cập nhật các sự kiện mới nhất nhé!
            </Text>
          </View>
        ) : (
          filteredData.map(event => {
            const { day, month } = formatDate(event.eventDate);
            return (
              <TouchableOpacity
                key={event.eventId}
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
    marginBottom: 16
  },
  heading: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#1D2C4D"
  },
  eventButton: {
    borderWidth: 1,
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999
  },
  eventButtonContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  eventButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF"
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff"
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: "center"
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
    alignItems: "center"
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F"
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: "600",
    color: "#424242"
  },
  cardContent: {
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: "#566573",
    lineHeight: 21,
    marginBottom: 16
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#EAECEE",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
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
  }
});
