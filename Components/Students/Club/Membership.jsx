import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";

export default function Membership({ route, navigation }) {
  const { clubId } = route.params;
  const [members, setMembers] = React.useState([]);
  const [clubRoles, setClubRoles] = React.useState([]);
  const [userEmail, setUserEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      const email = await AsyncStorage.getItem("email");
      setUserEmail(email);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      try {
        const [membersRes, rolesRes] = await Promise.all([
          fetchBaseResponse(`/api/clubs/${clubId}/members`, { headers }),
          fetchBaseResponse(`/api/clubs/my-club-roles`, { headers })
        ]);

        if (membersRes.status === 200 && Array.isArray(membersRes.data)) {
          setMembers(membersRes.data);
        } else {
          throw new Error("Lỗi khi lấy danh sách thành viên.");
        }

        if (rolesRes.status === 200 && Array.isArray(rolesRes.data)) {
          setClubRoles(rolesRes.data);
        } else {
          throw new Error("Lỗi khi lấy vai trò của người dùng.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        Alert.alert("Lỗi", "Không lấy được dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clubId]);

  const isCurrentUserLeader = clubRoles.some(
    (role) => role.clubId === clubId && role.role === "CLUBLEADER"
  );

  const filteredMembers = isCurrentUserLeader
    ? members.filter((m) => m.email !== userEmail)
    : members;

  const formatAcademicYear = (year) => {
    switch (year) {
      case "YEAR_ONE":
        return "Năm nhất";
      case "YEAR_TWO":
        return "Năm hai";
      case "YEAR_THREE":
        return "Năm ba";
      case "YEAR_FOUR":
        return "Năm tư";
      default:
        return "Khác";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877f2" />
        <Text style={styles.loadingText}>Đang tải danh sách thành viên...</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Thành viên câu lạc bộ</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.userId?.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có thành viên nào.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Club", {
                  screen: "ClubGroupId",
                  params: {
                    clubId: clubId,
                    userId: item.userId
                  }
                })
              }
            >
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(item.fullName || "U").charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.infoText}>
                      📚 Mã SV: {item.studentCode}
                    </Text>
                    {item.email && (
                      <Text style={styles.infoText}>
                        ✉️ Email: {item.email}
                      </Text>
                    )}
                    <Text style={styles.infoText}>
                      🎓 Năm học: {formatAcademicYear(item.academicYear)}
                    </Text>
                    <Text style={styles.infoText}>
                      Tên ngành: {item.majorName}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 30
  },
  backText: {
    fontSize: 16,
    color: "#1a73e8",
    fontWeight: "600"
  },

  container: {
    flex: 1,
    backgroundColor: "#f2f4f7"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: 10,
    color: "#888"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#1c1c1e"
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#d0e2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  avatarText: {
    color: "#1a73e8",
    fontWeight: "bold",
    fontSize: 18
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  infoText: {
    color: "#555",
    fontSize: 13,
    marginTop: 2
  }
});
