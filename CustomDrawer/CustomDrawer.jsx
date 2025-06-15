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
        <Text style={styles.username}>
          Xin chào, {user.name}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.labelTitle}>Năm học:</Text>
          <Text style={styles.labelValue}>
            {user.academicYear}
          </Text>

          <Text style={styles.labelTitle}>Chuyên ngành:</Text>
          <Text style={styles.labelValue}>
            {user.major}
          </Text>

          <Text style={styles.labelTitle}>Kỹ năng:</Text>
          <Text style={styles.labelValue}>
            {user.Skill}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="person-circle-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.actionText}>
              {t("title87")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#ff3b30"
              style={styles.icon}
            />
            <Text
              style={[styles.actionText, styles.logoutText]}
              onPress={() => navigation.navigate("Login")}
            >
              {t("title88")}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProjectList")}
          style={{
            backgroundColor: "#4A90E2",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            📂 Xem danh sách dự án
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
    backgroundColor: "#ff6600",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9"
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  labelTitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 10
  },
  labelValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  actions: {
    gap: 12
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600"
  },
  icon: {
    marginRight: 8
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff3b30"
  },
  logoutText: {
    color: "#ff3b30"
  },
  actions: {
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 12
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },

  icon: {
    marginRight: 10
  },

  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff3b30"
  },

  logoutText: {
    color: "#ff3b30"
  }
});
