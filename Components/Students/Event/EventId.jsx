import React, { useEffect, useState } from "react";
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
  Linking
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { useNavigation } from "@react-navigation/native";
// import fetchBaseResponse từ service của bạn
import Icon from "react-native-vector-icons/Ionicons"; // hoặc Feather, MaterialIcons, etc.
import { Ionicons } from "@expo/vector-icons";
const FORMAT_ICON = {
  OFFLINE: "https://img.icons8.com/color/96/000000/conference.png",
  ONLINE: "https://img.icons8.com/color/96/000000/laptop.png"
};

const TYPE_COLOR = {
  OFFLINE: "#f57c00", // cam đậm
  ONLINE: "#f57c00"
};

export default function EventDetail({ route }) {
  // Nhận eventId từ navigation param
  const { eventId } = route.params;
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy public event
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
        console.log("Response:", publicRes.data);
        let roleName = null;
        const token = await AsyncStorage.getItem("jwt");
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
          // Không làm gì nếu lỗi, roleName sẽ là null
          console.log("Không lấy được role cho sự kiện", err);
        }
        const mergedData = { ...publicRes.data, roleName };
        setData(mergedData);
      } catch (error) {
        Alert.alert("Lỗi", "Không lấy được event theo id");
        console.error("📦 fetch error: ", error);
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

  // Định dạng ngày tiếng Việt
  const formattedDate = new Date(data.eventDate).toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Chọn icon/màu theo format
  const coverImg = FORMAT_ICON[data.format] || FORMAT_ICON.OFFLINE;
  const color = TYPE_COLOR[data.format] || TYPE_COLOR.OFFLINE;

  return (
    <>
      <Header />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff8f1" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 36 }}
        >
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
            {data.description || "(Không có mô tả)"}
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

          <TouchableOpacity
            style={[
              styles.joinBtn,
              {
                backgroundColor: data.roleName === "ORGANIZER" ? "#388e3c" : ""
              }
            ]}
            onPress={() => {
              if (data.roleName === "ORGANIZER") {
                navigation.navigate("Event", {
                  screen: "EventRoles",
                  params: {
                    eventId: data.eventId
                  }
                });
              } else {
                navigation.navigate("Event", {
                  screen: "EventRegistration",
                  params: {
                    eventId: data.eventId,
                    title: data.title
                  }
                });
              }
            }}
          >
            <Text style={styles.joinBtnText}>
              {data.roleName === "ORGANIZER" ? "Quản lý sự kiện" : "Đăng ký"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
// thêm text là vui lòng dùng mã qr để checkin, status đã đăng ký
// hiện popup modal
// -------- STYLES --------
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

  bannerWrap: {
    width: "100%",
    height: 220, // hoặc cao hơn tùy ý
    marginBottom: 16
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? 10 : 20,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff8f1cc",
    padding: 8,
    borderRadius: 30
  },

  bannerImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
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
  roleTagText: {
    color: "#ef6c00",
    fontWeight: "bold",
    fontSize: 13
  },
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
  infoVal: {
    color: "#4e342e",
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 3
  },
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
  fileBtnText: {
    color: "#f57c00",
    fontWeight: "bold",
    fontSize: 15.2
  },
  joinBtn: {
    marginHorizontal: 32,
    marginTop: 12,
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#f57c00",
    shadowColor: "#fb8c00",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16.5,
  }
});
