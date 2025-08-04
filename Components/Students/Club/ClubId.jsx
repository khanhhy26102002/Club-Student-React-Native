import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { stripMarkdown } from "../../../stripmarkdown";
import { Ionicons } from "@expo/vector-icons";

const ClubId = ({ navigation }) => {
  const route = useRoute();
  const { clubId } = route.params;
  const clubIdParam = Number(clubId);
  console.log("clubId param:", clubIdParam);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [fetchingRoles, setFetchingRoles] = React.useState(true);
  const [clubRole, setClubRole] = React.useState(null);
  const [hasApplied, setHasApplied] = React.useState(false);
  const [isApproved, setIsApproved] = React.useState(false);
  const fetchClubData = async () => {
    setLoading(true);
    try {
      const res = await fetchBaseResponse(`/api/clubs/public/${clubId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (res?.status === 200 && res.data) {
        setData(res.data);
      } else {
        Alert.alert("Lỗi", res?.message || "Không thể lấy dữ liệu CLB");
        setData(null);
      }
    } catch (err) {
      Alert.alert("Lỗi hệ thống", err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    const fetchDataAsync = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/api/clubs/my-club-roles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        const currentRole = response.data.find(
          (item) => item.clubId === clubIdParam
        );
        setClubRole(currentRole || {});
      } catch (error) {}
    };
    fetchDataAsync();
  }, [clubId]);
  const fetchMembershipStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse(
        `/api/memberships/status?clubId=${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const membershipStatus = res.data;
      console.log("Membership", membershipStatus);
      if (membershipStatus) {
        setHasApplied(true);
        setIsApproved(membershipStatus === "APPROVED");
        console.log("✅ membership status:", membershipStatus);
      } else {
        setHasApplied(false);
        setIsApproved(false);
      }
    } catch (error) {
      Alert.alert("Lỗi trạng thái thành viên", error.message || "Unknown");
    }
  };

  const fetchClubRole = async () => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const res = await fetchBaseResponse("/api/clubs/my-club-roles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.status === 200) {
        const currentRole = res.data.find(
          (item) => item.clubId === clubIdParam
        );
        setClubRole(currentRole || {});
      }
    } catch (err) {
      console.error("Lỗi role:", err);
    } finally {
      setFetchingRoles(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClubData(); // Public - gọi luôn
      fetchClubRole();
      const fetchProtectedData = async () => {
        const token = await AsyncStorage.getItem("jwt");

        if (!token) {
          console.log("🔒 Chưa đăng nhập, bỏ qua gọi API cần token");
          return;
        }

        fetchMembershipStatus();

        fetchEvents();
      };

      fetchProtectedData();
    }, [clubIdParam])
  );

  const handleJoin = async () => {
    const token = await AsyncStorage.getItem("jwt");
    console.log("🔐 Token hiện tại:", token);

    if (!token) {
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để tham gia CLB.", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng nhập", onPress: () => navigation.navigate("Login") }
      ]);
      return;
    }

    // Chỉ điều hướng nếu có token thật
    console.log("✅ Điều hướng đến FormRegister");
    navigation.navigate("Club", {
      screen: "FormRegister",
      params: { clubId }
    });
  };

  return (
    <>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#000" />
        <Text style={styles.backText}>Quay về</Text>
      </TouchableOpacity>
      <ScrollView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : data ? (
          <View style={styles.card}>
            <View style={styles.logoWrapper}>
              {data.logoUrl ? (
                <Image source={{ uri: data.logoUrl }} style={styles.logo} />
              ) : (
                <Text style={styles.logoFallback}>🎗️ No Logo</Text>
              )}
            </View>

            <Text style={styles.title}>{data.name}</Text>

            <Text
              style={[
                styles.status,
                { color: data.isActive ? "#10b981" : "#ef4444" }
              ]}
            >
              {data.isActive ? "🟢 Đang hoạt động" : "🔴 Ngừng hoạt động"}
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📄 Giới thiệu</Text>
              <Text style={styles.description}>
                {stripMarkdown(data.description)}
              </Text>

              <View style={{ marginTop: 16 }}>
                {fetchingRoles ? (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#e5e7eb" }]}
                  >
                    <Text style={{ color: "#374151" }}>
                      ⏳ Đang tải quyền...
                    </Text>
                  </TouchableOpacity>
                ) : clubRole?.role === "CLUBLEADER" ||
                  clubRole?.role === "MEMBER" ||
                  (hasApplied && isApproved) ? (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#3b82f6" }]}
                    onPress={() =>
                      navigation.navigate("Club", {
                        screen: "ClubGroup",
                        params: {
                          clubId: data.clubId
                        }
                      })
                    }
                  >
                    <Text style={styles.buttonText}>👥 Xem nhóm trong CLB</Text>
                  </TouchableOpacity>
                ) : hasApplied && !isApproved ? (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#facc15" }]}
                  >
                    <Text style={{ color: "#000" }}>⏳ Đang chờ duyệt</Text>
                  </TouchableOpacity>
                ) : hasApplied && isApproved ? (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#22c55e" }]}
                  >
                    <Text style={styles.buttonText}>✅ Đã tham gia</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#10b981" }]}
                    onPress={handleJoin}
                  >
                    <Text style={styles.buttonText}>➕ Tham gia CLB</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  backgroundColor: "#e0f2fe",
},
backText: {
  marginLeft: 6,
  fontSize: 16,
  color: "#000",
  fontWeight: "500"
},
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "#f0f9ff"
  },
  card: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 16
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#60a5fa"
  },
  logoFallback: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic"
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#1e3a8a",
    marginBottom: 6
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20
  },
  section: {
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827"
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151"
  },
  button: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16
  }
});

export default ClubId;
