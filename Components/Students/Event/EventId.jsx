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
        const publicRes = await fetchBaseResponse(
          `/api/events/public/${eventId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (publicRes.status !== 200) {
          Alert.alert("Thông báo", "Không tìm thấy sự kiện.");
          setData(null);
          return;
        }

        let roleName = null;
        try {
          const myRes = await fetchBaseResponse(
            `/api/event-roles/my/${eventId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (myRes.status === 200) {
            roleName = myRes.data.roleName;
          }
        } catch (err) {
          // Không làm gì nếu lỗi, roleName sẽ là null
          console.log("Không lấy được role cho sự kiện", err);
        }

        const mergedData = {
          ...publicRes.data,
          roleName
        };
        setData(mergedData);
      } catch (error) {
        Alert.alert("Lỗi", "Không lấy được event theo id");
        console.error("📦 fetch error: ", error);
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
  const formattedDate = new Date(data.eventDate).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <View style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner */}
        <Image
          source={{
            uri:
              data.image ||
              "https://cdn-icons-png.flaticon.com/512/7466/7466140.png"
          }}
          style={styles.banner}
        />

        {/* Event Info */}
        <View style={styles.card}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
          <Text style={styles.date}>📅 {formattedDate}</Text>
        </View>

        {/* Format & Location */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>💻 Hình thức:</Text>
            <Text style={styles.value}>{data.format}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Địa điểm:</Text>
            <Text style={styles.value}>{data.location}</Text>
          </View>
        </View>

        {/* Registration Section */}
        <View style={styles.registerContainer}>
          {data.roleName === "ORGANIZER" ? (
            <View style={styles.organizerCard}>
              <View style={styles.organizerHeader}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }}
                  style={styles.organizerIcon}
                />
                <Text style={styles.organizerText}>
                  🎉 Bạn là người tổ chức sự kiện này
                </Text>
              </View>

              <TouchableOpacity
                style={styles.taskButton}
                onPress={() => {
                  navigation.navigate("Event", {
                    screen: "EventAssign",
                    params: {
                      eventId: data.eventId,
                      title: data.title,
                      userId: data.userId
                    }
                  });
                }}
              >
                <Text style={styles.taskButtonText}>🧩 Phân chia role cho thành viên</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.registerText}>
                Nếu bạn hứng thú với sự kiện này, hãy bấm để đăng kí tham gia 👇
              </Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() =>
                  navigation.navigate("Event", {
                    screen: "EventRegistration",
                    params: {
                      eventId: data.eventId,
                      title: data.title
                    }
                  })
                }
              >
                <Text style={styles.registerButtonText}>Đăng ký sự kiện</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EventId;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  container: {
    padding: 16,
    paddingBottom: 50
  },
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6
  },
  description: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 8
  },
  date: {
    fontSize: 14,
    color: "#2563EB"
  },
  infoCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  label: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600"
  },
  value: {
    fontSize: 15,
    color: "#1E40AF",
    fontWeight: "500"
  },
  registerContainer: {
    marginTop: 10
  },
  registerText: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginBottom: 14
  },
  registerButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center"
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  },
  organizerCard: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 14
  },
  organizerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  organizerIcon: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  organizerText: {
    fontSize: 15,
    color: "#1E3A8A",
    fontWeight: "600"
  },
  taskButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  taskButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15
  }
});
