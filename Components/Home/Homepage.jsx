import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
  UIManager,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import { stripMarkdown } from "../../stripmarkdown";
import dayjs from "dayjs";
const ACCENT = "#2E3A59";
// thanh ở trên thu gọn lại còn thanh search
// bỏ cái nút đang chờ duyệt ở trang home
const indicators = [
  {
    id: "i1",
    label: "Đang tham gia",
    count: 2,
    icon: "https://img.icons8.com/color/48/000000/combo-chart--v2.png",
    bg: "#e0feee"
  },
  {
    id: "i2",
    label: "Sự kiện tuần này",
    count: 4,
    icon: "https://img.icons8.com/color/48/000000/appointment-reminders.png",
    bg: "#ffeadb"
  },
  {
    id: "i3",
    label: "Điểm CLB",
    count: 68,
    icon: "https://img.icons8.com/color/48/000000/prize.png",
    bg: "#f5f2ff"
  }
];
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 10;
const ICON_OPACITY_SCROLL_THRESHOLD = 30;
export default function Homepage() {
  const navigation = useNavigation();
  const [bannerData, setBannerData] = useState([]);
  const [period, setPeriod] = useState("week");
  const [bannerIdx, setBannerIdx] = useState(0);
  const intervalRef = React.useRef(null);
  const [user, setUser] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [event, setEvent] = React.useState([]);
  const [blog, setBlog] = React.useState([]);
  const [nearestEvent, setNearestEvent] = useState(null);
  const [furthestEvent, setFurthestEvent] = useState(null);
  const [dataprofile, setDataProfile] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [clubRoles, setClubRoles] = useState({});
  const [membershipStatuses, setMembershipStatuses] = useState({});
  const scrollY = useRef(new Animated.Value(0)).current;
  const [clubRankings, setClubRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [clubComparison, setClubComparison] = useState([]);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const fetchClubComparison = async () => {
    setLoadingComparison(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      const response = await fetchBaseResponse(
        "/api/statistics/club-comparison",
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        setClubComparison(response.data || []);
      } else {
        console.error("Lỗi fetch club comparison:", response.status);
      }
    } catch (error) {
      console.error("Lỗi gọi API club comparison:", error);
    } finally {
      setLoadingComparison(false);
    }
  };

  const fetchClubRankings = async (selectedPeriod = "week") => {
    setLoadingRankings(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      const response = await fetchBaseResponse(
        `/api/statistics/club-rankings?period=${selectedPeriod}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        setClubRankings(response.data || []);
      } else {
        console.error("Lỗi fetch club rankings:", response.status);
      }
    } catch (error) {
      console.error("Lỗi gọi API club rankings:", error);
    } finally {
      setLoadingRankings(false);
    }
  };

  // Gọi API khi mount hoặc khi period thay đổi
  useEffect(() => {
    fetchClubRankings(period);
  }, [period]);
  useEffect(() => {
    fetchClubComparison();
  }, []);

  // UI phần chọn period
  const periods = [
    { key: "week", label: "Tuần" },
    { key: "month", label: "Tháng" },
    { key: "quarter", label: "Quý" },
    { key: "year", label: "Năm" }
  ];
  const headerHeight = scrollY.interpolate({
    inputRange: [0, ICON_OPACITY_SCROLL_THRESHOLD],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp"
  });

  const iconOpacity = scrollY.interpolate({
    inputRange: [0, ICON_OPACITY_SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: "clamp"
  });

  useEffect(() => {
    const fetchClubMeta = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (!token) return;

        // 1. Fetch all roles in clubs
        const roleRes = await fetchBaseResponse("/api/clubs/my-club-roles", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (roleRes.status === 200 && Array.isArray(roleRes.data)) {
          const roleMap = {};
          roleRes.data.forEach((r) => {
            roleMap[r.clubId] = r.myRole;
          });
          setClubRoles(roleMap);
        }

        // 2. Fetch statuses in parallel
        const clubIds = data.map((club) => club.clubId);
        const statusPromises = clubIds.map(async (clubId) => {
          const res = await fetchBaseResponse(
            `/api/memberships/status?clubId=${clubId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          return {
            clubId,
            status: res.status === 200 ? res.data : null
          };
        });

        const statusResults = await Promise.all(statusPromises);
        const statusMap = {};
        statusResults.forEach(({ clubId, status }) => {
          statusMap[clubId] = status;
        });

        setMembershipStatuses(statusMap);
      } catch (error) {
        console.error("Error fetching club metadata", error);
      }
    };

    fetchClubMeta();
  }, [data]); // ✅ nhớ thêm `data` vào dependency nếu `data` đến từ props hoặc state

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(`/api/users/getInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setDataProfile(response.data);
        } else {
          throw new Error(`HTTP Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Lỗi", "Không nhận được dữ liệu từ userInfo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  React.useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedToken = await AsyncStorage.getItem("jwt");
      if (storedEmail && storedToken) {
        setUser({ email: storedEmail, token: storedToken });
      }
    };
    fetchUser();
    const unsubscribe = navigation.addListener("focus", fetchUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clubRes, eventRes, blogRes] = await Promise.all([
          fetchBaseResponse(`/api/clubs/public`),
          fetchBaseResponse(`/api/events/public`),
          fetchBaseResponse(`/api/blogs/public`)
        ]);

        if (clubRes.status === 200) setData(clubRes.data);
        if (eventRes.status === 200) {
          const events = eventRes.data;

          setEvent(events);

          const sortedEvents = events
            .filter((e) => new Date(e.eventDate) > new Date()) // loại bỏ sự kiện quá khứ
            .sort((a, b) => new Date(a.eventDate) - new Date(b.time));

          setNearestEvent(sortedEvents[0]);
          setFurthestEvent(sortedEvents[sortedEvents.length - 1]);
        }

        if (blogRes.status === 200) {
          setBlog(blogRes.data.sort((a, b) => b.createdAt - a.createdAt));
        }
      } catch (e) {
        console.error("Error fetching data", e);
        Alert.alert("Lỗi", "Không thể tải dữ liệu");
      }
    };

    fetchAll();
  }, []);

  // Banner tự động chuyển 4s/lần
  const fetchBanners = async () => {
    try {
      const [eventsRes] = await Promise.all([
        fetchBaseResponse("/api/events/public")
      ]);

      if (eventsRes.status === 200) {
        const banners = eventsRes.data.slice(0, 5).map((event) => ({
          img: { uri: event.thumbnailUrl },
          text: `Sự kiện: ${event.title}`,
          sub:
            stripMarkdown(event.description?.slice(0, 60)) || "Tham gia ngay!",
          onPress: () =>
            navigation.navigate("Event", {
              screen: "EventDetail",
              params: { eventId: event.eventId }
            })
        }));

        setBannerData(banners);
        setLoading(false);
      }
    } catch (error) {
      console.error("Lỗi load banner:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!bannerData || bannerData.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setBannerIdx((prevIdx) => (prevIdx + 1) % bannerData.length);
    }, 3000); // ⏱ 3s

    return () => clearInterval(intervalRef.current);
  }, [bannerData]);

  const handlePress = () => {
    const banner = bannerData[bannerIdx];
    if (banner?.type === "event") {
      navigation.navigate("EventId", { eventId: banner.eventId });
    }
  };

  if (!bannerData.length) return null;
  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!bannerData.length) return null;

  return (
    <>
      <Header />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f8fa" }}>
        <StatusBar barStyle="light-content" />
        {/* Header */}
        <LinearGradient colors={["#ff6600", "#ff6600"]} style={[styles.header]}>
          <View style={styles.headerWrap}>
            <View>
              <Text style={styles.hello}>
                Chào {dataprofile.fullName}
                👋,
              </Text>
            </View>
            {/* <Image
              source={{
                uri: dataprofile.avatarUrl
              }}
              style={styles.avatar}
            /> */}
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm CLB, sự kiện, bạn bè..."
              placeholderTextColor="#80b6b2"
            />
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/23d4ae/search--v1.png"
              }}
              style={styles.iconSearch}
            />
          </View>
          {/* Chỉ số tổng quan */}
          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Animated.View style={[styles.iconRow, { opacity: iconOpacity }]}>
              {indicators.map((item) => (
                <View
                  key={item.id}
                  style={[styles.indicatorCard, { backgroundColor: item.bg }]}
                >
                  <Image
                    source={{ uri: item.icon }}
                    style={{ width: 26, height: 26, marginBottom: 3 }}
                  />
                  <Text style={styles.indicatorCount}>{item.count}</Text>
                  <Text style={styles.indicatorLabel}>{item.label}</Text>
                </View>
              ))}
            </Animated.View>
          </Animated.View>
        </LinearGradient>
        <Animated.ScrollView
          style={{ flex: 1 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Banner/Carousel */}
          <TouchableOpacity
            style={styles.bannerCard}
            onPress={handlePress}
            activeOpacity={0.9}
          >
            <Image
              source={bannerData[bannerIdx].img}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>
                {bannerData[bannerIdx].text}
              </Text>
              <Text style={styles.bannerSubtitle} numberOfLines={2}>
                {bannerData[bannerIdx].sub}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Check-in box */}
          <TouchableOpacity style={styles.checkinBox} activeOpacity={0.9}>
            <Image
              source={{
                uri: "https://img.icons8.com/color/96/000000/attendance-mark.png"
              }}
              style={{ width: 33, height: 33 }}
            />
          </TouchableOpacity>

          {/* Danh sách CLB gợi ý */}
          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 14
              }}
            >
              <Text style={styles.sectionTitle}>CLB nổi bật</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Club", {
                    screen: "ClubNo"
                  })
                }
              >
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={data.slice(0, 4)} // 👉 Lấy 4 CLB đầu
              keyExtractor={(i) => i.clubId.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 14 }}
              renderItem={({ item }) => {
                const role = clubRoles[item.clubId];
                const status = membershipStatuses[item.clubId];
                const isApproved = status === "APPROVED";
                const isPending = status === "PENDING";
                const isLeaderOrMember =
                  role === "CLUBLEADER" || role === "MEMBER";

                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (isApproved || isLeaderOrMember) {
                        navigation.navigate("Club", {
                          screen: "ClubGroup",
                          params: { clubId: item.clubId }
                        });
                      } else {
                        navigation.navigate("Club", {
                          screen: "ClubId",
                          params: { clubId: item.clubId }
                        });
                      }
                    }}
                  >
                    <View style={styles.clubCard}>
                      <Image
                        source={{ uri: item.logoUrl }}
                        style={styles.clubImg}
                      />
                      <Text style={styles.clubName}>{item.name}</Text>
                      <Text style={styles.clubDescription} numberOfLines={2}>
                        {stripMarkdown(item.description) || "Không có mô tả"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Sự kiện sắp tới */}
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Sự kiện sắp tới</Text>
            <FlatList
              horizontal
              data={event.slice(0, 4)}
              keyExtractor={(item) => item.eventId.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 14 }}
              renderItem={({ item }) => {
                const eventTime = dayjs(item.eventDate).format(
                  "HH:mm, DD/MM/YYYY"
                );
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.eventCard}
                    onPress={() => {
                      navigation.navigate("Event", {
                        screen: "EventId",
                        params: {
                          eventId: item.eventId
                        }
                      });
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          item.projectFileUrl ||
                          "https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/2020-Chevrolet-Corvette-Stingray/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=960"
                      }}
                      style={styles.eventImg}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.eventTitle}>{item.title}</Text>
                      <Text style={styles.eventDesc}>
                        {eventTime} • {item.location}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View style={{ marginBottom: 25 }}>
            <Text style={styles.sectionTitle}>Blog nổi bật</Text>
            <FlatList
              horizontal
              data={blog.slice(0, 4)} // blogs là array chứa danh sách blog
              keyExtractor={(item) => item.blogId.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 14 }}
              renderItem={({ item }) => {
                const createdAt = dayjs(item.createdAt).format("DD/MM/YYYY");
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.blogCard}
                    onPress={() => {
                      navigation.navigate("Club", {
                        screen: "BlogDetail",
                        params: {
                          blogId: item.blogId
                        }
                      });
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          item.thumbnailUrl ||
                          "https://via.placeholder.com/120x90.png?text=No+Image"
                      }}
                      style={styles.blogImg}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text numberOfLines={2} style={styles.blogTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.blogDesc}>
                        {item.authorName} • {createdAt}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <View style={{ paddingHorizontal: 14 }}>
            {/* Period Selector */}
            <View style={styles.periodSelector}>
              {periods.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setPeriod(key)}
                  style={[
                    styles.periodButton,
                    period === key && styles.periodButtonActive
                  ]}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      period === key && styles.periodButtonTextActive
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ranking List */}
            <View style={styles.rankingContainer}>
              <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
                Xếp hạng CLB ({period})
              </Text>

              {loadingRankings ? (
                <ActivityIndicator size="small" color="#ff6600" />
              ) : (
                <FlatList
                  data={clubRankings}
                  keyExtractor={(item) => item.clubId.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 14 }}
                  renderItem={({ item, index }) => {
                    const isTop1 = index === 0;
                    const isTop2 = index === 1;
                    const isTop3 = index === 2;

                    // Màu nền riêng cho top 3
                    let bgColor = "#fff";
                    if (isTop1) bgColor = "#ffddc1"; // màu vàng nhạt
                    else if (isTop2) bgColor = "#d0e6ff"; // màu xanh nhạt
                    else if (isTop3) bgColor = "#ffd6d6"; // màu đỏ nhạt

                    return (
                      <View
                        style={[
                          styles.rankingCard,
                          { backgroundColor: bgColor }
                        ]}
                      >
                        <View style={styles.rankCircle}>
                          <Text style={styles.rankNumber}>{index + 1}</Text>
                        </View>
                        <Image
                          source={{ uri: item.logoUrl }}
                          style={styles.rankLogo}
                        />
                        <Text style={styles.rankClubName} numberOfLines={1}>
                          {item.clubName}
                        </Text>
                        <Text style={styles.rankPoints}>
                          {item.totalPoints} điểm
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
            <View style={{ marginBottom: 25 }}>
              <Text style={styles.sectionTitle}>So sánh CLB</Text>
              {loadingComparison ? (
                <ActivityIndicator size="small" color="#ff6600" />
              ) : (
                <FlatList
                  horizontal
                  data={clubComparison}
                  keyExtractor={(item, index) =>
                    item.clubId?.toString() || index.toString()
                  }
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 14 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.comparisonCard}
                      onPress={() => {
                        navigation.navigate("Club", {
                          screen: "ClubGroup",
                          params: { clubId: item.clubId }
                        });
                      }}
                    >
                      <Text style={styles.comparisonClubName} numberOfLines={1}>
                        {item.clubName || "Tên CLB"}
                      </Text>
                      <Text style={styles.comparisonScore}>
                        Điểm: {item.totalPoints || 0}
                      </Text>
                      {/* Bạn có thể thêm icon, biểu đồ nhỏ hoặc chi tiết khác nếu muốn */}
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Animated.ScrollView>
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("Club", {
              screen: "FormClub"
            })
          }
          activeOpacity={0.9}
          style={{
            position: "absolute",
            bottom: 30,
            right: 20,
            backgroundColor: "#ff6600",
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 100,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 10
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            + Tạo CLB
          </Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    </>
  );
}

// ---------- STYLE ----------
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: -1,
    justifyContent: "flex-end",
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    marginTop: -5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 30
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 58
  },
  icon: {
    width: 30,
    height: 30
  },
  cardContainer: {
    borderRadius: 12,
    overflow: "hidden"
  },
  textContainer: {
    padding: 12,
    backgroundColor: "#fff"
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4E342E",
    marginBottom: 4,
    textAlign: "center"
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#6D4C41",
    textAlign: "center"
  },
  clubDescription: {
    fontSize: 12,
    color: "#4E342E",
    marginVertical: 4
  },
  groupButton: {
    marginTop: 8,
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center"
  },
  groupButtonText: {
    color: "#fff",
    fontWeight: "600"
  },
  joinbtnSmall: {
    marginTop: 8,
    backgroundColor: "#10b981",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center"
  },
  joinbtnSmallText: {
    color: "#fff",
    fontWeight: "600"
  },
  viewAllText: {
    color: "#007bff",
    fontSize: 13
  },

  headerWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 8, // giảm padding để gọn hơn
    marginTop: 10
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#fff"
  },
  hello: {
    fontSize: 16, // giảm font
    fontWeight: "600",
    color: "#fff"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2
  },
  searchContainer: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 8,
    shadowColor: "#00b8be",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    height: 36 // giảm chiều cao ô tìm kiếm
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0, color: "#000" },
  iconSearch: {
    width: 18,
    height: 18,
    tintColor: "#23d4ae"
  },
  indicatorWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: -14
  },
  indicatorCard: {
    flex: 1,
    marginHorizontal: 4.5,
    borderRadius: 13,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
    shadowColor: "#7df3cf",
    shadowOpacity: 0.17,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    paddingVertical: 10 // giảm chiều cao thẻ
  },
  indicatorCount: { fontSize: 14, fontWeight: "bold", color: "#21ad93" },
  indicatorLabel: {
    fontSize: 12,
    color: "#467e74",
    fontWeight: "500",
    marginTop: 1
  },
  bannerCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30
  },

  bannerImage: {
    width: "100%",
    height: 160
  },

  bannerTextContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8F0"
  },

  bannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4E342E",
    marginBottom: 4,
    textAlign: "center"
  },

  bannerSubtitle: {
    fontSize: 14,
    color: "#6D4C41",
    textAlign: "center"
  },
  checkinBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f9ff",
    borderRadius: 17,
    marginHorizontal: 18,
    marginBottom: 8,
    padding: 13,
    shadowColor: "#00eec4",
    shadowOpacity: 0.13,
    shadowRadius: 7
  },
  checkinTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#23d4ae",
    marginLeft: 8
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4E342E",
    marginLeft: 1,
    marginTop: 22,
    marginBottom: 8,
    letterSpacing: 0.1
  },
  clubCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginRight: 14,
    width: 220,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center"
  },
  clubImg: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 8
  },
  clubName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    marginBottom: 4
  },
  clubDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 16
  },
  joinbtnSmall: {
    backgroundColor: "#3fb27f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  joinbtnSmallText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500"
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "flex-start",
    marginRight: 20,
    shadowColor: "#e2f4ed",
    shadowOpacity: 0.13,
    shadowRadius: 8,
    marginBottom: 12,
    width: 300,
    padding: 10,
    marginTop: 10
  },

  eventImg: {
    width: 130, // Tăng kích thước hình
    height: 200,
    borderRadius: 10
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    flexWrap: "wrap"
  },

  eventDesc: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
    flexWrap: "wrap"
  },

  detailBtn: {
    marginTop: 20,
    backgroundColor: "#e5f0ff",
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start"
  },

  detailBtnText: {
    fontSize: 12,
    color: "#3366cc",
    fontWeight: "500"
  },

  bigJoinBtn: {
    backgroundColor: ACCENT,
    borderRadius: 23,
    marginHorizontal: 40,
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 13,
    marginBottom: 35,
    shadowColor: "#17f0be",
    shadowOpacity: 0.23,
    shadowRadius: 5
  },
  bigJoinBtnText: {
    color: "#fff",
    fontSize: 16.3,
    fontWeight: "bold",
    letterSpacing: 0.19
  },
  blogCard: {
    width: 180,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center"
  },
  blogImg: {
    width: "100%",
    height: 110,
    borderRadius: 10,
    marginBottom: 8
  },
  blogTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    marginBottom: 4
  },
  blogDesc: {
    fontSize: 12,
    color: "#777",
    textAlign: "center"
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0"
  },
  periodButtonActive: {
    backgroundColor: "#ff6600"
  },
  periodButtonText: {
    color: "#555",
    fontWeight: "500"
  },
  periodButtonTextActive: {
    color: "#fff"
  },
  rankingContainer: {
    marginVertical: 20
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  rankNumber: {
    fontSize: 20,
    fontWeight: "bold",
    width: 32,
    textAlign: "center",
    color: "#ff6600"
  },
  rankLogo: {
    width: 40,
    width: 40,
    height: 40,
    borderRadius: 20
  },
  rankClubName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59"
  },
  rankPoints: {
    fontSize: 14,
    color: "#888",
    marginTop: 2
  },
  rankingCard: {
    width: 120,
    borderRadius: 10,
    padding: 12,
    marginRight: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  rankCircle: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff6600",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#ff6600",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4
  },
  rankNumber: {
    color: "#fff",
    fontWeight: "bold"
  },
  rankLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8
  },
  rankClubName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#2E3A59",
    textAlign: "center"
  },
  rankPoints: {
    fontSize: 12,
    color: "#666",
    marginTop: 4
  },
  comparisonCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  comparisonClubName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: ACCENT,
  },
  comparisonScore: {
    fontSize: 14,
    color: "#555",
  },
});
