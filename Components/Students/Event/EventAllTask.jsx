import { useFocusEffect, useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";

const EventAllTask = ({ navigation }) => {
  const route = useRoute();
  const { eventId, taskId } = route.params || {};
  const [data, setData] = React.useState([]);
  const [eventRole, setEventRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const flatListRef = React.useRef(null);

  const renderStatus = (status) => {
    let label = "UNKNOWN";
    switch (status) {
      case "TODO":
        label = "Chưa làm";
        break;
      case "IN_PROGRESS":
        label = "Đang làm";
        break;
      case "DONE":
        label = "Hoàn thành";
        break;
      default:
        label = status;
    }
    return <Text style={{ fontWeight: "bold" }}>📌 Trạng thái: {label}</Text>;
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("jwt");
          const taskRes = await fetchBaseResponse(
            `/api/tasks/mytask?eventId=${eventId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          const roleRes = await fetchBaseResponse(
            `/api/event-roles/my/${eventId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setData(Array.isArray(taskRes.data) ? taskRes.data : [taskRes.data]);
          if (roleRes.status === 200) setEventRole(roleRes.data);
        } catch (error) {
          Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [eventId])
  );

  React.useEffect(() => {
    if (!loading && taskId && flatListRef.current) {
      const index = filteredData.findIndex((t) => t.taskId === taskId);
      if (index !== -1) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }
  }, [loading, taskId]);

  const filteredData = (
    selectedUser ? data.filter((item) => item.userName === selectedUser) : data
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const renderItem = ({ item }) => {
    const isHighlight = item.taskId === taskId;
    return (
      <View
        style={[
          styles.taskCard,
          isHighlight && { borderColor: "#FF5722", borderWidth: 2 }
        ]}
      >
        <Text style={styles.taskTitle}>{item.eventTitle}</Text>
        {renderStatus(item.status)}
        <Text style={styles.taskDesc}>{stripMarkdown(item.description)}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{item.userName}</Text>
          <Text style={styles.infoText}>
            {new Date(item.createdAt).toLocaleString("vi-VN")}
          </Text>
          <Text style={styles.dueDate}>
            {new Date(item.dueDate).toLocaleString("vi-VN")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Quay về</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#fe8a3c" />
            <Text style={{ marginTop: 8 }}>Đang tải...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={filteredData}
            keyExtractor={(item) => item.taskId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}
        {eventRole?.roleName === "CHECKIN" && (
          <TouchableOpacity
            style={styles.checkinButton}
            onPress={() => navigation.navigate("Login", { eventId })}
          >
            <Text style={styles.checkinButtonText}>Checkin</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  taskCard: {
    backgroundColor: "#FFE0B2",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14
  },
  taskTitle: { fontSize: 16, fontWeight: "bold", color: "#E65100" },
  taskDesc: { fontSize: 14, color: "black", marginBottom: 10 },
  infoBox: { backgroundColor: "#FFE0B2", padding: 10, borderRadius: 8 },
  infoText: { fontSize: 13, color: "black", marginBottom: 4 },
  dueDate: { fontSize: 13, fontStyle: "italic", color: "#D84315" },
  checkinButton: {
    backgroundColor: "#FB8C00",
    padding: 14,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center"
  },
  checkinButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backButton: { paddingHorizontal: 16, paddingVertical: 10, marginBottom: 10 },
  backButtonText: { color: "#FB8C00", fontWeight: "bold", fontSize: 16 }
});

export default EventAllTask;
