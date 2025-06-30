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

const Event = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const token = await AsyncStorage.getItem("jwt");
        try {
          const response = await fetchBaseResponse(`/events/public`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (!response || response.length === 0) {
            Alert.alert("Thông báo", "Không có sự kiện nào để hiển thị.");
            setData([]);
          } else {
            setData(response.data);
          }
        } catch (error) {
          Alert.alert(
            "Lỗi",
            error.message || "Đã xảy ra lỗi khi tải dữ liệu."
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
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : data.length === 0 ? (
          <Text style={styles.noEvent}>Hiện không có sự kiện nào.</Text>
        ) : (
          data.map((event, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("EventId", { eventId: event.eventId })
              }
            >
              <View style={styles.cardContent}>
                {/* Avatar image (optional): có thể thay bằng ảnh của event */}
                <Image
                  source={{
                    uri:
                      "https://cdn-icons-png.flaticon.com/512/3039/3039434.png"
                  }}
                  style={styles.image}
                />
                <View style={styles.textSection}>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {event.description}
                  </Text>

                  <View style={styles.infoGroup}>
                    <Text style={styles.detail}>
                      🕒{" "}
                      {new Date(event.eventDate).toLocaleString("vi-VN", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </Text>
                    <Text style={styles.detail}>📍 {event.location}</Text>
                    <Text style={styles.detail}>💻 {event.format}</Text>
                  </View>
                </View>
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
    backgroundColor: "#F9FBFD"
  },
  container: {
    padding: 16,
    paddingBottom: 40
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A237E",
    textAlign: "center",
    marginBottom: 24
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3
  },
  cardContent: {
    flexDirection: "row"
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: "#f0f0f0"
  },
  textSection: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1565C0",
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6
  },
  infoGroup: {
    marginTop: 6
  },
  detail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2
  }
});
