import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({ data, navigation, isLeader, onDelete }) {
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
        params: { blogId: data.blogId, clubId: data.clubId }
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
                if (onDelete) await onDelete();
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
        width: screenWidth,
        marginBottom: 12,
        backgroundColor: "#f9fafb",
        marginLeft: -15
      }}
    >
      {/* === Nội dung lên đầu === */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        {/* Tag */}
        <View
          style={{
            backgroundColor: isEvent ? "#e0f2fe" : "#fff7ed",
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 8
          }}
        >
          <Text
            style={{
              color: isEvent ? "#0284c7" : "#d97706",
              fontSize: 12,
              fontWeight: "600"
            }}
          >
            {isEvent ? "📅 Sự kiện" : "📝 Blog"}
          </Text>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 6,
            color: "#111827"
          }}
          numberOfLines={2}
        >
          {data.title}
        </Text>

        {/* Sub info */}
        {isEvent ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#374151", marginRight: 6 }}>
              📍 {data.location}
            </Text>
            <Icon name="clock" size={14} color="#6b7280" />
            <Text style={{ color: "#6b7280", marginLeft: 4 }}>
              {new Date(data.eventDate).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#4b5563", marginBottom: 6, fontSize: 14 }}>
            ✍️ {data.authorName} ·{" "}
            <Text style={{ color: "#6b7280" }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </Text>
          </Text>
        )}

        {/* Buttons */}
        {isEvent && (
          <>
            <TouchableOpacity
              style={{
                marginTop: 12,
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
                backgroundColor: "#10b981",
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

        {/* Admin Buttons */}
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
              <Text style={{ color: "#fff", fontWeight: "600" }}>🗑️ Xoá</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* === Hình ở cuối === */}
      {data.thumbnailUrl && (
        <Image
          source={{ uri: data.thumbnailUrl }}
          style={{ width: "100%", height: 220 }}
          resizeMode="cover"
        />
      )}

      {/* Danh sách ảnh nhỏ */}
      {Array.isArray(data.imageUrls) && data.imageUrls.length > 0 && (
        <FlatList
          data={data.imageUrls}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, index) => uri + index}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{
                width: 450,
                height: 180,
                margin: 10,
                marginLeft: -10
              }}
              resizeMode="cover"
            />
          )}
        />
      )}
    </TouchableOpacity>
  );
}
