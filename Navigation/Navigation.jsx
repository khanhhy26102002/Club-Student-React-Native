import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import EventStack from "../Components/Students/Event/EventStack";
import ClubStack from "../Components/Students/Club/ClubStack";
import ProfileStack from "../Components/Students/Profile/ProfileStack";
import Homepage from "../Components/Home/Homepage";
import EventAllTask from "../Components/Students/Event/EventAllTask";
import { fetchBaseResponse } from "../utils/api";

const Tab = createBottomTabNavigator();

export default function Navigation({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const fetchData = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener("tabPress", fetchData);
    return unsubscribe;
  }, [fetchData, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fe8a3c" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Club") iconName = "people-outline";
          else if (route.name === "Event") iconName = "remove-circle-sharp";
          else if (route.name === "Task") iconName = "person-circle-sharp";
          else if (route.name === "Blog") iconName = "document-text-outline";
          const iconSize = focused ? 28 : 24;
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "#fe8a3cff",
          height: 70,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ffe0b2",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5
        },
        tabBarItemStyle: {
          borderRadius: 10,
          paddingVertical: 10,
          marginHorizontal: 5
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={Homepage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Event"
        component={EventStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Club"
        component={ClubStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Task"
        component={EventAllTask}
        initialParams={{ eventId: tasks[tasks.length - 1]?.eventId ?? null }}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
