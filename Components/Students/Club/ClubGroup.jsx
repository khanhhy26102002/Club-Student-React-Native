import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import TabsFilter from "./TabsFilter";
import PostCard from "./PostCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";

export default function ClubGroup() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [clubInfo, setClubInfo] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { clubId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");

      try {
        const clubRes = await fetchBaseResponse(`/api/clubs/${clubId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (clubRes.status === 200) {
          setClubInfo(clubRes.data);
          setJoined(clubRes.data.status === "APPROVED");
        }

        const blogRes = await fetchBaseResponse(`/api/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const blogs = (blogRes.data || [])
          .filter((blog) => blog.clubId == clubId)
          .map((blog) => ({
            ...blog,
            type: "blog"
          }));

        const [publicRes, internalRes] = await Promise.all([
          fetchBaseResponse(`/api/clubs/${clubId}/events?visibility=PUBLIC`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetchBaseResponse(`/api/clubs/${clubId}/events?visibility=INTERNAL`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const now = new Date();
        const events = [...(publicRes.data || []), ...(internalRes.data || [])]
          .filter(
            (event) =>
              event.status === "APPROVED" && new Date(event.eventDate) > now
          )
          .map((event) => ({
            ...event,
            type: "event"
          }));

        const combined = [...blogs, ...events].sort((a, b) => {
          const dateA = new Date(a.date || a.eventDate);
          const dateB = new Date(b.date || b.eventDate);
          return dateB - dateA;
        });

        setAllData(combined);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu câu lạc bộ.");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) fetchData();
  }, [clubId]);

  const filteredData = allData.filter((item) => {
    if (selectedTab === "all") return true;
    return item.type === selectedTab;
  });

  return (
    <>
      <Header />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
        {clubInfo && (
          <View
            style={{
              padding: 16,
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderColor: "#ddd"
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {clubInfo.logoUrl && (
                <Image
                  source={{ uri: clubInfo.logoUrl }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginRight: 12
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}
                >
                  {clubInfo.name}
                </Text>
                <Text style={{ color: "#666", marginTop: 2 }}>
                  {stripMarkdown(clubInfo.description)}
                </Text>
              </View>
            </View>
            <Text
              style={{
                marginTop: 8,
                color: joined ? "#2e7d32" : "#d32f2f",
                fontWeight: "bold"
              }}
            >
              {joined ? "✅ Đã tham gia CLB" : "❌ Chưa tham gia CLB"}
            </Text>
          </View>
        )}

        <TabsFilter selected={selectedTab} onSelect={setSelectedTab} />

        {joined && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Event", {
                screen: "EventRegister",
                params: {
                  clubId: clubInfo.clubId
                }
              })
            }
            style={{
              backgroundColor: "#1976d2",
              marginHorizontal: 16,
              marginBottom: 12,
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 16
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              ＋ Tạo sự kiện
            </Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#1877f2"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => `${item.type}-${item.id || item.eventId}`}
            renderItem={({ item }) => (
              <PostCard data={item} navigation={navigation} />
            )}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingHorizontal: 0
            }}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", marginTop: 20, color: "#666" }}
              >
                Không có nội dung để hiển thị.
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}
