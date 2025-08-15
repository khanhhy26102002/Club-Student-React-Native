import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Card } from "react-native-paper";
import moment from "moment";
import "moment/locale/vi";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";

const EventTaskAll = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const userId = await AsyncStorage.getItem("userId");

      // Lấy danh sách task
      const taskRes = await fetchBaseResponse("/api/tasks/allTask", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      // Lấy danh sách club
      const clubRes = await fetchBaseResponse("/api/clubs/my-clubs", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (clubRes.status === 200) setClubs(clubRes.data);

      if (taskRes.status === 200) {
        // Lọc task của user hiện tại
        const allTasks = taskRes.data.filter(
          (t) => String(t.userId) === String(userId)
        );

        // Task gần hết hạn (≤ 3 ngày) và chưa DONE
        const now = moment();
        const soonTasks = allTasks.filter(
          (t) =>
            t.status !== "DONE" &&
            t.dueDate &&
            moment(t.dueDate).isBetween(now, now.clone().add(3, "days"))
        );

        const otherTasks = allTasks.filter((t) => !soonTasks.includes(t));

        // Sắp xếp: gần hết hạn trước → mới tạo sau
        const sorted = [
          ...soonTasks.sort((a, b) => moment(a.dueDate) - moment(b.dueDate)),
          ...otherTasks.sort(
            (a, b) => moment(b.createdAt) - moment(a.createdAt)
          )
        ];

        // Giới hạn hiển thị 5 task
        setTasks(sorted.slice(0, 3));
      }
    };

    loadData();
  }, []);

  const renderTask = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Event", {
          screen: "EventAllTask",
          params: { eventId: item.eventId, taskId: item.taskId }
        })
      }
    >
      <Card style={styles.card}>
        <Card.Title
          title={item.title}
          subtitle={`📅 ${moment(item.dueDate).format("DD/MM/YYYY HH:mm")} • ${
            item.eventTitle
          }`}
        />
        <Card.Content>
          <Text>{item.description || "Không có mô tả."}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderClub = ({ item }) => (
    <Card style={styles.clubCard}>
      <Card.Title
        title={item.name}
        subtitle={`Vai trò: ${item.role || "Thành viên"}`}
      />
    </Card>
  );

  return (
    <>
      <Header />
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>📌 Câu lạc bộ</Text>
        <FlatList
          data={clubs}
          keyExtractor={(item, index) => `${item.clubId}-${index}`}
          renderItem={renderClub}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 120, marginBottom: 10 }}
        />

        <Text style={styles.sectionTitle}>🕒 Task của bạn</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => `${item.taskId}-${index}`}
          renderItem={renderTask}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10
  },
  card: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFE0B2"
  },
  clubCard: {
    width: 200,
    marginHorizontal: 10,
    backgroundColor: "#E1F5FE"
  }
});

export default EventTaskAll;
