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
import { fetchBaseResponse } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CustomDrawer = (props) => {
  const navigation = props.navigation;
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const yearStatus = (year) => {
    switch (year) {
      case "YEAR_ONE":
        return "Năm nhất";
      case "YEAR_TWO":
        return "Năm hai";
      case "YEAR_THREE":
        return "Năm ba";
      case "YEAR_FOUR":
        return "Năm tư";
      default:
        return "Không có năm học";
    }
  };
  React.useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const res = await fetchBaseResponse(`/api/users/getInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log("Token:", token);
        console.log("User info response:", res);
        if (res.status === 200) {
          setUserInfo(res.data);
        } else {
          throw new Error(`Status: ${res.status}`);
        }
      } catch (err) {
        console.error("Lỗi khi fetch user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <DrawerContentScrollView>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>
            Đang tải thông tin người dùng...
          </Text>
        </View>
      </DrawerContentScrollView>
    );
  }

  if (!userInfo) {
    return (
      <DrawerContentScrollView>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>
            Không tìm thấy thông tin người dùng.
          </Text>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileBox}>
          <View style={styles.avatarBorder}>
            <Image source={{ uri: userInfo.avatarUrl }} style={styles.avatar} />
          </View>
          <Text style={styles.fullName}>{userInfo.fullName}</Text>
          <Text style={styles.studentCode}>🎓 {userInfo.studentCode}</Text>
        </View>

        <View style={styles.infoBox}>
          <InfoRow
            label="Chuyên ngành"
            value={userInfo.majorName}
            icon="laptop-outline"
          />
          <InfoRow
            label="Niên khóa"
            value={yearStatus(userInfo.academicYear)}
            icon="calendar-outline"
          />
          <InfoRow label="Email" value={userInfo.email} icon="mail-outline" />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("Navigation", {
                screen: "Profile",
                params: { screen: "Project" }
              })
            }
          >
            <Ionicons
              name="folder-outline"
              size={20}
              color="#3b82f6"
              style={styles.icon}
            />
            <Text style={styles.actionText}>Xem danh sách dự án</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#ef4444"
              style={styles.icon}
            />
            <Text style={[styles.actionText, { color: "#ef4444" }]}>
              {t("title88") || "Đăng xuất"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <Ionicons
      name={icon}
      size={18}
      color="#6b7280"
      style={{ marginRight: 8 }}
    />
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  centerBox: {
    padding: 20,
    alignItems: "center"
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280"
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444"
  },
  profileBox: {
    alignItems: "center",
    marginBottom: 20
  },
  avatarBorder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  fullName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 10
  },
  studentCode: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#374151",
    marginRight: 4
  },
  value: {
    fontSize: 14,
    color: "#6b7280"
  },
  actions: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 20
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef4444"
  },
  icon: {
    marginRight: 10
  },
  actionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3b82f6"
  }
});
