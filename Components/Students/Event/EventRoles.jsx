import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const EventRoles = () => {
  const route = useRoute();
  const { eventId, clubId } = route.params;
  console.log("ClubId", clubId);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(
          `/api/event-roles/event/${eventId}`,
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
        } else if (response.status === 1002) {
          Alert.alert(
            "Thông báo",
            "Bạn chưa được phân vai trò nào trong sự kiện này."
          );
        } else if (response.status === 403) {
          Alert.alert(
            "🚫 Không có quyền",
            "Bạn không có quyền truy cập sự kiện này."
          );
        } else if (response.status === 404) {
          Alert.alert("❌ Không tìm thấy", "Không tìm thấy vai trò sự kiện.");
        } else {
          throw new Error(`Lỗi không xác định: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Lỗi lấy vai trò sự kiện:", error);
        Alert.alert("Lỗi", "Không thể tải vai trò sự kiện.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{
            uri:
              item?.avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item?.userFullName}</Text>
          <Text style={styles.role}>🔖 Vai trò: {item?.roleName}</Text>
          <Text style={styles.date}>
            🕓 Ngày phân công:{" "}
            {new Date(item?.assignedAt).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const listData = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <>
      <Header />
      <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Club", {
              screen: "ClubGroup",
              params: {
                clubId: clubId
              }
            })
          }
          style={{
            marginLeft: 16,
            marginTop: 12,
            marginBottom: 6,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
          <Text style={{ color: "#2563EB", fontSize: 16, marginLeft: 6 }}>
            Quay lại
          </Text>
        </TouchableOpacity>
        <Text style={styles.title}>📋 Vai trò của bạn trong sự kiện</Text>

        <TouchableOpacity
          style={styles.assignButton}
          onPress={() =>
            navigation.navigate("Event", {
              screen: "EventTask",
              params: {
                eventId: eventId,
                clubId: clubId
              }
            })
          }
        >
          <Text style={styles.assignButtonText}>
            ➕ Tạo task cho sự kiện này
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() =>
            navigation.navigate("Event", {
              screen: "EventTaskView",
              params: {
                eventId: eventId
              }
            })
          }
        >
          <Text style={styles.assignButtonText}>Xem danh sách task đã tạo</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginTop: 40 }}
          />
        ) : listData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              ❗ Bạn chưa được phân vai trong sự kiện này.
            </Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => {
              if (item.userId) return item.userId.toString();
              return index.toString();
            }}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </View>
    </>
  );
};

export default EventRoles;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1D4ED8",
    marginTop: 16,
    marginBottom: 12
  },
  assignButton: {
    backgroundColor: "#3B82F6",
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3
  },
  assignButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontStyle: "italic"
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#E0E7FF"
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6
  },
  role: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4
  },
  date: {
    fontSize: 14,
    color: "#6B7280"
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});
