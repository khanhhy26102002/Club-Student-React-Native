import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export const CustomDrawer = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const user = {
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/300",
    academicYear: 2025,
    major: "Trí Tuệ Nhân Tạo",
    Skill: "Programming"
  };
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
          <Text style={styles.labelValue}>{user.major}</Text>

          <Text style={styles.labelTitle}>🛠 Kỹ năng:</Text>
          <Text style={styles.labelValue}>{user.Skill}</Text>
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
          onPress={() => navigation.navigate("ProjectList")}
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
    backgroundColor: "#2563eb", // Blue-600
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
    color: "#374151", // Gray-700
    marginTop: 10
  },
  labelValue: {
    fontSize: 15,
    color: "#6b7280", // Gray-500
    marginBottom: 6
  },
  actions: {
    marginTop: 10
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6", // Blue-500
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12
  },
  logoutButton: {
    backgroundColor: "#ef4444" // Red-500
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
    backgroundColor: "#10b981", // Emerald-500
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
