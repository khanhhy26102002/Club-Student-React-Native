import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";

export default function Event({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse("/api/events/public", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      let events = Array.isArray(response.data) ? response.data : [];

      // Gom các sự kiện trùng dựa trên eventId
      const uniqueEventsMap = {};
      events.forEach((e) => {
        const key = e.eventId || `${e.title}-${e.eventDate}`;
        if (!uniqueEventsMap[key]) {
          uniqueEventsMap[key] = e;
        }
      });
      events = Object.values(uniqueEventsMap);

      setData(events);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCoverImg = (format) => {
    if (format === "ONLINE")
      return { uri: "https://img.icons8.com/color/96/000000/laptop.png" };
    if (format === "OFFLINE")
      return { uri: "https://img.icons8.com/color/96/000000/conference.png" };
    return {
      uri: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-calendar-back-to-school-flatart-icons-outline-flatarticons.png"
    };
  };

  const formatDay = (str) => {
    if (!str) return "";
    const d = new Date(str);
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${d.getDate().toString().padStart(2, "0")}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Event", {
          screen: "EventId",
          params: {
            eventId: item.eventId
          }
        })
      }
    >
      <View style={styles.cardHorizontal}>
        <Image
          source={getCoverImg(item.format)}
          style={styles.cardImageHorizontal}
          resizeMode="cover"
        />
        <View style={styles.cardContentHorizontal}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {item.title}
          </Text>
          <Text style={styles.cardDate}>{formatDay(item.eventDate)}</Text>
          {item.location && (
            <Text style={styles.cardLocation}>{item.location}</Text>
          )}

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("Event", {
                screen: "EventFeedback",
                params: { eventId: item.eventId }
              })
            }
          >
            <Text style={styles.primaryBtnText}>Xem đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.primaryBtn, styles.backButton]}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.primaryBtnText}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Danh sách sự kiện</Text>
          <View style={{ flexDirection: "row", marginLeft: -10 }}>
            <TouchableOpacity
              style={[styles.primaryBtn, { marginRight: 8 }]}
              onPress={() =>
                navigation.navigate("Event", { screen: "EventAllFeedback" })
              }
            >
              <Text style={styles.primaryBtnText}>Sự kiện đã đánh giá</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={async () => {
                const userId = await AsyncStorage.getItem("userId");
                navigation.navigate("Event", {
                  screen: "History",
                  params: { userId }
                });
              }}
            >
              <Text style={styles.primaryBtnText}>Đã đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#f57c00"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) =>
              item.eventId?.toString() || Math.random().toString()
            }
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 42 }}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchData}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 50 }}
              >
                Không có sự kiện nào.
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf2",
    marginBottom: -50,
    marginTop: -10
  },
  headerRow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: -50,
    marginLeft: 80
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f57c00",
    margin: 20,
    marginBottom: 8,
    letterSpacing: 0.13,
    marginLeft: 16
  },
  cardHorizontal: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    marginBottom: 16,
    height: 140
  },
  cardImageHorizontal: {
    width: 200,
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  cardContentHorizontal: {
    flex: 1,
    padding: 12,
    justifyContent: "center"
  },
  cardTitle: { fontWeight: "600", fontSize: 16, color: "#333" },
  cardDate: { fontSize: 12, color: "#666", marginTop: 4 },
  cardLocation: { fontSize: 12, color: "#aaa", marginTop: 2 },

  primaryBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#f57c00",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center"
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    marginLeft: 4
  },
  backButton: {
    width: "30%",
    marginLeft: 5,
    marginTop: 10,
    justifyContent: "center"
  }
});
