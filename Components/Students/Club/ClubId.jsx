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
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);

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
  // React.useEffect(() => {
  //   const fetchDataAsync = async () => {
  //     const token = await AsyncStorage.getItem("jwt");
  //     try {
  //       const response = await fetchBaseResponse(`/api/clubs/my-club-roles`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       const currentRole = response.data.find(
  //         (item) => item.clubId === clubIdParam
  //       );
  //       setClubRole(currentRole || null);
  //     } catch (error) {}
  //   };
  //   fetchDataAsync();
  // },[clubId]);
  // const fetchMembershipStatus = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("jwt");
  //     const res = await fetchBaseResponse(
  //       `/api/memberships/status?clubId=${clubId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json"
  //         }
  //       }
  //     );
  //     const membershipStatus = res.data;
  //     console.log("Membership", membershipStatus);
  //     if (membershipStatus) {
  //       setHasApplied(true);
  //       setIsApproved(membershipStatus === "APPROVED");
  //       console.log("✅ membership status:", membershipStatus);
  //     } else {
  //       setHasApplied(false);
  //       setIsApproved(false);
  //     }
  //   } catch (error) {
  //     Alert.alert("Lỗi trạng thái thành viên", error.message || "Unknown");
  //   }
  // };

  // const fetchClubRole = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("jwt");
  //     const res = await fetchBaseResponse("/api/clubs/my-club-roles", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json"
  //       }
  //     });
  //     if (res.status === 200) {
  //       const currentRole = res.data.find(
  //         (item) => item.clubId === clubIdParam
  //       );
  //       setClubRole(currentRole || {});
  //     }
  //   } catch (err) {
  //     console.error("Lỗi role:", err);
  //   } finally {
  //     setFetchingRoles(false);
  //   }
  // };

  // const fetchEvents = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("jwt");
  //     const [pubRes, intRes] = await Promise.all([
  //       fetchBaseResponse(
  //         `/api/clubs/${clubIdParam}/events?visibility=PUBLIC`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json"
  //           }
  //         }
  //       ),
  //       fetchBaseResponse(
  //         `/api/clubs/${clubIdParam}/events?visibility=INTERNAL`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json"
  //           }
  //         }
  //       )
  //     ]);

  //     const now = new Date();
  //     const merged = [...(pubRes.data || []), ...(intRes.data || [])];
  //     const filtered = merged.filter(
  //       (e) => e.status === "APPROVED" && new Date(e.eventDate) > now
  //     );
  //     setUpcomingEvents(filtered);
  //   } catch (err) {
  //     console.error("Lỗi load sự kiện:", err);
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      fetchClubData();
      // fetchMembershipStatus();
      // fetchClubRole();
      // fetchEvents();
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
      <ScrollView contentContainerStyle={styles.container}>
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
                <Text style={styles.logoFallback}>No Logo</Text>
              )}
            </View>

            <Text style={styles.title}>{data.name}</Text>
            <Text
              style={[
                styles.status,
                { color: data.isActive ? "#10B981" : "#EF4444" }
              ]}
            >
              {data.isActive ? "🟢 Đang hoạt động" : "🔴 Ngừng hoạt động"}
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📄 Giới thiệu</Text>
              <Text>{stripMarkdown(data.description)}</Text>

              {/* <View style={{ marginTop: 12 }}>
                {fetchingRoles ? (
                  <TouchableOpacity style={styles.button}>
                    <Text>Đang tải quyền...</Text>
                  </TouchableOpacity>
                ) : clubRole?.role === "CLUBLEADER" ||
                  clubRole?.role === "MEMBER" || (hasApplied&&isApproved) ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("Club", {
                        screen: "ClubGroup",
                        params: {
                          clubId: data.clubId
                        }
                      })
                    }
                  >
                    <Text style={styles.buttonText}>🔍 Xem nhóm trong CLB</Text>
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
              </View> */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#10b981" }]}
                onPress={handleJoin}
              >
                <Text style={styles.buttonText}>➕ Tham gia CLB</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 16
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  logoFallback: {
    color: "#aaa"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4
  },
  status: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 12
  },
  section: {
    marginTop: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600"
  }
});

export default ClubId;
