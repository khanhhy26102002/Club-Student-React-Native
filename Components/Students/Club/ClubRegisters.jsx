import {
  ActivityIndicator,
  Alert,
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
// chỗ nào có hình up lên hết
const ClubRegisters = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [membershipStatus, setMembershipStatus] = React.useState({}); // Trạng thái tham gia
  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse("/memberships", {
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
        `/memberships/status?clubId=${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Membership API data:", response.data);
      if (response.status === 200) {
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
          <Text style={styles.sectionTitle}>🎓 Câu lạc bộ bạn đã đăng kí</Text>
          <View style={styles.sectionUnderline} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          data.map((membership) => {
            const status = membershipStatus[membership.clubId];
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
              >
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <Image
                      source={{
                        uri:
                          membership.clubImage ||
                          "https://via.placeholder.com/80"
                      }}
                      style={styles.clubImage}
                    />
                    <View style={styles.clubInfo}>
                      <Text style={styles.clubName}>{membership.clubName}</Text>
                      <Text style={styles.joinDate}>
                        ID: {membership.membershipId}
                      </Text>
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
                        <Text style={styles.statusText}>❌ Bị từ chối</Text>
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
  // ... giữ nguyên styles cũ
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  clubImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: "#E5E7EB"
  },
  clubInfo: {
    flex: 1
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A"
  },
  joinDate: {
    fontSize: 14,
    color: "#6B7280"
  },
  statusContainer: {
    alignItems: "flex-end"
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

const markdownStyles = {
  body: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textAlign: "center" // canh giữa văn bản
  },
  heading2: {
    fontSize: 17,
    color: "#111827",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center"
  },
  heading3: {
    fontSize: 16,
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "600",
    textAlign: "center"
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "center"
  },
  list_item_content: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center"
  }
};
