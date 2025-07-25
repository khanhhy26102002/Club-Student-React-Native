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
  const [userId, setUserId] = React.useState(null);
  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    const storedUserId = await AsyncStorage.getItem("userId");
    setUserId(storedUserId);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: `Thg ${date.getMonth() + 1}`
    };
  };

  const filteredData = data.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.headingRow}>
          <Text style={styles.heading}>🎉 Sự kiện nổi bật</Text>
          <TouchableOpacity
            style={styles.eventButton}
            activeOpacity={0.9}
            onPress={async () => {
              const storedUserId = await AsyncStorage.getItem("userId");
              if (!storedUserId) {
                Alert.alert("Lỗi", "Không tìm thấy userId.");
                return;
              }
              navigation.navigate("Event", {
                screen: "EventRegisterUser",
                params: {
                  userId: storedUserId
                }
              });
            }}
          >
            <View style={styles.eventButtonContent}>
              <Icon name="calendar-check" size={18} color="#fff" />
              <Text style={styles.eventButtonText}>Đã đăng ký</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          placeholder="🔍 Tìm kiếm sự kiện..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        {/* Loading or Empty */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={{ uri: DEFAULT_EVENT_IMAGE }}
              style={styles.emptyIcon}
            />
            <Text style={styles.noEventText}>Không tìm thấy sự kiện</Text>
            <Text style={styles.noEventSubText}>
              Hãy quay lại sau để cập nhật các sự kiện mới nhất!
            </Text>
          </View>
        ) : (
          filteredData.map((event) => {
            const { day, month } = formatDate(event.eventDate);
            return (
              <TouchableOpacity
                key={event.eventId}
                style={styles.card}
                activeOpacity={0.9}
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
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateDay}>{day}</Text>
                    <Text style={styles.dateMonth}>{month}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={3}>
                    {event.description}
                  </Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardDetail}>📍 {event.location}</Text>
                    <Text style={styles.cardDetail}>💻 {event.format}</Text>
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
    backgroundColor: "#F0F4FA"
  },
  container: {
    padding: 16,
    paddingBottom: -30
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1D4ED8"
  },
  eventButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  eventButtonContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  eventButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1"
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center"
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60
  },
  emptyIcon: {
    width: 120,
    height: 120,
    marginBottom: 16
  },
  noEventText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280"
  },
  noEventSubText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  imageContainer: {
    position: "relative"
  },
  cardImage: {
    width: "100%",
    height: 180
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  dateDay: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  dateMonth: {
    color: "#fff",
    fontSize: 12
  },
  cardContent: {
    padding: 14
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6
  },
  cardDesc: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardDetail: {
    fontSize: 13,
    color: "#374151"
  }
});
