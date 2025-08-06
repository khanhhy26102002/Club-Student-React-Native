import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";

const ClubMembership = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [approvingId, setApprovingId] = React.useState(null);
  const [rejectId, setRejectId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(`/api/memberships`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        // Lọc thành viên có status PENDING
        const pending = response.data.filter(
          (member) => member.status === "PENDING"
        );
        setData(pending);
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("Lỗi", "Không fetch ra được data theo membership");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (membershipId) => {
    setApprovingId(membershipId);
    const token = await AsyncStorage.getItem("jwt");
    try {
      await fetchBaseResponse(`/api/memberships/approve/${membershipId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      Alert.alert("✅ Thành công", "Thành viên đã được duyệt");
      fetchData(); // Reload danh sách sau khi duyệt
    } catch (error) {
      console.error("Lỗi duyệt:", error);
      Alert.alert("❌ Lỗi", "Lỗi kết nối khi duyệt thành viên");
    } finally {
      setApprovingId(null);
    }
  };
  const handleReject = async (membershipId) => {
    setRejectId(membershipId);
    const token = await AsyncStorage.getItem("jwt");
    try {
      await fetchBaseResponse(`/api/memberships/reject/${membershipId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      Alert.alert("✅ Thành công", "Thành viên đã được từ chối");
      fetchData(); // Reload danh sách sau khi duyệt
    } catch (error) {
      console.error("Lỗi từ chối:", error);
      Alert.alert("❌ Lỗi", "Lỗi kết nối khi từ chối thành viên");
    } finally {
      setRejectId(null);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.memberItem}>
      <View>
        <Text style={styles.name}>{item.userFullName || "Chưa có tên"}</Text>
        <Text style={styles.email}>
          {new Date(item.joinDate).toLocaleString("vi-VN")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleApprove(item.membershipId)}
        disabled={approvingId === item.membershipId}
        style={styles.approveButton}
      >
        <Text style={styles.approveText}>
          {approvingId === item.membershipId ? "Đang duyệt..." : "Duyệt"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReject(item.membershipId)}
        disabled={rejectId === item.membershipId}
        style={styles.rejectButton}
      >
        <Text style={styles.rejectText}>
          {rejectId === item.membershipId ? "Đang từ chối..." : "Từ chối"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Header />
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={24} color="#1877f2" />
          <Text style={{ marginLeft: 6, color: "#1877f2", fontWeight: "bold" }}>
            Quay lại
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Danh sách thành viên chờ duyệt</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1877f2" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.membershipId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Không có thành viên chờ duyệt.
              </Text>
            }
          />
        )}
      </View>
    </>
  );
};

export default ClubMembership;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  name: {
    fontSize: 16,
    fontWeight: "500"
  },
  email: {
    color: "#666"
  },
  approveButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  approveText: {
    color: "#fff",
    fontWeight: "bold"
  },
  rejectButton: {
    backgroundColor: "#ef4444", // đỏ
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8
  },
  rejectText: {
    color: "#fff",
    fontWeight: "bold"
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20
  }
});
