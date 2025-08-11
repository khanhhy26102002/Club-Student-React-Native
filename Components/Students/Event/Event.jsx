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
      const events = Array.isArray(response.data) ? response.data : [];
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
      style={styles.cardHorizontal}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("Event", {
          screen: "EventId",
          params: { eventId: item.eventId }
        })
      }
    >
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
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Danh sách sự kiện</Text>
          <TouchableOpacity
            style={styles.registeredBtn}
            onPress={async () => {
              const userId = await AsyncStorage.getItem("userId");
              navigation.navigate("Event", {
                screen: "History",
                params: { userId: userId }
              });
            }}
          >
            <Text style={styles.registeredBtnText}>Đã đăng ký</Text>
          </TouchableOpacity>
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
            keyExtractor={(item, index) =>
              item.eventId?.toString() || index.toString()
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f57c00",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 5,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    width: "30%"
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 4
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 8
  },
  registeredBtn: {
    backgroundColor: "#f57c00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 10
  },
  registeredBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
  container: {
    flex: 1,
    backgroundColor: "#fffaf2",
    marginBottom: -50,
    marginTop: -10
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f57c00",
    margin: 20,
    marginBottom: 8,
    letterSpacing: 0.13,
    marginLeft: -10
  },
  cardHorizontal: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    marginBottom: 16,
    height: 120
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
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333"
  },
  cardDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4
  },
  cardLocation: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2
  }
});
