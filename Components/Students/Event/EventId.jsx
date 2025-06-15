import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import API from "../../../utils/api";
import Header from "../../../Header/Header";

const EventId = () => {
  const route = useRoute();
  const { id } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/events/${id}`, {
          headers: { "Content-Type": "application/json" }
        });
        if (response.status >= 200 && response.status < 300) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        Alert.alert("Lỗi khi tải sự kiện", error.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy sự kiện nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
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

          <View style={styles.infoRow}>
            <Text style={styles.label}>📌 Trạng thái:</Text>
            <Text
              style={[
                styles.value,
                {
                  color: data.status === "Đã diễn ra" ? "#aaa" : "#28a745",
                  fontWeight: "bold"
                }
              ]}
            >
              {data.status}
            </Text>
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
    backgroundColor: "#E6F0FA"
  },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  headerBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A66C2",
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  label: {
    fontSize: 16,
    color: "#0A66C2",
    fontWeight: "600"
  },
  value: {
    fontSize: 16,
    color: "#111827"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FA"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FA"
  },
  errorText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic"
  }
});
