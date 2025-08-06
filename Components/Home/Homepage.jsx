import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList
} from "react-native";
import Header from "../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../utils/api";
import { stripMarkdown } from "../../stripmarkdown";

// Section header
const SectionHeader = ({ title, onPressAll }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onPressAll}>
      <Text style={styles.seeAll}>Xem tất cả</Text>
    </TouchableOpacity>
  </View>
);

const Homepage = ({ navigation }) => {
  const [user, setUser] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [event, setEvent] = React.useState([]);
  const [blog, setBlog] = React.useState([]);
  const [myClubRoles, setMyClubRoles] = React.useState([]);

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

  React.useEffect(() => {
    const fetchMyClubRoles = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const res = await fetchBaseResponse(`/api/clubs/my-club-roles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 200) setMyClubRoles(res.data);
      } catch (e) {
        console.error("Error fetching roles", e);
      }
    };
    fetchMyClubRoles();
  }, []);

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clubRes, eventRes, blogRes] = await Promise.all([
          fetchBaseResponse(`/api/clubs/public`),
          fetchBaseResponse(`/api/events/public`),
          fetchBaseResponse(`/api/blogs/public`)
        ]);

        if (clubRes.status === 200) setData(clubRes.data);
        if (eventRes.status === 200) setEvent(eventRes.data);
        if (blogRes.status === 200)
          setBlog(blogRes.data.sort((a, b) => b.createdAt - a.createdAt));
      } catch (e) {
        console.error("Error fetching data", e);
        Alert.alert("Lỗi", "Không thể tải dữ liệu");
      }
    };
    fetchAll();
  }, []);

  const GridClubList = ({ data, onPressItem }) => (
    <FlatList
      data={data.slice(0, 6)} // 👉 Hiển thị đúng 6 item đầu tiên
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPressItem(item.clubId)}
          activeOpacity={0.85}
          style={{ flex: 1 }}
        >
          <View style={styles.card}>
            <Image
              source={{ uri: item.logoUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {stripMarkdown(item.description)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.clubId.toString()}
      numColumns={2}
      contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
      scrollEnabled={false}
    />
  );

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  };

  const EventCardList = ({ eventData, onPressItem }) => {
    // 1. Lấy ngày hiện tại
    const now = new Date();

    // 2. Lọc những event trong tương lai
    const futureEvents = eventData.filter((e) => new Date(e.eventDate) >= now);

    // 3. Sắp xếp theo ngày tăng dần (gần nhất → xa nhất)
    const sortedData = [...futureEvents].sort(
      (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
    );

    // 4. Cắt 6 item đầu
    const rows = chunkArray(sortedData.slice(0, 6), 2);

    // 5. Xác định ngày gần nhất và xa nhất (nếu cần dùng)
    const nearestDate = sortedData[0]?.eventDate;
    const furthestDate = sortedData[sortedData.length - 1]?.eventDate;

    return (
      <View style={styles.cardGrid}>
        {sortedData.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.rangeText}>
              📆 Từ ngày {new Date(nearestDate).toLocaleDateString("vi-VN")} đến{" "}
              {new Date(furthestDate).toLocaleDateString("vi-VN")}
            </Text>
          </View>
        )}

        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((item) => (
              <TouchableOpacity
                key={item.eventId}
                onPress={() => onPressItem(item.eventId)}
                activeOpacity={0.85}
                style={styles.cardSmall}
              >
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardInfo}>
                  🕒{" "}
                  {new Date(item.eventDate).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </Text>
              </TouchableOpacity>
            ))}
            {row.length < 2 && <View style={{ width: "48%" }} />}
          </View>
        ))}
      </View>
    );
  };
  const BlogCardList = ({ blogData, onPressItem }) => {
    const rows = chunkArray(blogData.slice(0, 6), 2);
    return (
      <View style={styles.cardGrid}>
        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((item) => (
              <TouchableOpacity
                key={item.blogId}
                onPress={() => onPressItem(item.blogId)}
                activeOpacity={0.85}
                style={styles.cardBlog}
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.blogImage}
                />
                <View style={{ padding: 8 }}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {row.length < 2 && <View style={{ width: "48%" }} />}
          </View>
        ))}
      </View>
    );
  };

  const handleClubPress = async (clubId) => {
    const matched = myClubRoles.find((role) => role.clubId === clubId);
    const token = await AsyncStorage.getItem("jwt");

    try {
      const res = await fetchBaseResponse(
        `/api/memberships/status?clubId=${clubId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const isMember = res.data;
      if (
        isMember === "APPROVED" ||
        (isMember === null && ["CLUBLEADER", "MEMBER"].includes(matched?.role))
      ) {
        navigation.navigate("Club", {
          screen: "ClubGroup",
          params: { clubId }
        });
      } else {
        navigation.navigate("Club", {
          screen: "ClubId",
          params: { clubId }
        });
      }
    } catch (e) {
      console.error("Membership check failed", e);
      Alert.alert("Lỗi", "Bạn phải đăng nhập để vào câu lạc bộ");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fcf4eb", marginBottom: -20 }}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <SectionHeader
          title="CLB nổi bật"
          onPressAll={() => navigation.navigate("Club", { screen: "ClubNo" })}
        />
        <GridClubList data={data} onPressItem={handleClubPress} />

        <SectionHeader
          title="Sự kiện nổi bật"
          onPressAll={() =>
            navigation.navigate("Event", { screen: "EventStack" })
          }
        />
        <EventCardList
          eventData={event}
          onPressItem={(eventId) =>
            navigation.navigate("Event", {
              screen: "EventId",
              params: { eventId }
            })
          }
        />

        <SectionHeader
          title="Bài viết nổi bật"
          onPressAll={() => navigation.navigate("Club", { screen: "Blog" })}
        />
        <BlogCardList
          blogData={blog}
          onPressItem={(blogId) =>
            navigation.navigate("Club", {
              screen: "BlogDetail",
              params: { blogId }
            })
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827"
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB"
  },

  card: {
    height: 180,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    margin: 8
  },
  cardImage: {
    width: "100%",
    height: 90
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: "space-between"
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937"
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },
  cardGrid: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  cardSmall: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    padding: 10
  },
  cardInfo: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },
  cardBlog: {
    flexDirection: "row", // chuyển sang bố cục ngang
    flex: 0.48,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  blogImage: {
    flex: 3, // 3 phần ảnh (3/5)
    height: "100%",
    width: "100%",
    backgroundColor: "#E5E7EB"
  },
  cardContent: {
    flex: 2, // 2 phần chữ (2/5)
    padding: 10,
    justifyContent: "center"
  }
});

export default Homepage;
