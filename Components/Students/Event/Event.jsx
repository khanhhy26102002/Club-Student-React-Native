import React, { useEffect, useState } from "react";
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

  // Hàm format ngày/tháng
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

  // Biểu tượng hoặc hình ảnh theo sự kiện
  const getCoverImg = (format) => {
    if (format === "ONLINE")
      return { uri: "https://img.icons8.com/color/96/000000/laptop.png" };
    if (format === "OFFLINE")
      return { uri: "https://img.icons8.com/color/96/000000/conference.png" };
    return { uri: "https://i.imgur.com/jT7yA9C.png" };
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 2
      }}
      activeOpacity={0.85}
      onPress={() => handleEventPress(item.eventId)}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={{ width: "100%", height: 100 }}
        resizeMode="cover"
      />
      <View style={{ padding: 8 }}>
        <Text numberOfLines={2} style={{ fontWeight: "600", fontSize: 14 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
          {item.date}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Danh sách sự kiện</Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#23d4ae"
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
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16
            }}
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

// ----------- STYLE -----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#10998c",
    margin: 20,
    marginBottom: 8,
    letterSpacing: 0.13
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 24,
    shadowColor: "#56dacd",
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center"
  },
  img: {
    width: 72,
    height: 72,
    borderRadius: 14,
    margin: 12,
    backgroundColor: "#e1eeec"
  },
  cardBody: { flex: 1, paddingRight: 10 },
  eventTitle: {
    fontSize: 16.4,
    fontWeight: "bold",
    color: "#10998c",
    marginBottom: 1,
    flexWrap: "wrap"
  },
  tagRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  typeTag: {
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 2.5,
    marginRight: 7
  },
  typeTagText: { fontWeight: "bold", fontSize: 13 },
  eventDesc: {
    color: "#44786a",
    fontSize: 13.5,
    marginBottom: 3,
    fontWeight: "400"
  },
  eventInfo: { color: "#44847a", fontSize: 13, marginTop: 2 }
});
