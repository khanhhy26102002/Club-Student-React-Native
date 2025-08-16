import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  Modal,
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { stripMarkdown } from "../../../stripmarkdown";
import QRCode from "react-native-qrcode-svg";

const FORMAT_ICON = {
  OFFLINE: "https://img.icons8.com/color/96/000000/conference.png",
  ONLINE: "https://img.icons8.com/color/96/000000/laptop.png"
};

const TYPE_COLOR = {
  OFFLINE: "#f57c00",
  ONLINE: "#f57c00"
};

export default function EventDetail({ route }) {
  const { eventId } = route.params;
  const navigation = useNavigation();
  console.log("EventId", eventId);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [myRegistration, setMyRegistration] = useState(null);

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("jwt");

        const publicRes = await fetchBaseResponse(
          `/api/events/public/${eventId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );
        if (publicRes.status !== 200) {
          Alert.alert("Thông báo", "Không tìm thấy sự kiện.");
          setData(null);
          return;
        }

        let roleName = null;
        try {
          const myRes = await fetchBaseResponse(
            `/api/event-roles/my/${eventId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (myRes.status === 200) {
            roleName = myRes.data.roleName;
          }
        } catch (err) {
          console.log("Không lấy được role cho sự kiện", err);
        }

        try {
          const qrRes = await fetchBaseResponse(
            `/api/registrations/myqr?eventId=${eventId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (qrRes.status === 200) {
            setMyRegistration({ qrCode: qrRes.data });
          }
        } catch (err) {
          console.log("Không lấy được QR/đăng ký event", err);
        }

        const mergedData = { ...publicRes.data, roleName };
        setData(mergedData);
      } catch (error) {
        Alert.alert("Lỗi", "Không lấy được event theo id");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy sự kiện nào.</Text>
      </View>
    );
  }

  const formattedDate = new Date(data.eventDate).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const coverImg = FORMAT_ICON[data.format] || FORMAT_ICON.OFFLINE;
  const color = TYPE_COLOR[data.format] || TYPE_COLOR.OFFLINE;

  const handleSubmitFeedback = async () => {
    if (!rating) {
      Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá");
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: { eventId, rating, comments }
      });

      console.log("Res", res.data);

      // Xử lý lỗi Event chưa hoàn tất
      if (res.status === 9001 || res.error === "EVENT_NOT_COMPLETED") {
        Alert.alert("Lỗi", "Sự kiện chưa hoàn tất, không thể gửi feedback.");
        return;
      }

      if (res.status === 200) {
        Alert.alert("Thành công", "Cảm ơn bạn đã gửi feedback!");
        setRating(0);
        setComments("");
      } else {
        Alert.alert("Lỗi", res.message || "Không gửi được feedback");
      }
    } catch (err) {
      console.error(err);
      if (err.message === "Event not completed") {
        Alert.alert("Lỗi", "Sự kiện chưa diễn ra nên bạn chưa đánh giá được");
      }
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff8f1" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: -40 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>

          <View style={[styles.bannerWrap, { backgroundColor: color + "22" }]}>
            <Image source={{ uri: coverImg }} style={styles.bannerImg} />
          </View>

          <View style={styles.tagRow}>
            <View style={[styles.typeTag, { backgroundColor: color }]}>
              <Text style={styles.typeTagText}>{data.format || "OFFLINE"}</Text>
            </View>
            {data.eventType && (
              <View style={styles.typeTag2}>
                <Text style={styles.typeTagText2}>{data.eventType}</Text>
              </View>
            )}
            {data.roleName && (
              <View style={styles.roleTag}>
                <Text style={styles.roleTagText}>Vai trò: {data.roleName}</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{data.title}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>🗓 Thời gian</Text>
            <Text style={styles.infoVal}>{formattedDate}</Text>
            <Text style={styles.infoLabel}>📍 Địa điểm</Text>
            <Text style={styles.infoVal}>{data.location}</Text>
          </View>

          <Text style={styles.descLabel}>Mô tả sự kiện</Text>
          <Text style={styles.descText}>
            {stripMarkdown(data.description) || "(Không có mô tả)"}
          </Text>

          {data.projectFileUrl && (
            <TouchableOpacity
              style={styles.fileBtn}
              activeOpacity={0.82}
              onPress={() => Linking.openURL(data.projectFileUrl)}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/color/48/000000/pdf.png"
                }}
                style={{ width: 28, height: 28, marginRight: 9 }}
              />
              <Text style={styles.fileBtnText}>Tải file đính kèm</Text>
            </TouchableOpacity>
          )}

          {data.roleName === "ORGANIZER" && (
            <TouchableOpacity
              style={[styles.joinBtn, { backgroundColor: "#388e3c" }]}
              onPress={() => {
                navigation.navigate("Event", {
                  screen: "EventRoles",
                  params: { eventId: data.eventId }
                });
              }}
            >
              <Text style={styles.joinBtnText}>Quản lý sự kiện</Text>
            </TouchableOpacity>
          )}

          {myRegistration ? (
            <View style={styles.registeredStatusBox}>
              <Text style={styles.registeredStatusText}>
                Bạn đã đăng ký sự kiện này.
              </Text>
              <TouchableOpacity
                style={styles.qrBtn}
                onPress={() => {
                  if (!myRegistration?.qrCode) {
                    Alert.alert("Chưa có mã QR");
                    return;
                  }
                  setModalVisible(true);
                }}
              >
                <Ionicons name="qr-code" size={28} color="#f57c00" />
                <Text style={styles.qrBtnText}>Xem mã QR checkin</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={() => {
                navigation.navigate("Event", {
                  screen: "EventRegistration",
                  params: {
                    eventId: data.eventId,
                    title: data.title
                  }
                });
              }}
            >
              <Text style={styles.joinBtnText}>Đăng ký</Text>
            </TouchableOpacity>
          )}

          {myRegistration && (
            <View
              style={{ marginHorizontal: 23, marginTop: 20, marginBottom: 30 }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}
              >
                Đánh giá sự kiện
              </Text>

              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                      name={rating >= star ? "star" : "star-outline"}
                      size={28}
                      color="#f57c00"
                      style={{ marginRight: 6 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                value={comments}
                onChangeText={setComments}
                placeholder="Nhập bình luận..."
                multiline
                style={styles.commentInput}
              />

              <TouchableOpacity
                onPress={handleSubmitFeedback}
                disabled={feedbackSubmitting}
                style={styles.feedbackBtn}
              >
                <Text style={styles.feedbackBtnText}>
                  {feedbackSubmitting ? "Đang gửi..." : "Gửi feedback"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Mã QR Checkin</Text>
                {myRegistration && myRegistration.qrCode ? (
                  <QRCode
                    value={myRegistration.qrCode}
                    size={200}
                    color="#000"
                    backgroundColor="#fff"
                  />
                ) : (
                  <Text>Không có mã QR</Text>
                )}
                <Text style={styles.modalText}>
                  Vui lòng dùng mã QR để checkin, trạng thái: Đã đăng ký
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseBtn}
                >
                  <Text style={styles.modalCloseBtnText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8f1"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8f1"
  },
  errorText: { color: "#e55", fontSize: 16, fontWeight: "bold" },

  bannerWrap: { width: "100%", height: 220, marginBottom: 16 },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? 10 : 20,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff8f1cc",
    padding: 8,
    borderRadius: 30
  },
  bannerImg: { width: "100%", height: "100%", resizeMode: "cover" },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 23,
    marginTop: 20,
    marginBottom: 11,
    gap: 13,
    flexWrap: "wrap"
  },
  typeTag: {
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 13,
    alignSelf: "flex-start"
  },
  typeTagText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14.5,
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  typeTag2: {
    backgroundColor: "#fff3e0",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 8
  },
  typeTagText2: {
    color: "#f57c00",
    fontWeight: "bold",
    fontSize: 13.5,
    letterSpacing: 0.3
  },
  roleTag: {
    backgroundColor: "#ffe8d0",
    borderRadius: 9,
    paddingVertical: 4,
    paddingHorizontal: 11,
    marginLeft: 8
  },
  roleTagText: { color: "#ef6c00", fontWeight: "bold", fontSize: 13 },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#bf360c",
    marginHorizontal: 23,
    marginTop: 3,
    marginBottom: 14,
    lineHeight: 27
  },
  infoBox: {
    backgroundColor: "#fff3e0",
    borderRadius: 14,
    marginHorizontal: 19,
    padding: 16,
    marginBottom: 14
  },
  infoLabel: {
    color: "#ef6c00",
    fontWeight: "bold",
    fontSize: 13.8,
    marginTop: 2
  },
  infoVal: { color: "#4e342e", fontSize: 15, marginBottom: 5, marginLeft: 3 },

  descLabel: {
    fontWeight: "700",
    color: "#f57c00",
    fontSize: 16,
    marginHorizontal: 23,
    marginBottom: 2,
    marginTop: 15
  },
  descText: {
    color: "#6d4c41",
    fontSize: 14.3,
    lineHeight: 20,
    marginHorizontal: 23,
    marginBottom: 16,
    fontWeight: "400"
  },

  fileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    marginHorizontal: 24,
    borderRadius: 13,
    padding: 11,
    marginTop: 8,
    marginBottom: 13,
    shadowColor: "#ffa726",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2
  },
  fileBtnText: { fontSize: 15, color: "#bf360c", fontWeight: "600" },

  joinBtn: {
    backgroundColor: "#f57c00",
    marginHorizontal: 23,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10
  },
  joinBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  registeredStatusBox: {
    marginHorizontal: 23,
    marginTop: 10,
    padding: 16,
    backgroundColor: "#fff3e0",
    borderRadius: 14,
    alignItems: "center"
  },
  registeredStatusText: { fontSize: 15, color: "#4e342e", marginBottom: 10 },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe8d0",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  qrBtnText: { color: "#ef6c00", fontWeight: "600", marginLeft: 8 },

  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    marginBottom: 12
  },
  feedbackBtn: {
    backgroundColor: "#f57c00",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20
  },
  feedbackBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "85%"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#bf360c"
  },
  modalText: {
    fontSize: 14,
    color: "#4e342e",
    marginTop: 12,
    textAlign: "center"
  },
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: "#f57c00",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  modalCloseBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
