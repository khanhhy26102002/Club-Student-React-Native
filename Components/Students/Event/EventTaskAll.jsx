import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Card, Avatar, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Header/Header";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const EventTaskAll = () => {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [currentUserId, setCurrentUserId] = React.useState(null);
  const theme = useTheme();

  // Lấy userId trực tiếp từ AsyncStorage
  React.useEffect(() => {
    const getCurrentUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        setCurrentUserId(parseInt(userId, 10));
      }
    };
    getCurrentUserId();
  }, []);

  // Fetch task, filter theo userId và gom trùng theo title + eventId
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(`/api/tasks/allTask`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 200) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setData(sortedData);

          // Chỉ hiển thị task của user login
          const userTasks = sortedData.filter(
            (task) => task.userId === currentUserId
          );

          // Gom trùng theo title + eventId
          const uniqueTasksMap = new Map();
          userTasks.forEach((task) => {
            const key = `${task.title}-${task.eventId}`;
            if (!uniqueTasksMap.has(key)) {
              uniqueTasksMap.set(key, task);
            }
          });
          const uniqueTasks = Array.from(uniqueTasksMap.values());

          setFilteredData(uniqueTasks);
        } else {
          setError(`HTTP Status: ${response.status}`);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId !== null) fetchData();
  }, [currentUserId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Event", {
          screen: "EventAllTask",
          params: { eventId: item.eventId }
        });
        console.log("Nhấn vào task:", item.taskId);
      }}
      activeOpacity={0.8}
    >
      <Card style={styles.card}>
        <Card.Title
          title={item.title}
          subtitle={
            <>
              <Text>
                🕒{" "}
                {item.dueDate
                  ? moment(item.dueDate).format("DD/MM/YYYY HH:mm")
                  : "Không có deadline"}
              </Text>
              <Text>📅 {item.eventTitle}</Text>
              {item.parentTitle && <Text>↳ {item.parentTitle}</Text>}
            </>
          }
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="checkbox-marked-circle-outline"
              color={theme.colors.accent}
              style={styles.icon}
            />
          )}
        />
        <Card.Content>
          <Text style={styles.desc}>
            {item.description || "Không có mô tả."}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.loading}
      />
    );

  if (error)
    return (
      <View style={styles.center}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.colors.error}
        />
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.header}>
          Danh Sách Task ({filteredData.length})
        </Text>

        {filteredData.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="infinite-outline" size={40} color="#bbb" />
            <Text style={styles.emptyText}>Không có công việc nào.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              `${item.title}-${item.eventId}-${item.taskId || index}`
            }
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30, paddingHorizontal: 12 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E65100",
    marginBottom: 14
  },
  card: {
    marginVertical: 8,
    borderRadius: 18,
    elevation: 4,
    backgroundColor: "#FFE0B2"
  },
  desc: { marginTop: 6, color: "#4E342E", fontSize: 15 },
  icon: { backgroundColor: "#FFCC80" },
  loading: { flex: 1, justifyContent: "center" },
  error: { color: "#D84315", marginTop: 12, fontWeight: "600" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { marginTop: 12, color: "#8D6E63", fontSize: 17 }
});

export default EventTaskAll;
