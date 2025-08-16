import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { Card, ProgressBar, Button, Avatar } from "react-native-paper";
import moment from "moment";
import "moment/locale/vi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - 36) / 2;
const CLUB_CARD_HEIGHT = 180;

const EventTaskAll = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [userId, setUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const uid = await AsyncStorage.getItem("userId");
      setUserId(uid);

      const taskRes = await fetchBaseResponse("/api/tasks/allTask", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      const clubRes = await fetchBaseResponse("/api/clubs/my-club-roles", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (clubRes.status === 200) setClubs(clubRes.data);
      if (taskRes.status === 200) {
        // Lọc task theo userId
        const allTasks = taskRes.data.filter(
          (t) => String(t.userId) === String(uid)
        );
        setTasks(allTasks);
      }
    };

    loadData();
  }, []);

  // Gom task theo eventId duy nhất
  const uniqueEvents = Object.values(
    tasks.reduce((acc, task) => {
      if (!acc[task.eventId]) acc[task.eventId] = task;
      return acc;
    }, {})
  );

  // Lọc task theo filter
  const filteredEvents = uniqueEvents.filter((t) => {
    if (filter === "ALL") return true;
    if (filter === "TODO") return t.status === "TODO";
    if (filter === "IN_PROGRESS") return t.status === "IN_PROGRESS";
    if (filter === "COMPLETED") return t.status === "COMPLETED";
    if (filter === "CANCELLED") return t.status === "CANCELLED";
    return true;
  });

  // Tính % hoàn thành
  const userTasks = tasks; // đã lọc theo userId ở useEffect
  const completedTasks = userTasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;
  const progress =
    userTasks.length > 0
      ? Math.round((completedTasks / userTasks.length) * 100)
      : 0;

  const statusColors = {
    OVERDUE: "#FFCDD2",
    COMPLETED: "#E0E0E0",
    IN_PROGRESS: "#B2DFDB",
    TODO: "#FFF9C4",
    CANCELLED: "#F8BBD0"
  };

  const renderTask = ({ item }) => {
    const now = moment();
    const due = moment(item.dueDate);
    const diffDays = due.diff(now, "days");
    const isOverdue = diffDays < 3 && item.status !== "COMPLETED";
    const isDone = item.status === "COMPLETED";

    const bgColor = isDone
      ? statusColors.COMPLETED
      : isOverdue
      ? statusColors.OVERDUE
      : item.status === "IN_PROGRESS"
      ? statusColors.IN_PROGRESS
      : item.status === "CANCELLED"
      ? statusColors.CANCELLED
      : statusColors.TODO;

    const statusIcon = isDone
      ? "✔️"
      : isOverdue
      ? "⏰"
      : item.status === "IN_PROGRESS"
      ? "🔄"
      : item.status === "CANCELLED"
      ? "❌"
      : "📝";

    let dueText = "";
    if (!isDone && item.dueDate) {
      if (diffDays > 0) dueText = `Còn ${diffDays} ngày`;
      else if (diffDays === 0) dueText = "Hết hạn hôm nay";
      else dueText = "Đã quá hạn!";
    }

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Event", {
            screen: "EventAllTask",
            params: { eventId: item.eventId, taskId: item.taskId }
          })
        }
      >
        <Card style={[styles.card, { backgroundColor: bgColor }]}>
          <Card.Title
            title={`${statusIcon} ${item.title}`}
            titleStyle={{
              color: isOverdue ? "#B71C1C" : isDone ? "#9E9E9E" : "#222",
              textDecorationLine: isDone ? "line-through" : "none"
            }}
            subtitleNumberOfLines={2}
          />
          <Card.Content>
            <Text
              numberOfLines={2}
              style={{
                fontStyle: item.description ? "normal" : "italic",
                color: "#616161"
              }}
            >
              {item.description || "Không có mô tả."}
            </Text>
            {dueText ? (
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: isOverdue ? "#B71C1C" : "#F57C00"
                }}
              >
                ⏱ {dueText}
              </Text>
            ) : null}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderClub = ({ item }) => (
    <TouchableOpacity
      key={`club-${item.clubId}`}
      style={styles.clubCardContainer}
    >
      <Avatar.Image size={50} source={{ uri: item.logoUrl }} />
      <Text style={styles.clubName}>{item.clubName}</Text>
      <Text style={styles.clubRole}>👤 {item.myRole || "Thành viên"}</Text>
      <Text style={styles.clubMembers}>🧑‍🤝‍🧑 {item.memberCount} thành viên</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => `event-${item.eventId}`}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              <Text style={styles.sectionTitle}>📌 Câu lạc bộ</Text>
              <FlatList
                ref={flatListRef}
                data={clubs}
                renderItem={renderClub}
                keyExtractor={(item) => `club-${item.clubId}`}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 12
                }}
                showsVerticalScrollIndicator={false}
                getItemLayout={(data, index) => ({
                  length: CLUB_CARD_HEIGHT,
                  offset: CLUB_CARD_HEIGHT * index,
                  index
                })}
              />
              <View style={styles.filterContainer}>
                {["ALL", "TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
                  (f) => (
                    <Button
                      key={f}
                      mode={filter === f ? "contained" : "outlined"}
                      style={[
                        styles.filterButton,
                        { backgroundColor: filter === f ? "#4FC3F7" : "#FFF" }
                      ]}
                      labelStyle={{
                        fontSize: 13,
                        color: filter === f ? "#FFF" : "#0288D1"
                      }}
                      onPress={() => setFilter(f)}
                    >
                      {f === "COMPLETED"
                        ? "✔️"
                        : f === "TODO"
                        ? "📝"
                        : f === "CANCELLED"
                        ? "❌"
                        : f === "IN_PROGRESS"
                        ? "🔄"
                        : "Tất cả"}
                    </Button>
                  )
                )}
              </View>
            </>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, backgroundColor: "#FAFAFA" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 8 },
  card: {
    marginBottom: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  progressContainer: { marginBottom: 14 },
  progressBar: { height: 14, borderRadius: 8, marginVertical: 6 },
  progressText: { alignSelf: "center", fontWeight: "600", color: "#388E3C" },
  filterContainer: {
    flexDirection: "row",
    marginVertical: 12,
    justifyContent: "flex-start",
    flexWrap: "wrap"
  },
  filterButton: {
    height: 36,
    borderRadius: 20,
    marginHorizontal: 2,
    marginVertical: 2
  },
  clubCardContainer: {
    flex: 1,
    backgroundColor: "#E1F5FE",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    width: CARD_WIDTH
  },
  clubName: {
    fontWeight: "700",
    color: "#0288D1",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center"
  },
  clubRole: { fontSize: 12, color: "#555", marginTop: 2, textAlign: "center" },
  clubMembers: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
    textAlign: "center"
  }
});

export default EventTaskAll;
