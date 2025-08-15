import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  StyleSheet,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import QRCode from "react-native-qrcode-svg";
import { stripMarkdown } from "../../../stripmarkdown";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({
  data,
  navigation,
  isLeader,
  onDelete,
  clubId,
  isOrganizer,
  registeredEvents = []
}) {
  const isEvent = data.type === "event";

  const [isRegistered, setIsRegistered] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (isEvent && registeredEvents.length > 0) {
      const registered = registeredEvents.some(
        (reg) =>
          Number(reg.eventId) === Number(data.eventId) &&
          reg.paymentStatus === "COMPLETED"
      );
      setIsRegistered(registered);
    } else {
      setIsRegistered(false);
    }
  }, [registeredEvents, data.eventId, isEvent]);

  const onShowQr = () => {
    setQrValue(`EventID:${data.eventId}`);
    setShowQrModal(true);
  };

  const handlePress = () => {
    if (isEvent) {
      navigation.navigate("Club", {
        screen: "ClubDetailEvent",
        params: {
          eventId: data.eventId
        }
      });
    } else {
      navigation.navigate("Club", {
        screen: "BlogDetail", // hoặc tên màn blog detail bạn đang dùng
        params: {
          blogId: data.blogId
        }
      });
    }
  };

  const handleAssignRole = () => {
    navigation.navigate("Event", {
      screen: "EventAssign",
      params: { eventId: data.eventId, title: data.title, clubId }
    });
  };

  const handleUpdate = () => {
    if (isEvent) {
      navigation.navigate("Event", {
        screen: "EventUpdate",
        params: { eventId: data.eventId }
      });
    } else {
      navigation.navigate("Club", {
        screen: "FormBlog",
        params: { blogId: data.blogId }
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa bài viết này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("jwt");
              const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              };

              const url = isEvent
                ? `/api/events/${data.eventId}`
                : `/api/blogs/${data.blogId}`;

              const res = await fetchBaseResponse(url, {
                method: "DELETE",
                headers
              });

              if (res.status === 200) {
                Alert.alert("Thành công", "Xóa thành công.");
                onDelete();
              } else {
                Alert.alert("Lỗi", "Không thể xóa bài viết.");
              }
            } catch (error) {
              Alert.alert("Lỗi", "Có lỗi xảy ra.");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  // Xử lý ảnh blog
  const blogImage =
    data.thumbnailUrl ||
    (data.imageUrls && data.imageUrls.length > 0 && data.imageUrls[0]) ||
    "https://via.placeholder.com/400x200?text=No+Image";

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          marginBottom: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
          width: 410,
          marginLeft: -12,
          height: 210
        }}
      >
        <View style={{ padding: 16 }}>
          {!isEvent && (
            <Image
              source={{ uri: blogImage }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 12,
                marginBottom: 12,
                backgroundColor: "#e5e7eb"
              }}
              resizeMode="cover"
            />
          )}

          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 6,
              color: "#111827"
            }}
            numberOfLines={2}
          >
            {data.title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#6b7280",
              marginBottom: 12,
              height: 38,
              lineHeight: 19
            }}
            numberOfLines={2}
          >
            {stripMarkdown(data.description)}
          </Text>

          {/* Nếu event, show ngày */}
          {isEvent && (
            <Text style={{ color: "#2563eb", fontWeight: "600" }}>
              Ngày diễn ra: {new Date(data.eventDate).toLocaleDateString()}
            </Text>
          )}

          {/* Hiện nút đăng ký sự kiện nếu là event, đã join club, và chưa đăng ký */}
          {isEvent && !isRegistered && !isOrganizer && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "EventRegistration",
                  params: { eventId: data.eventId, title: data.title }
                })
              }
              style={{
                marginTop: 10,
                backgroundColor: "#2563eb",
                paddingVertical: 8,
                borderRadius: 6,
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Đăng ký sự kiện
              </Text>
            </TouchableOpacity>
          )}

          {/* Nút phân quyền nếu là event và isOrganizer */}
          {isEvent && isOrganizer && (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                onPress={handleAssignRole}
                style={{
                  backgroundColor: "#f97316",
                  paddingVertical: 8,
                  borderRadius: 6,
                  alignItems: "center",
                  width: 150
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Phân quyền sự kiện
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Event", {
                    screen: "EventTaskView",
                    params: { eventId: data.eventId }
                  })
                }
                style={{
                  backgroundColor: "#f97316",
                  paddingVertical: 8,
                  borderRadius: 6,
                  alignItems: "center",
                  width: 150
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Quản lí task
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isEvent && isOrganizer && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "EventRoles",
                  params: {
                    eventId: data.eventId,
                    clubId: clubId
                  }
                })
              }
              style={{
                marginTop: 12,
                backgroundColor: "#f97316",
                paddingVertical: 8,
                borderRadius: 6,
                alignItems: "center",
                width: 150
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Chủ quyền sự kiện
              </Text>
            </TouchableOpacity>
          )}
          {/* Nút sửa/xóa nếu là leader */}
          {/* {isLeader && (
            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10
              }}
            >
              <TouchableOpacity onPress={handleUpdate}>
                <Icon name="edit-2" size={22} color="#2563eb" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Icon name="trash" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )} */}
        </View>

        {/* Modal QR code */}
        <Modal
          visible={showQrModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowQrModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  marginBottom: 20,
                  textAlign: "center"
                }}
              >
                Mã QR vé sự kiện
              </Text>
              <QRCode value={qrValue} size={200} />

              <TouchableOpacity
                onPress={() => setShowQrModal(false)}
                style={styles.closeButton}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    width: screenWidth * 0.8
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12
  }
});
