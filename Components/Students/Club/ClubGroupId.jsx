import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const ClubGroupId = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const route = useRoute();
  const { clubId, userId } = route.params;
  const [clubRole, setClubRole] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/api/clubs/${clubId}/members/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        const statusError = error.response?.data?.status;
        const message =
          error.response?.data?.message || "Đã xảy ra lỗi không xác định";

        if (statusError === 2004) {
          Alert.alert("Lỗi", "Bạn không có quyền để vô câu lạc bộ này!");
        } else {
          Alert.alert("Lỗi", message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId, userId]);
  React.useEffect(() => {
    const fetchRoles = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse("/api/clubs/my-club-roles", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          const roles = response.data;
          const matched = roles.find(
            (item) => item.clubId === clubId && item.userId === userId
          );
          setClubRole(matched?.roleName || null);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API role:", error.message);
      }
    };

    if (data) {
      fetchRoles();
    }
  }, [data]);

  if (loading) {
    return (
      <>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f172a" />
        </View>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.noData}>
            Không tìm thấy thông tin thành viên.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Quay về</Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#f1f5f9", marginTop: 20 }}
      >
        {/* Cover + Avatar */}
        <View>
          <Image
            source={{ uri: "https://source.unsplash.com/800x400/?club" }}
            style={styles.coverImage}
          />
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=16" }}
                style={styles.avatar}
              />
            </View>
          </View>
        </View>

        {/* Tên & Email */}
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={styles.name}>{data.fullName}</Text>
          <Text style={styles.email}>{data.email}</Text>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.infoCard}>
          {[
            { icon: "🎓", label: "Niên khóa", value: data.academicYear },
            { icon: "💻", label: "Ngành học", value: data.majorName },
            { icon: "🆔", label: "Mã sinh viên", value: data.studentCode },
            {
              icon: "⭐",
              label: "Vai trò",
              value: clubRole || data.role || "Thành viên"
            }
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                index !== 3 && styles.infoRowBorder // không border dòng cuối
              ]}
            >
              <View style={styles.labelBox}>
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
              <Text
                style={[
                  styles.infoValue,
                  item.label === "Vai trò" && styles.roleText // tô đậm vai trò
                ]}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default ClubGroupId;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc"
  },
  noData: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center"
  },
  coverImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#ccc"
  },
  avatarWrapper: {
    alignItems: "center",
    marginTop: -50
  },
  avatarBorder: {
    borderWidth: 3,
    borderColor: "#3b82f6",
    borderRadius: 60,
    padding: 3,
    backgroundColor: "#fff"
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a"
  },
  email: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  actionButton: {
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  actionText: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "600"
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 16
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderColor: "#e2e8f0"
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    fontSize: 16,
    marginRight: 8
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155"
  },
  infoValue: {
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500"
  },
  roleText: {
    color: "#0f766e",
    fontWeight: "700"
  },
  backButton: {
    marginTop: 12,
    marginLeft: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    alignSelf: "flex-start"
  },
  backText: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "600"
  }
});
