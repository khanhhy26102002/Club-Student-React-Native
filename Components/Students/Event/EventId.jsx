import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EventId = ({ navigation }) => {
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
        Alert.alert("Lỗi", "Không lấy được event theo id");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
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
        <Image
          source={{
            uri:
              data.image ||
              "https://cdn-icons-png.flaticon.com/512/7466/7466140.png"
          }}
          style={styles.banner}
        />

        <View style={styles.card}>
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

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>💻 Hình thức:</Text>
            <Text style={styles.value}>{data.format}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Địa điểm:</Text>
            <Text style={styles.value}>{data.location}</Text>
          </View>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Nếu bạn hứng thú với sự kiện này thì bấm đăng kí nhé
          </Text>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() =>
              navigation.navigate("Event", {
                screen: "EventRegistration"
              })
            }
          >
            <Text style={styles.registerButtonText}>Đăng kí sự kiện</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EventId;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F3F6FD"
  },
  registerContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center"
  },
  registerText: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 10,
    textAlign: "center",
    marginTop: -30
  },
  registerButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: -10
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "#e0e0e0"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4
  },
  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#0D47A1",
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 12
  },
  date: {
    fontSize: 15,
    color: "#757575"
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1976D2"
  },
  value: {
    fontSize: 15,
    color: "#1B1B1B"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FD"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FD"
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic"
  }
});
