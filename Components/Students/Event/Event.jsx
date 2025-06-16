import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
const Event = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await fetchBaseResponse(`/events`, {
            method: "GET"
          });
          if (!response || response.length === 0) {
            Alert.alert("Thông báo", "Không có blog nào để hiển thị.");
            setData([]);
          } else {
            setData(response);
          }
        } catch (error) {
          Alert.alert(
            "Lỗi không fetch được data",
            error.message || "Đã xảy ra lỗi"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );
  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>🎉 Sự kiện sắp tới</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
          </View>
        ) : data.length === 0 ? (
          <Text style={styles.noEvent}>Hiện không có sự kiện nào.</Text>
        ) : (
          data.map((event, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("EventId", { id: event.eventId })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{event.title}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color: event.status === "Đã diễn ra" ? "#aaa" : "#28a745"
                    }
                  ]}
                >
                  {event.status === "Đã diễn ra"
                    ? "✅ Đã diễn ra"
                    : "📅 Sắp diễn ra"}
                </Text>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {event.description}
              </Text>

              <View style={styles.infoGroup}>
                <Text style={styles.detail}>
                  🕒{" "}
                  {new Date(event.eventDate).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Text>
                <Text style={styles.detail}>📍 Địa điểm: {event.location}</Text>
                <Text style={styles.detail}>💻 Hình thức: {event.format}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#E6F0FA"
  },
  container: {
    padding: 16,
    paddingBottom: 40
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 20
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center"
  },
  noEvent: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 40
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A73E8",
    flexShrink: 1,
    paddingRight: 10
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10
  },
  infoGroup: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10
  },
  detail: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4
  },
  status: {
    fontSize: 13,
    fontWeight: "600"
  }
});
