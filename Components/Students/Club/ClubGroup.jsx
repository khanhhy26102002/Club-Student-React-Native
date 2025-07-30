import React from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
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
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [allData, setAllData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [joined, setJoined] = React.useState(false);
  const [clubInfo, setClubInfo] = React.useState(null);
  const [roleList, setRoleList] = React.useState([]);
  const [isLeader, setIsLeader] = React.useState(false);
  const [isEventCreator, setIsEventCreator] = React.useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { clubId } = route.params;

  React.useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      try {
        const [clubRes, roleRes, blogRes] = await Promise.all([
          fetchBaseResponse(`/api/clubs/${clubId}`, { headers }),
          fetchBaseResponse(`/api/clubs/my-club-roles`, { headers }),
          fetchBaseResponse(`/api/blogs/leader-club`, { headers })
        ]);

        if (clubRes.status === 200) {
          setClubInfo(clubRes.data);
          setJoined(clubRes.data.status === "APPROVED");
        }

        let isClubLeader = false;
        let canCreateEvent = false;
        let roles = [];

        if (roleRes.status === 200) {
          roles = roleRes.data || [];
          setRoleList(roles);

          isClubLeader = roles.some(
            (role) => role.clubId == clubId && role.role === "CLUBLEADER"
          );
          canCreateEvent = roles.some(
            (role) =>
              role.clubId == clubId &&
              (role.role === "CLUBLEADER" || role.role === "MEMBER")
          );

          setIsLeader(isClubLeader);
          setIsEventCreator(canCreateEvent);
        }
        const blogsRaw = Array.isArray(blogRes) ? blogRes : blogRes.data || [];
        const blogs = blogsRaw.map((blog) => ({
          ...blog,
          type: "blog"
        }));
        console.log("BlogRes", blogRes);
        const combined = [...blogs].sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt);
          const dateB = new Date(b.date || b.createdAt);
          return dateB - dateA;
        });

        setAllData(combined);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        Alert.alert("Lỗi", "Không thể tải dữ liệu câu lạc bộ.");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) fetchAll();
  }, [clubId]);

  const filteredData = allData.filter((item) =>
    selectedTab === "all" ? true : item.type === selectedTab
  );

  const canCreateEvent = selectedTab === "event" && joined && isEventCreator;

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

        {(isLeader || canCreateEvent) && (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              marginBottom: 12,
              gap: 10
            }}
          >
            {selectedTab === "blog" && isLeader && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Club", {
                    screen: "FormBlog",
                    params: { clubId: clubInfo.clubId }
                  })
                }
                style={{
                  backgroundColor: "#4caf50",
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  ＋ Tạo blog
                </Text>
              </TouchableOpacity>
            )}

            {canCreateEvent && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Event", {
                    screen: "EventRegister",
                    params: { clubId: clubInfo.clubId }
                  })
                }
                style={{
                  backgroundColor: "#4caf50",
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  ＋ Tạo sự kiện
                </Text>
              </TouchableOpacity>
            )}

            {selectedTab === "all" && isLeader && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Club", {
                      screen: "ClubMembership",
                      params: {
                        clubId: clubInfo.clubId
                      }
                    })
                  }
                  style={{
                    backgroundColor: "#ff9800",
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    ✅ Duyệt thành viên
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Club", {
                      screen: "Membership",
                      params: {
                        clubId: clubInfo.clubId
                      }
                    })
                  }
                  style={{
                    backgroundColor: "#6366F1",
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    ✅ Thành viên trong câu lạc bộ
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
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
            keyExtractor={(item, index) =>
              `${item.type}-${item.id || item.eventId || index}`
            }
            renderItem={({ item }) => (
              <PostCard
                data={item}
                navigation={navigation}
                isLeader={isLeader}
              />
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
