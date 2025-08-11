import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Animated,
  Platform
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";

const EventIdClub = ({ route }) => {
  const { eventId } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const springAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(
          `/api/events/${eventId}/detail`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status === 200) setData(response.data);
        else
          setError(`Không tìm thấy sự kiện | HTTP Status: ${response.status}`);
      } catch (e) {
        setError("Đã xảy ra lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    Animated.spring(springAnim, {
      toValue: 1,
      bounciness: 12,
      speed: 3,
      useNativeDriver: true
    }).start();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FF631A" size="large" />
        <Text style={{ marginTop: 10 }}>Đang tải sự kiện...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF631A" />
        <Text
          style={{
            marginTop: 14,
            color: "#FF631A",
            fontSize: 17,
            fontWeight: "bold"
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  if (!data) return null;

  // Ionicons mapping
  const statusMap = {
    COMPLETED: {
      label: "Đã diễn ra",
      color: "#bdbdbd",
      background: "#eeeeee",
      icon: "checkmark-done-outline"
    },
    UPCOMING: {
      label: "Sắp diễn ra",
      color: "#FFB300",
      background: "#FFF8E1",
      icon: "alarm-outline"
    },
    ONGOING: {
      label: "Đang diễn ra",
      color: "#00E676",
      background: "#E0F2F1",
      icon: "radio-button-on-outline"
    }
  };
  const statusInfo = statusMap[data.status] || {
    label: data.status,
    color: "#888",
    background: "#F6F6F6",
    icon: "information-circle-outline"
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        {/* Header Gradient với Animation */}
        <Animated.View
          style={[
            styles.headerWrap,
            {
              transform: [
                { scale: springAnim },
                {
                  translateY: springAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-40, 0]
                  })
                }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={["#FF994F", "#FF5F6D"]}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons
              name="calendar-outline"
              size={34}
              color="#fff"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.title}>{data.title}</Text>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: statusInfo.background }
              ]}
            >
              <Ionicons
                name={statusInfo.icon}
                size={16}
                color={statusInfo.color}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Info Card Section */}
        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: springAnim,
              transform: [
                {
                  translateY: springAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={22}
              color="#FF7C54"
              style={styles.infoIcon}
            />
            <Text style={styles.infoKey}>Thời gian:</Text>
            <Text style={styles.infoValue}>
              {moment(data.eventDate).format("HH:mm, DD/MM/YYYY")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={22}
              color="#FF7C54"
              style={styles.infoIcon}
            />
            <Text style={styles.infoKey}>Địa điểm:</Text>
            <Text style={styles.infoValue}>{data.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name={
                data.format === "OFFLINE" ? "people-outline" : "globe-outline"
              }
              size={22}
              color="#FF7C54"
              style={styles.infoIcon}
            />
            <Text style={styles.infoKey}>Hình thức:</Text>
            <Text style={styles.infoValue}>
              {data.format === "OFFLINE" ? "Trực tiếp" : "Trực tuyến"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name={
                data.visibility === "PUBLIC" ? "eye-outline" : "eye-off-outline"
              }
              size={22}
              color="#FF7C54"
              style={styles.infoIcon}
            />
            <Text style={styles.infoKey}>Công khai:</Text>
            <Text style={styles.infoValue}>
              {data.visibility === "PUBLIC" ? "Có" : "Không"}
            </Text>
          </View>
        </Animated.View>

        {/* Mô tả Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🌟 Mô tả sự kiện</Text>
          <Text style={styles.desc}>{stripMarkdown(data.description)}</Text>
        </View>
        <View style={{ height: 35 }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerWrap: {
    marginTop: Platform.OS === "ios" ? 12 : 8,
    marginBottom: -25,
    paddingHorizontal: 0,
    zIndex: 2
  },
  headerGradient: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FF994F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.33,
    shadowRadius: 18,
    marginTop: -8
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    shadowColor: "#e37149",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 8
  },
  statusTag: {
    paddingVertical: 2,
    paddingHorizontal: 11,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  statusText: { fontSize: 14, fontWeight: "bold" },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: "#ffdae9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 10
  },
  infoIcon: { marginRight: 8 },
  infoKey: { color: "#FF7C54", fontWeight: "600", fontSize: 14, width: 78 },
  infoValue: { fontSize: 15, color: "#2d2d2d", flex: 1, fontWeight: "500" },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 28,
    elevation: 2,
    shadowColor: "#eee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5F6D",
    marginBottom: 10
  },
  desc: { fontSize: 14.5, color: "#444", lineHeight: 21, letterSpacing: 0.15 }
});

export default EventIdClub;
