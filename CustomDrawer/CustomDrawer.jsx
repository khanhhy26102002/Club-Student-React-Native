import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../utils/api";

export const CustomDrawer = (props) => {
  const navigation = props.navigation;
  const { t } = useTranslation();
  const [user, setUser] = React.useState(null);
  const [majorName, setMajorName] = React.useState("Đang tải...");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserAndMajor = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userId");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const res = await fetchBaseResponse(`/api/majors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (res.status === 200) {
          const found = res.data.find(
            (item) => item.majorId === parsedUser.majorId
          );
          setMajorName(found?.majorName || "Không rõ");
        }
      } catch (error) {
        console.error("Lỗi khi fetch chuyên ngành:", error);
        setMajorName("Không rõ");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMajor();
  }, []);

  if (loading) {
    return (
      <DrawerContentScrollView>
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#6b7280" }}>
            Đang tải thông tin người dùng...
          </Text>
        </View>
      </DrawerContentScrollView>
    );
  }

  if (!user) {
    return (
      <DrawerContentScrollView>
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#6b7280" }}>
            Không tìm thấy thông tin người dùng.
          </Text>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.username}>👋 Xin chào, {user.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.labelTitle}>📘 Năm học:</Text>
          <Text style={styles.labelValue}>{user.academicYear}</Text>

          <Text style={styles.labelTitle}>🎓 Chuyên ngành:</Text>
          <Text style={styles.labelValue}>{majorName}</Text>

          <Text style={styles.labelTitle}>🛠 Kỹ năng:</Text>
          <Text style={styles.labelValue}>{user.skill}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="person-circle-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.actionText}>{t("title87")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.logoutText}>{t("title88")}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Navigation", {
              screen: "Profile",
              params: { screen: "Project" }
            })
          }
          style={styles.projectButton}
        >
          <Text style={styles.projectButtonText}>📂 Xem danh sách dự án</Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#2563eb",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
    backgroundColor: "#ccc"
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff"
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  labelTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#374151",
    marginTop: 10
  },
  labelValue: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 6
  },
  actions: {
    marginTop: 10
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12
  },
  logoutButton: {
    backgroundColor: "#ef4444"
  },
  icon: {
    marginRight: 10
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500"
  },
  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500"
  },
  projectButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3
  },
  projectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
