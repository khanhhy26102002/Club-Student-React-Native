import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const ClubGroupId = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const route = useRoute();
  const params = route.params;
  const { clubId, userId } = params;

  React.useEffect(() => {
    if (!clubId || !userId) return;

    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/clubs/${clubId}/members/${userId}`,
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

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>👤 Thông tin thành viên</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0f172a" />
        ) : data ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>🆔 Mã số sinh viên:</Text>
              <Text style={styles.value}>{data.studentCode}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>👤 Họ và tên:</Text>
              <Text style={styles.value}>{data.fullName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>📧 Email:</Text>
              <Text style={styles.value}>{data.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>🎓 Niên khóa:</Text>
              <Text style={styles.value}>{data.academicYear}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>💻 Ngành học:</Text>
              <Text style={styles.value}>{data.majorName}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noData}>Không tìm thấy thông tin thành viên.</Text>
        )}
      </ScrollView>
    </>
  );
};

export default ClubGroupId;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f1f5f9",
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#0f172a"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center"
  },
  label: {
    fontWeight: "600",
    fontSize: 15,
    color: "#1e293b",
    width: 140
  },
  value: {
    fontSize: 15,
    color: "#334155",
    flexShrink: 1
  },
  noData: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 40
  }
});
