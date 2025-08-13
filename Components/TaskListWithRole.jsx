import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../utils/api";

export default function TaskListWithRole() {
  const [tasks, setTasks] = useState([]);
  const [rolesByEvent, setRolesByEvent] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/api/tasks/allTask`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Lỗi tải tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length === 0) return;

    const fetchRolesForEvents = async () => {
      const token = await AsyncStorage.getItem("jwt");
      const rolesMap = {};
      const eventIds = [...new Set(tasks.map((task) => task.eventId))];

      for (const eventId of eventIds) {
        try {
          const response = await fetchBaseResponse(
            `/api/event-roles/my/${eventId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
          if (response.status === 200 && response.data?.roleName) {
            rolesMap[eventId] = response.data.roleName;
          } else {
            rolesMap[eventId] = null;
          }
        } catch {
          rolesMap[eventId] = null;
        }
      }

      setRolesByEvent(rolesMap);
    };

    fetchRolesForEvents();
  }, [tasks]);

  const renderItem = ({ item }) => {
    const roleName = rolesByEvent[item.eventId];
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
        <Text>Event: {item.eventTitle}</Text>
        <Text>Role: {roleName ?? "Chưa có role"}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.taskId.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
