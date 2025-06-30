import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EventId = () => {
  const route = useRoute();
  const { eventId } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/events/public/${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response) {
          Alert.alert("Thông báo", "Không tìm thấy sự kiện.");
          setData(null);
        } else {
          setData(response.data);
        }
      } catch (error) {
        Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy sự kiện nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner Image (default nếu không có ảnh thật) */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3039/3039434.png" // có thể thay bằng event.image nếu API có
          }}
          style={styles.banner}
        />

        <View style={styles.headerBox}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
          <Text style={styles.date}>
            📅{" "}
            {new Date(data.eventDate).toLocaleString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>💻 Hình thức:</Text>
            <Text style={styles.value}>{data.format}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Địa điểm:</Text>
            <Text style={styles.value}>{data.location}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EventId;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5FAFE"
  },
  container: {
    padding: 16,
    paddingBottom: 40
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 20
  },
  headerBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D47A1",
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10
  },
  date: {
    fontSize: 14,
    color: "#666"
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1565C0"
  },
  value: {
    fontSize: 15,
    color: "#1B1B1B"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FAFE"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FAFE"
  },
  errorText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic"
  }
});
