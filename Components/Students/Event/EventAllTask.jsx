import { useFocusEffect, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, Alert, FlatList, StyleSheet } from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";

const EventAllTask = () => {
  const route = useRoute();
  const { eventId } = route.params;
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("jwt");
          const response = await fetchBaseResponse(
            `/api/tasks/mytask?eventId=${eventId}`,
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
          }
        } catch (error) {
          if (error.status === 1003) {
            Alert.alert(
              "Thông báo",
              error.message || "Không có task trong sự kiện"
            );
            setData([]);
          } else {
            console.log("❌ Lỗi khi fetch task:", error);
            Alert.alert(
              "Lỗi",
              error.message || "Không thể tải danh sách task."
            );
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [eventId])
  );

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.dueDate}>
        ⏰ {new Date(item.dueDate).toLocaleString("vi-VN")}
      </Text>
      <Text style={{ color: item.isCompleted ? "green" : "red" }}>
        {item.isCompleted ? "✅ Đã hoàn thành" : "⏳ Chưa hoàn thành"}
      </Text>
    </View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <Text>Đang tải...</Text>
        ) : data.length === 0 ? (
          <Text>Không có task nào.</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.taskId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  taskContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12
  },
  title: {
    fontWeight: "bold",
    fontSize: 16
  },
  desc: {
    marginVertical: 4
  },
  dueDate: {
    fontStyle: "italic",
    color: "#666"
  }
});

export default EventAllTask;
