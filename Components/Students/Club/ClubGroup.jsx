import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { useRoute } from "@react-navigation/native";

const ClubGroup = ({ navigation }) => {
  const route = useRoute();
  const { clubId } = route.params;
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    if (!clubId) return;

    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/api/clubs/${clubId}/members`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 200) {
          setMembers(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        const { status, message } = error.response?.data || {};
        if (status === 2004) {
          Alert.alert("Từ chối", "Bạn không có quyền truy cập câu lạc bộ này");
        } else {
          Alert.alert("Lỗi", message || "Đã xảy ra lỗi không xác định");
        }
      }
    };
    fetchData();
  }, [clubId]);

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>👥 Danh sách thành viên CLB</Text>

          {members.length === 0 ? (
            <Text style={styles.noData}>Không có thành viên nào.</Text>
          ) : (
            members.map((member, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Club", {
                    screen: "ClubGroupId",
                    params: {
                      clubId: clubId,
                      userId: member.userId 
                    }
                  })
                }
                style={styles.card}
              >
                <View style={styles.row}>
                  <Text style={styles.label}>👤 Họ tên:</Text>
                  <Text style={styles.value}>{member.fullName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>📧 Email:</Text>
                  <Text style={styles.value}>{member.email}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>🎓 Niên khóa:</Text>
                  <Text style={styles.value}>{member.academicYear}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>💻 Ngành:</Text>
                  <Text style={styles.value}>{member.majorName}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>🆔 MSSV:</Text>
                  <Text style={styles.value}>{member.studentCode}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ClubGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e8f0"
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#0f172a"
  },
  noData: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 40
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center"
  },
  label: {
    fontWeight: "600",
    fontSize: 15,
    color: "#1e293b",
    width: 110
  },
  value: {
    fontSize: 15,
    color: "#334155",
    flexShrink: 1
  }
});
