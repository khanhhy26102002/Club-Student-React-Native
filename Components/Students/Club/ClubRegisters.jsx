import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";

const ClubRegisters = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [membershipStatus, setMembershipStatus] = React.useState({});

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse("/api/memberships", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusData = async (clubId) => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(
        `/api/memberships/status?clubId=${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status === 200) {
        console.log("Status response for clubId", clubId, ":", response.data);
        setMembershipStatus((prev) => ({
          ...prev,
          [clubId]: response.data
        }));
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      Alert.alert("Lỗi khi tải dữ liệu", error?.message || "Unknown error");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    data.forEach((item) => {
      console.log("clubId:", item.clubId);
      if (item.clubId) {
        statusData(item.clubId);
      }
    });
  }, [data]);

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>
            🎓 Câu lạc bộ thành viên đã đăng kí
          </Text>
          <View style={styles.sectionUnderline} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          data.map((membership) => {
            const status = membership.status;
            return (
              <TouchableOpacity
                key={membership.membershipId}
                onPress={() =>
                  navigation.navigate("Club", {
                    screen: "ClubRegisterId",
                    params: {
                      membershipId: membership.membershipId
                    }
                  })
                }
                style={styles.card}
              >
                <View style={styles.cardTop}>
                  <Image
                    source={{
                      uri:
                        membership.clubImage || "https://via.placeholder.com/80"
                    }}
                    alt="No image"
                    style={styles.clubImage}
                  />
                  <View style={styles.clubInfo}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.label}>🏫 Câu lạc bộ:</Text>
                      <Text style={styles.clubName}>{membership.clubName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>👤 Thành viên:</Text>
                      <Text style={styles.value}>
                        {membership.userFullName}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>🆔 Mã thành viên:</Text>
                      <Text style={styles.value}>
                        #{membership.membershipId}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statusContainer}>
                  {status === "APPROVED" ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Club", {
                          screen: "ClubGroup",
                          params: {
                            clubId: membership.clubId,
                            userId: membership.userId
                          }
                        })
                      }
                      style={[styles.statusBadge, styles.approved]}
                    >
                      <Text style={styles.statusText}>✅ Đã duyệt</Text>
                    </TouchableOpacity>
                  ) : status === "PENDING" ? (
                    <View style={[styles.statusBadge, styles.pending]}>
                      <Text style={styles.statusText}>⏳ Đang chờ</Text>
                    </View>
                  ) : status === "REJECTED" ? (
                    <View style={[styles.statusBadge, styles.rejected]}>
                      <Text style={styles.statusText}>❌ Từ chối</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.statusBadge, styles.register]}
                      onPress={() =>
                        navigation.navigate("Club", {
                          screen: "FormRegister",
                          params: {
                            clubId: membership.clubId
                          }
                        })
                      }
                    >
                      <Text style={styles.statusText}>📝 Tham gia</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

export default ClubRegisters;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32
  },
  sectionTitleContainer: {
    marginBottom: 16,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center"
  },
  sectionUnderline: {
    height: 5,
    width: "40%",
    backgroundColor: "#2563EB",
    marginTop: 6,
    alignSelf: "center",
    borderRadius: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center"
  },
  clubImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F3F4F6"
  },
  clubInfo: {
    flex: 1,
    justifyContent: "center"
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D4ED8", // text-blue-700
    marginBottom: 6
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2
  },
  label: {
    fontSize: 15,
    color: "#6B7280", // text-gray-500
    marginRight: 6
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827" // text-gray-900
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827"
  },
  joinDate: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4
  },
  statusContainer: {
    alignItems: "flex-end", // đã đúng
    marginTop: -32,
    flexDirection: "row",
    justifyContent: "flex-end" // đẩy badge về bên phải
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  statusText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff"
  },
  approved: {
    backgroundColor: "#10B981"
  },
  pending: {
    backgroundColor: "#F59E0B"
  },
  rejected: {
    backgroundColor: "#EF4444"
  },
  register: {
    backgroundColor: "#3B82F6"
  }
});
