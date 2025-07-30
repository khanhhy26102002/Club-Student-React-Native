import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({ data, navigation, isLeader }) {
  const isEvent = data.type === "event";

  const handlePress = () => {
    if (isEvent) {
      navigation.navigate("Event", {
        screen: "EventRoles",
        params: { eventId: data.eventId }
      });
    } else {
      navigation.navigate("Club", {
        screen: "BlogDetail",
        params: { blogId: data.blogId }
      });
    }
  };

  const handleAssignRole = () => {
    navigation.navigate("Event", {
      screen: "EventAssign",
      params: { eventId: data.eventId, title: data.title }
    });
  };

  const handleUpdate = () => {
    if (isEvent) {
      navigation.navigate("Event", {
        screen: "UpdateEvent",
        params: { eventId: data.eventId }
      });
    } else {
      navigation.navigate("Club", {
        screen: "UpdateBlog",
        params: { blogId: data.blogId }
      });
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xoá ${isEvent ? "sự kiện" : "blog"} này không?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("jwt");
              const headers = { Authorization: `Bearer ${token}` };
              const endpoint = isEvent
                ? `/api/events/${data.eventId}`
                : `/api/blogs/${data.blogId}`;
              const res = await fetchBaseResponse(endpoint, {
                method: "DELETE",
                headers
              });
              if (res.status === 200) {
                Alert.alert("Thành công", "Đã xoá thành công.");
              } else {
                throw new Error("Xoá thất bại");
              }
            } catch (err) {
              Alert.alert("Lỗi", err.message || "Không thể xoá.");
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#fff",
        marginVertical: 10,
        width: screenWidth,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
        marginLeft: -5
      }}
    >
      {data.image && (
        <Image
          source={{ uri: data.image }}
          style={{ width: "100%", height: 190 }}
          resizeMode="cover"
        />
      )}

      <View style={{ padding: 14 }}>
        <View
          style={{
            backgroundColor: isEvent ? "#e3f2fd" : "#fff3e0",
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 8
          }}
        >
          <Text
            style={{
              color: isEvent ? "#1e88e5" : "#ef6c00",
              fontSize: 12,
              fontWeight: "600"
            }}
          >
            {isEvent ? "📅 Sự kiện" : "📝 Blog"}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            marginBottom: 6,
            color: "#333"
          }}
          numberOfLines={2}
        >
          {data.title}
        </Text>

        {isEvent ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#555", marginRight: 4 }}>
              📍 {data.location}
            </Text>
            <Icon
              name="clock"
              size={14}
              color="#888"
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: "#888" }}>
              {new Date(data.eventDate).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#555", marginBottom: 6, fontSize: 14 }}>
            ✍️ {data.authorName}{" "}
            <Text style={{ color: "#888" }}>
              · {new Date(data.createdAt).toLocaleDateString()}
            </Text>
          </Text>
        )}

        {isEvent && (
          <>
            <TouchableOpacity
              style={{
                marginTop: 10,
                alignSelf: "flex-start",
                backgroundColor: "#1877f2",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 20
              }}
              onPress={handlePress}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                Đăng ký sự kiện
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAssignRole}
              style={{
                marginTop: 10,
                alignSelf: "flex-start",
                backgroundColor: "#43a047",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
                🛡️ Phân quyền
              </Text>
            </TouchableOpacity>
          </>
        )}

        {isLeader && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              gap: 10
            }}
          >
            <TouchableOpacity
              onPress={handleUpdate}
              style={{
                backgroundColor: "#0284c7",
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                ✏️ Cập nhật
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={{
                backgroundColor: "#dc2626",
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 10
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                🗑️ Xoá
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
