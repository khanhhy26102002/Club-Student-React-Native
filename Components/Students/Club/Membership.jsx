import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClubMembersScreen({ navigation, route }) {
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
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#050505" />
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Thành viên câu lạc bộ</Text>
        </View>

        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.userId?.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có thành viên nào.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.clubId}
              onPress={() =>
                navigation.navigate("Club", {
                  screen: "ClubGroupId",
                  params: {
                    clubId: clubId,
                    userId: item.userId
                  }
                })
              }
              activeOpacity={0.85}
            >
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {(item.fullName || "U").charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.infoText}>
                      📚 Mã SV: {item.studentCode}
                    </Text>
                    {item.email && (
                      <Text style={styles.infoText}>✉️ {item.email}</Text>
                    )}
                    <Text style={styles.infoText}>
                      🎓 Năm học: {formatAcademicYear(item.academicYear)}
                    </Text>
                    <Text style={styles.infoText}>
                      🏫 Ngành: {item.majorName}
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
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 12
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#050505"
  },
  backText: {
    color: "#1877f2",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6
  },
  listContainer: {
    paddingBottom: 20
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#65676b",
    fontSize: 16
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#dfe3ee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1c1e21"
  },
  infoContainer: {
    flex: 1
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#050505",
    marginBottom: 4
  },
  infoText: {
    color: "#65676b",
    fontSize: 14
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#1877f2"
  }
});
