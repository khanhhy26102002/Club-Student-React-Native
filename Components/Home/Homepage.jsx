import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../utils/api";
import { stripMarkdown } from "../../stripmarkdown";

const Homepage = ({ navigation }) => {
  const [user, setUser] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [event, setEvent] = React.useState([]);
  const [blog, setBlog] = React.useState([]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedToken = await AsyncStorage.getItem("jwt");
      if (storedEmail && storedToken) {
        setUser({ email: storedEmail, token: storedToken });
      }
    };
    fetchUser();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetchBaseResponse(`/api/clubs/public`);
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Không fetch được data club public");
      }
    };
    fetchClub();
  }, []);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchBaseResponse(`/api/events/public`);
        if (response.status === 200) {
          setEvent(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Không fetch được data event public");
      }
    };
    fetchEvents();
  }, []);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetchBaseResponse(`/api/blogs/public`);
        if (response.status === 200) {
          setBlog(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Không fetch được data blog public");
      }
    };
    fetchBlogs();
  }, []);

  const SectionHeader = ({ title, onPressAll }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 8
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>
        {title}
      </Text>
      <TouchableOpacity onPress={onPressAll}>
        <Text style={{ fontSize: 14, color: "#2563EB", fontWeight: "500" }}>
          XEM TẤT CẢ
        </Text>
      </TouchableOpacity>
    </View>
  );

  const HorizontalCardList = ({ data, onPressItem }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 12,
        gap: 16
      }}
    >
      {data.map((item) => (
        <TouchableOpacity
          key={item.clubId}
          onPress={() => onPressItem(item.clubId)}
          activeOpacity={0.85}
        >
          <View
            style={{
              width: 240,
              borderRadius: 12,
              backgroundColor: "#fff",
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 2
            }}
          >
            <Image
              source={{ uri: item.logoUrl }}
              style={{ width: "100%", height: 120 }}
              resizeMode="cover"
            />
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 4
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={{ fontSize: 13, color: "#6b7280" }}
                numberOfLines={2}
              >
                {stripMarkdown(item.description)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const EventCardList = ({ eventData, onPressItem }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 12,
        gap: 16
      }}
    >
      {eventData.map((item) => (
        <TouchableOpacity
          key={item.eventId}
          activeOpacity={0.85}
          onPress={() => onPressItem(item.eventId)}
        >
          <View
            style={{
              width: 260,
              borderRadius: 12,
              backgroundColor: "#fff",
              overflow: "hidden",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 3,
              padding: 12
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 6
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}
              numberOfLines={2}
            >
              {stripMarkdown(item.description)}
            </Text>
            <Text style={styles.eventInfoText}>
              🕒 {new Date(item.eventDate).toLocaleString("vi-VN")}
            </Text>
            <Text style={styles.eventInfoText}>🧑‍💻 {item.format}</Text>
            <Text style={styles.eventInfoText}>📍 {item.location}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const BlogCardList = ({ blogData, onPressItem }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 16,
        gap: 16
      }}
    >
      {blogData.map((item) => (
        <TouchableOpacity
          key={item.blogId}
          activeOpacity={0.85}
          onPress={() => onPressItem(item.blogId)}
          style={{
            width: 280,
            backgroundColor: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            elevation: 3
          }}
        >
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={{
              width: "100%",
              height: 140,
              resizeMode: "cover"
            }}
          />
          <View style={{ padding: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 6
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}
              numberOfLines={2}
            >
              {stripMarkdown(item.content)}
            </Text>
            <Text style={styles.blogInfoText}>📝 {item.authorName}</Text>
            <Text style={styles.blogInfoText}>
              🕒 {new Date(item.createdAt).toLocaleString("vi-VN")}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f0f2f5",
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 30,
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 10
          }}
        >
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Tìm kiếm CLB..."
            placeholderTextColor="#94A3B8"
            style={{ flex: 1, fontSize: 16, color: "#000" }}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            marginTop: 20,
            marginHorizontal: 16,
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 2
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1d1f23" }}>
            🔥 CLB Tuần Này
          </Text>
          <Text style={{ marginTop: 6, fontSize: 15, color: "#4b5563" }}>
            Xem ngay những CLB đang nổi bật trong tuần và xu hướng hoạt động.
          </Text>
        </View> */}
        {/* <SectionHeader title="Loại CLB" onPressAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {["Kỹ năng", "Học thuật", "Tình nguyện"].map((c, i) => (
            <TouchableOpacity
              key={i}
              style={{
                backgroundColor: "#e5e7eb",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* Club List */}
        <SectionHeader
          title="CLB nổi bật"
          onPressAll={() => navigation.navigate("Club", { screen: "ClubNo" })}
        />
        <HorizontalCardList
          data={data}
          onPressItem={(clubId) =>
            navigation.navigate("Club", {
              screen: "ClubId",
              params: { clubId }
            })
          }
        />

        {/* Event List */}
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
              screen: "EventDetail",
              params: { eventId }
            })
          }
        />

        {/* Blog List */}
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
    </>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  cardWrapper: {
    width: 260 // hoặc 280 nếu bạn muốn rộng hơn
  },
  blogCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 360 // ⬅️ Chiều cao cố định để đều nhau
  },
  thumbnail: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  blogCardContent: {
    padding: 12,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4
  },
  blogContentPreview: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8
  },
  blogInfo: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8
  },
  banner: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  },
  bannerDesc: {
    color: "#E0F2FE",
    marginTop: 4
  },
  horizontalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: 250, // hoặc tùy chỉnh 80% nếu thích
    marginRight: 1, // 👉 tăng khoảng cách giữa các card ngang
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A"
  },
  seeAll: {
    color: "#2563EB",
    fontWeight: "600"
  },
  categoryList: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },
  categoryItem: {
    backgroundColor: "#E0F2FE",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  categoryText: {
    color: "#0369A1",
    fontWeight: "600"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%", // Full width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12, // cách nhau theo chiều dọc
    marginHorizontal: 1 // cách nhau theo chiều ngang (trái/phải)
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover"
  },
  cardContent: {
    padding: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6
  },
  cardSub: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20
  },
  eventCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    width: 260,
    marginRight: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3
  },
  eventCardContent: {
    flex: 1
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6
  },
  eventDescription: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
    lineHeight: 20
  },
  eventInfo: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2
  }
});
