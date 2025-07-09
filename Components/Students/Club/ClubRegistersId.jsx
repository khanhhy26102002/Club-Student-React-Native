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
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const ClubRegistersId = () => {
  const route = useRoute();
  const { membershipId } = route.params;
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/memberships/${membershipId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (response.message === "Success") {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status:${response.status}`);
        }
      } catch (error) {
        console.error("Error: ", error);
        Alert.alert("Lỗi", "Không nhận được membership theo id");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [membershipId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <Header />
      <ScrollView
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🎉 Thông Tin Thành Viên</Text>

        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={24} color="#4F46E5" />
          <Text style={styles.label}>Họ tên:</Text>
          <Text style={styles.value}>{data?.userFullName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="people-outline" size={24} color="#06B6D4" />
          <Text style={styles.label}>Câu lạc bộ:</Text>
          <Text style={styles.value}>{data?.clubName}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="key-outline" size={24} color="#F59E0B" />
          <Text style={styles.label}>Mã thành viên:</Text>
          <Text style={styles.value}>#{data?.membershipId}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#22C55E" />
          <Text style={styles.label}>Trạng thái:</Text>
          <Text style={[styles.value, styles[data?.status?.toLowerCase()]]}>
            {data?.status}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={24} color="#EC4899" />
          <Text style={styles.label}>Ngày tham gia:</Text>
          <Text style={styles.value}>
            {moment(data?.joinDate).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ClubRegistersId;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    alignItems: "center",
    justifyContent: "center"
  },

  backgroundDecoration1: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 150,
    backgroundColor: "#DBEAFE",
    opacity: 0.3,
    zIndex: -1
  },
  backgroundDecoration2: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FCE7F3",
    opacity: 0.2,
    zIndex: -1
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: 24
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },

  label: {
    width: 120,
    fontWeight: "500",
    color: "#374151",
    marginLeft: 10
  },

  value: {
    flex: 1,
    fontWeight: "400",
    color: "#1F2937"
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4
  },

  approved: {
    color: "#10B981",
    fontWeight: "600"
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6"
  }
});
