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
const SectionHeader = ({ title, onPressAll }) => {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 24, marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#111827",
          textAlign: "center"
        }}
      >
        {title}
      </Text>

      <TouchableOpacity onPress={onPressAll}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#2563EB",
            marginTop: 10,
            textAlign: "center"
          }}
        >
          Xem tất cả
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const Homepage = ({ navigation }) => {
  const [user, setUser] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [event, setEvent] = React.useState([]);
  const [blog, setBlog] = React.useState([]);
  const [myClubRoles, setMyClubRoles] = React.useState([]);
  React.useEffect(() => {
    const fetchMyClubRoles = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(`/api/clubs/my-club-roles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setMyClubRoles(response.data);
        }
      } catch (error) {
        console.error("Error fetching my club roles:", error);
      }
    };
    fetchMyClubRoles();
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

  const GridClubList = ({ data, onPressItem }) => {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => onPressItem(item.clubId)}
        activeOpacity={0.85}
        style={{ flex: 1 }}
      >
        <View
          style={{
            height: 230,
            borderRadius: 12,
            backgroundColor: "#fff",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 2,
            margin: 8
          }}
        >
          <Image
            source={{ uri: item.logoUrl }}
            style={{ width: "100%", height: 100 }}
            resizeMode="cover"
          />
          <View
            style={{ padding: 12, flex: 1, justifyContent: "space-between" }}
          >
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
              style={{ fontSize: 13, color: "#6b7280", flex: 1 }}
              numberOfLines={3}
            >
              {stripMarkdown(item.description)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.clubId.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 24 }}
        scrollEnabled={false}
      />
    );
  };
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const EventCardList = ({ eventData, onPressItem }) => {
    const rows = chunkArray(eventData, 2);

    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16
            }}
          >
            {row.map((item) => (
              <TouchableOpacity
                key={item.eventId}
                activeOpacity={0.85}
                onPress={() => onPressItem(item.eventId)}
                style={{
                  width: "48%",
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  elevation: 3,
                  padding: 12
                }}
              >
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventInfoText}>
                  🕒 {new Date(item.eventDate).toLocaleString("vi-VN")}
                </Text>
                <Text style={styles.eventInfoText}>📍 {item.location}</Text>
              </TouchableOpacity>
            ))}
            {row.length < 2 && <View style={{ width: "48%" }} />}
          </View>
        ))}
      </View>
    );
  };

  const BlogCardList = ({ blogData, onPressItem }) => {
    const rows = chunkArray(blogData, 2);

    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16
            }}
          >
            {row.map((item) => (
              <TouchableOpacity
                key={item.blogId}
                activeOpacity={0.85}
                onPress={() => onPressItem(item.blogId)}
                style={{
                  width: "48%",
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  elevation: 3,
                  overflow: "hidden"
                }}
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={{
                    width: "100%",
                    height: 100,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12
                  }}
                  resizeMode="cover"
                />
                <View style={{ padding: 8 }}>
                  <Text style={styles.blogTitle} numberOfLines={2}>
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

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#FFF1E6" }}>
        <Header />
        <ScrollView contentContainerStyle={{ paddingBottom: -15 }}>
          <SectionHeader
            title="CLB nổi bật"
            onPressAll={() => navigation.navigate("Club", { screen: "ClubNo" })}
          />
          <GridClubList
            data={data}
            onPressItem={async (clubId) => {
              const matched = myClubRoles.find(
                (role) => role.clubId === clubId
              );

              const token = await AsyncStorage.getItem("jwt");
              try {
                const response = await fetchBaseResponse(
                  `/api/memberships/status?clubId=${clubId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );

                const isMember = response.data;

                if (
                  isMember === "APPROVED" ||
                  (isMember === null &&
                    ["CLUBLEADER", "MEMBER"].includes(matched?.role))
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
              } catch (error) {
                console.error("Failed to check membership status:", error);
                Alert.alert(
                  "Lỗi",
                  "Bạn phải đăng nhập mới đăng ký được câu lạc bộ"
                );
              }
            }}
          />

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
    </>
  );
};

const styles = StyleSheet.create({
  eventInfoText: {
    fontSize: 13,
    color: "#6b7280"
  },
  blogInfoText: {
    fontSize: 13,
    color: "#6b7280"
  }
});

export default Homepage;
