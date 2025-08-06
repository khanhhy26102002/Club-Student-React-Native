import React from "react";
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import TabsFilter from "./TabsFilter";
import PostCard from "./PostCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { stripMarkdown } from "../../../stripmarkdown";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../../Header/Header";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function ClubGroup() {
  const [selectedTab, setSelectedTab] = React.useState("event");
  const [allData, setAllData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [joined, setJoined] = React.useState(false);
  const [clubInfo, setClubInfo] = React.useState(null);
  const [roleList, setRoleList] = React.useState([]);
  const [isLeader, setIsLeader] = React.useState(false);
  const [isEventCreator, setIsEventCreator] = React.useState(false);
  const [memberCount, setMemberCount] = React.useState(0); // ✅
  const [isMemberOnly, setIsMemberOnly] = React.useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { clubId } = route.params;

  const fetchAll = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const [clubRes, roleRes] = await Promise.all([
        fetchBaseResponse(`/api/clubs/${clubId}`, { headers }),
        fetchBaseResponse(`/api/clubs/my-club-roles`, { headers })
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
        const currentClubRole = roles.find(
          (role) => Number(role.clubId) === Number(clubId)
        );
        if (currentClubRole?.memberCount !== undefined) {
          setMemberCount(currentClubRole.memberCount);
        }
        const isMemberOnly = roles.some(
          (role) =>
            (Number(role.clubId) === Number(clubId) &&
              role.myRole === "MEMBER") ||
            role.myRole === "CLUBLEADER"
        );
        setIsMemberOnly(isMemberOnly);

        isClubLeader = roles.some(
          (role) =>
            Number(role.clubId) === Number(clubId) && role.myRole === "CLUBLEADER"
        );
        canCreateEvent = roles.some(
          (role) =>
            Number(role.clubId) === Number(clubId) &&
            (role.myRole === "CLUBLEADER" || role.myRole === "MEMBER")
        );

        setIsLeader(isClubLeader);
        setIsEventCreator(canCreateEvent);
      }

      // Fetch approved members count
      const memberRes = await fetchBaseResponse(
        `/api/clubs/${clubId}/members`,
        {
          headers
        }
      );
      if (memberRes.status === 200) {
        const approved = (memberRes.data || []).filter(
          (m) => m.status === "APPROVED"
        );
      }

      // Fetch blogs (different API for leader vs member)
      const blogUrl = isClubLeader
        ? `/api/blogs/leader-club`
        : `/api/blogs/my-clubs`;

      const blogRes = await fetchBaseResponse(blogUrl, { headers });
      const blogsRaw = Array.isArray(blogRes?.data) ? blogRes.data : [];

      const blogs = blogsRaw
        .filter((blog) => Number(blog.clubId) === Number(clubId))
        .map((blog) => ({ ...blog, type: "blog" }));

      // Fetch events
      const eventRes = await fetchBaseResponse(`/api/events/my-events`, {
        headers
      });

      let eventsRaw = [];
      if (eventRes.status === 200 && Array.isArray(eventRes.data)) {
        eventsRaw = eventRes.data;
      } else {
        console.log(
          "⚠️ Không có sự kiện hoặc lỗi định dạng eventRes:",
          eventRes
        );
      }

      const events = eventsRaw.map((event) => ({ ...event, type: "event" }));
      console.log("📦 eventsRaw:", eventsRaw);
      console.log("🔎 clubId hiện tại:", clubId);

      // Gộp blogs và events
      const combined = [...blogs, ...events].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return dateB - dateA;
      });

      setAllData(combined);
    } catch (err) {
      console.error("❌ Lỗi khi tải dữ liệu:", err);
      Alert.alert("Lỗi", "Không thể tải dữ liệu câu lạc bộ.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (clubId) fetchAll();
  }, [clubId]);

  const filteredData = allData.filter((item) => item.type === selectedTab);
  const canCreateEvent = selectedTab === "event" && joined && isEventCreator;

  const HorizontalButton = ({ icon, label, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 100,
        height: 100,
        backgroundColor: "#f3f4f6",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
        marginLeft: -15
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          textAlign: "center",
          color: "#111827"
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#dbeafe", "#f0f4ff"]}
      style={{ flex: 1, alignSelf: "flex-start" }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{
          position: "absolute",
          left: 16,
          top: 10,
          zIndex: 10,
          backgroundColor: "#fff",
          padding: 8,
          borderRadius: 999,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 3,
          elevation: 4,
          marginTop: 100
        }}
      >
        <Ionicons name="arrow-back" size={22} color="#1e3a8a" />
      </TouchableOpacity>
      <Header />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ marginBottom: 100 }}>
          {clubInfo && (
            <View style={{ marginBottom: 16 }}>
              {/* Banner */}
              <Image
                source={{
                  uri:
                    clubInfo.logoUrl ||
                    "https://source.unsplash.com/random/400x200"
                }}
                style={{
                  width: "100%",
                  height: 180,
                  backgroundColor: "#e5e7eb"
                }}
              />

              {/* Info Block dưới banner */}
              <View style={{ marginTop: 12, paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#111827",
                    textAlign: "left"
                  }}
                >
                  {clubInfo.name}
                </Text>
                <Text
                  style={{
                    color: "#6b7280",
                    fontSize: 14,
                    marginTop: 4,
                    textAlign: "left",
                    lineHeight: 20
                  }}
                  numberOfLines={3}
                >
                  {stripMarkdown(clubInfo.description)}
                </Text>
                <Text
                  style={{
                    color: "#2563eb",
                    fontWeight: "500",
                    fontSize: 14,
                    marginTop: 4,
                    textAlign: "left"
                  }}
                >
                  👥 {memberCount} người đã tham gia CLB
                </Text>
              </View>
            </View>
          )}

          <View
            style={{
              marginHorizontal: 1,
              // backgroundColor: "#16a34a",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              width: 450
            }}
          >
            <TabsFilter selected={selectedTab} onSelect={setSelectedTab} />
          </View>

          {(isLeader || canCreateEvent) && (
            <View style={{ marginTop: 16 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 16,
                  paddingRight: 8,
                  gap: 12
                }}
              >
                {selectedTab === "blog" && isLeader && (
                  <HorizontalButton
                    icon="📝"
                    label="Tạo blog"
                    onPress={() =>
                      navigation.navigate("Club", {
                        screen: "FormBlog",
                        params: { clubId: clubInfo.clubId }
                      })
                    }
                  />
                )}
                {selectedTab === "event" &&
                  joined &&
                  isMemberOnly &&
                  !isLeader && (
                    // 👉 Nếu chỉ là MEMBER, hiển thị nút styled đẹp
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Event", {
                          screen: "EventRegister",
                          params: { clubId: clubInfo.clubId }
                        })
                      }
                      style={{
                        width: 400,
                        height: 120,
                        backgroundColor: "#1d4ed8",
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                        elevation: 4,
                        marginLeft: -10
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 8
                        }}
                      >
                        <Text style={{ fontSize: 26, color: "#1d4ed8" }}>
                          ➕
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          textAlign: "center",
                          color: "#fff"
                        }}
                      >
                        Tạo sự kiện
                      </Text>
                    </TouchableOpacity>
                  )}

                {selectedTab === "event" &&
                  joined &&
                  isEventCreator &&
                  isLeader && (
                    // 👉 Nếu là CLUBLEADER, giữ nguyên nút mặc định
                    <HorizontalButton
                      icon={
                        <FontAwesome5
                          name="calendar-plus"
                          size={20}
                          color="#ff6600"
                        />
                      }
                      label="Tạo sự kiện"
                      onPress={() =>
                        navigation.navigate("Event", {
                          screen: "EventRegister",
                          params: { clubId: clubInfo.clubId }
                        })
                      }
                    />
                  )}

                {isLeader && (
                  <>
                    <HorizontalButton
                      icon="🧍‍♂️"
                      label="Duyệt TV"
                      onPress={() =>
                        navigation.navigate("Club", {
                          screen: "ClubMembership",
                          params: { clubId: clubInfo.clubId }
                        })
                      }
                    />
                    <HorizontalButton
                      icon="👥"
                      label="Xem thành viên"
                      onPress={() =>
                        navigation.navigate("Club", {
                          screen: "Membership",
                          params: { clubId: clubInfo.clubId }
                        })
                      }
                    />
                    <HorizontalButton
                      icon="🔁"
                      label="Chuyển quyền"
                      onPress={() =>
                        navigation.navigate("Club", {
                          screen: "Transfer",
                          params: { clubId: clubInfo.clubId }
                        })
                      }
                    />
                  </>
                )}
              </ScrollView>
            </View>
          )}

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#3b82f6"
              style={{ marginTop: 40 }}
            />
          ) : filteredData.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                marginTop: 40,
                fontSize: 16,
                color: "#9ca3af"
              }}
            >
              Không có nội dung để hiển thị.
            </Text>
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
                  onDelete={() => fetchAll()}
                />
              )}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingTop: 16,
                paddingHorizontal: 16
              }}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
