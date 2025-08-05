import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { stripMarkdown } from "../../../stripmarkdown";

const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

const Event = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userId, setUserId] = React.useState(null);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    const storedUserId = await AsyncStorage.getItem("userId");
    setUserId(storedUserId);
    try {
      const response = await fetchBaseResponse("/api/events/public", {
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

  const renderItem = ({ item }) => {
    const { day, month } = formatDate(item.eventDate);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("EventId", {
            eventId: item.eventId
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl || DEFAULT_EVENT_IMAGE }}
            style={styles.cardImage}
          />
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{day}</Text>
            <Text style={styles.dateMonth}>{month}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={3}>
            {stripMarkdown(item.description)}
          </Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardDetail}>📍 {item.location}</Text>
            <Text style={styles.cardDetail}>💻 {item.format}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Header />
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.eventId.toString()}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headingRow}>
              <Text style={styles.heading}>🎉 Sự kiện nổi bật</Text>
              <TouchableOpacity
                style={styles.eventButton}
                activeOpacity={0.9}
                onPress={async () => {
                  const storedUserId = await AsyncStorage.getItem("userId");
                  if (!storedUserId) {
                    Alert.alert("Lỗi", "Không tìm thấy người dùng");
                    return;
                  }
                  navigation.navigate("History", {
                    userId: storedUserId
                  });
                }}
              >
                <View style={styles.eventButtonContent}>
                  <Icon name="calendar-check" size={18} color="#fff" />
                  <Text style={styles.eventButtonText}>Đã đăng ký</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
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
          )
        }
        renderItem={renderItem}
      />
    </View>
  );
};

export default Event;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F0F4FA"
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 40
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 10
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    width: "48%",
    marginBottom: -40
  },
  imageContainer: {
    position: "relative"
  },
  cardImage: {
    width: "100%",
    height: 120
  },
  dateBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
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
    padding: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 8
  },
  cardInfo: {
    flexDirection: "column",
    gap: 2
  },
  cardDetail: {
    fontSize: 12,
    color: "#374151"
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
  }
});
