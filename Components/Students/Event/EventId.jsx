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
// import fetchBaseResponse từ service của bạn

const FORMAT_ICON = {
  OFFLINE: "https://img.icons8.com/color/96/000000/conference.png",
  ONLINE: "https://img.icons8.com/color/96/000000/laptop.png"
};
const TYPE_COLOR = {
  OFFLINE: "#42dfa5",
  ONLINE: "#149ee2"
};

export default function EventDetail({ route }) {
  // Nhận eventId từ navigation param
  const { eventId } = route.params;

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 36 }}
        >
          {/* Banner */}
          <View style={[styles.bannerWrap, { backgroundColor: color + "22" }]}>
            <Image source={{ uri: coverImg }} style={styles.bannerImg} />
          </View>
          {/* Tag loại, eventType */}
          <View style={styles.tagRow}>
            <View style={[styles.typeTag, { backgroundColor: color }]}>
              <Text style={styles.typeTagText}>{data.format || "OFFLINE"}</Text>
            </View>
            {data.eventType ? (
              <View style={styles.typeTag2}>
                <Text style={styles.typeTagText2}>{data.eventType}</Text>
              </View>
            ) : null}
            {data.roleName ? (
              <View style={styles.roleTag}>
                <Text style={styles.roleTagText}>Vai trò: {data.roleName}</Text>
              </View>
            ) : null}
          </View>
          {/* Tiêu đề */}
          <Text style={styles.title}>{data.title}</Text>
          {/* Thông tin chính */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>🗓 Thời gian</Text>
            <Text style={styles.infoVal}>{formattedDate}</Text>
            <Text style={styles.infoLabel}>📍 Địa điểm</Text>
            <Text style={styles.infoVal}>{data.location}</Text>
          </View>
          {/* Mô tả */}
          <Text style={styles.descLabel}>Mô tả sự kiện</Text>
          <Text style={styles.descText}>
            {data.description || "(Không có mô tả)"}
          </Text>
          {/* Tệp đính kèm */}
          {data.projectFileUrl ? (
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
          ) : null}
          {/* Nút tham gia */}
          <TouchableOpacity
            style={[styles.joinBtn, { backgroundColor: color }]}
          >
            <Text style={styles.joinBtnText}>THAM GIA NGAY</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// -------- STYLES --------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc"
  },
  errorText: { color: "#e55", fontSize: 16, fontWeight: "bold" },

  bannerWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 26,
    backgroundColor: "#eaf9f3"
  },
  bannerImg: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#cdedea"
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
    backgroundColor: "#daf2fd",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginLeft: 8
  },
  typeTagText2: {
    color: "#098ddc",
    fontWeight: "bold",
    fontSize: 13.5,
    letterSpacing: 0.3
  },
  roleTag: {
    backgroundColor: "#fbeee7",
    borderRadius: 9,
    paddingVertical: 4,
    paddingHorizontal: 11,
    marginLeft: 8
  },
  roleTagText: { color: "#e18e2e", fontWeight: "bold", fontSize: 13 },

  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1e7763",
    marginHorizontal: 23,
    marginTop: 3,
    marginBottom: 14,
    lineHeight: 27
  },
  infoBox: {
    backgroundColor: "#e4f8f2",
    borderRadius: 14,
    marginHorizontal: 19,
    padding: 16,
    marginBottom: 14
  },
  infoLabel: {
    color: "#1fa285",
    fontWeight: "bold",
    fontSize: 13.8,
    marginTop: 2
  },
  infoVal: { color: "#236177", fontSize: 15, marginBottom: 5, marginLeft: 3 },
  descLabel: {
    fontWeight: "700",
    color: "#16b59c",
    fontSize: 16,
    marginHorizontal: 23,
    marginBottom: 2,
    marginTop: 15
  },
  descText: {
    color: "#4a756a",
    fontSize: 14.3,
    lineHeight: 20,
    marginHorizontal: 23,
    marginBottom: 16,
    fontWeight: "400"
  },
  fileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff8e0",
    marginHorizontal: 24,
    borderRadius: 13,
    padding: 11,
    marginTop: 8,
    marginBottom: 13,
    shadowColor: "#ddf0ca",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2
  },
  fileBtnText: { color: "#ea863e", fontWeight: "bold", fontSize: 15.2 },
  joinBtn: {
    marginHorizontal: 32,
    marginTop: 12,
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#42dfa5",
    shadowColor: "#18e7b7",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16.5,
    letterSpacing: 0.18
  }
});
