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
        const response = await fetchBaseResponse(`/api/clubs/public`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
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
    const fetchClub = async () => {
      try {
        const response = await fetchBaseResponse(`/api/events/public`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
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
    fetchClub();
  }, []);
  React.useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetchBaseResponse(`/api/blogs/public`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setBlog(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Không fetch được data event public");
      }
    };
    fetchClub();
  }, []);
  return (
    <>
      <Header />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput placeholder="Search Club..." style={styles.searchInput} />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🔥 CLB Tuần Này</Text>
          <Text style={styles.bannerDesc}>
            Xem ngay những CLB đang nổi bật trong tuần và xu hướng hoạt động.
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Loại CLB</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryList}>
          {["Kỹ năng", "Học thuật", "Tình nguyện"].map((c, i) => (
            <TouchableOpacity key={i} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>CLB nổi bật</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Club", {
                screen: "ClubNo"
              })
            }
          >
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 16, marginTop: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 16,
              paddingLeft: 4,
              paddingRight: 20,
              marginTop: 8
            }}
          >
            {data.map((item) => (
              <TouchableOpacity
                key={item.clubId}
                onPress={() =>
                  navigation.navigate("Club", {
                    screen: "ClubId",
                    params: {
                      clubId: item.clubId
                    }
                  })
                }
              >
                <View key={item.clubId} style={styles.horizontalCard}>
                  <Image
                    source={{ uri: item.logoUrl }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSub} numberOfLines={2}>
                      {stripMarkdown(item.description)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={[styles.sectionRow, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Sự kiện nổi bật</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Event", {
                screen: "EventStack"
              })
            }
          >
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 16, marginTop: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 16,
              paddingLeft: 4,
              paddingRight: 20,
              marginTop: 8
            }}
          >
            {event.map((item) => (
              <TouchableOpacity
                key={item.eventId}
                onPress={() =>
                  navigation.navigate("Event", {
                    screen: "EventId",
                    params: {
                      eventId: item.eventId
                    }
                  })
                }
              >
                <View style={styles.eventCard}>
                  <View style={styles.eventCardContent}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {stripMarkdown(item.description)}
                    </Text>
                    <Text style={styles.eventInfo}>
                      🕒 {new Date(item.eventDate).toLocaleString()}
                    </Text>
                    <Text style={styles.eventInfo}>🧑‍💻 {item.format}</Text>
                    <Text style={styles.eventInfo}>📍 {item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={[styles.sectionRow, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Bài viết nổi bật</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Club", {
                screen: "Blog"
              })
            }
          >
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 16
            }}
          >
            {blog.map((item) => (
              <TouchableOpacity
                key={item.blogId}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("Club", {
                    screen: "BlogDetail",
                    params: { blogId: item.blogId }
                  })
                }
                style={styles.cardWrapper}
              >
                <View style={styles.blogCard}>
                  <Image
                    source={{ uri: item.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.blogCardContent}>
                    <Text style={styles.blogTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.blogContentPreview} numberOfLines={2}>
                      {item.content}
                    </Text>
                    <Text style={styles.blogInfo}>📝 {item.authorName}</Text>
                    <Text style={styles.blogInfo}>
                      🕒 {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

export default Homepage;

const styles = StyleSheet.create({
 cardWrapper: {
    width: 260 // Đảm bảo các card có cùng kích thước
  },
  blogCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3
  },
  thumbnail: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  blogCardContent: {
    padding: 12,
    gap: 4
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937"
  },
  blogContentPreview: {
    fontSize: 14,
    color: "#4b5563"
  },
  blogInfo: {
    fontSize: 12,
    color: "#6b7280"
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
