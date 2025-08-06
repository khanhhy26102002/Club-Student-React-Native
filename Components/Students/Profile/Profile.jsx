import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";
// đăng kí clb
const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedToken = await AsyncStorage.getItem("jwt");
      const userId = await AsyncStorage.getItem("userId");
      if (storedEmail && storedToken && userId) {
        setUser({ email: storedEmail, token: storedToken, user: userId });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });

    return unsubscribe;
  }, [navigation]);

  const toggleLang = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }]
    });
  };

  return (
    <>
      <Header />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text
            style={{
              marginTop: 12,
              fontSize: 16,
              color: "#333",
              textAlign: "center"
            }}
          >
            Đang tải...
          </Text>
        </View>
      ) : user ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerSectionNoGradient}>
            <Image
              source={{
                uri: "http://res.cloudinary.com/dqlhjgisk/image/upload/865710ff-25a6-4aeb-9292-6be2a61c7f1d_Screenshot%20%281%29.png"
              }}
              style={styles.avatar}
            />
            <Text style={styles.email}>
              👋 {t("hello")}: {user.email}
            </Text>
            <TouchableOpacity onPress={toggleLang} style={styles.langButton}>
              <Text style={styles.langText}>
                {lang === "vi" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <ActionItem
              icon="add-circle-outline"
              label="Tạo câu lạc bộ"
              onPress={() =>
                navigation.navigate("Club", { screen: "FormClub" })
              }
              color="#2196F3"
            />
            {/* <ActionItem
              icon="person-add"
              label="Đăng kí câu lạc bộ"
              onPress={() =>
                navigation.navigate("Club", { screen: "FormRegister" })
              }
              color="#4CAF50"
            /> */}
            {/* <ActionItem
              icon="calendar"
              label="Tạo sự kiện"
              onPress={() =>
                navigation.navigate("Event", { screen: "EventRegister" })
              }
              color="#FF9800"
            /> */}

            {/* <ActionItem
              icon="bar-chart-outline"
              label="Quản lí sự kiện"
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "EventRoles"
                })
              }
              color="#f44336"
            /> */}
            {/* <ActionItem
              icon="albums-outline"
              label="Đăng kí câu lạc bộ của tôi"
              onPress={() =>
                navigation.navigate("Club", {
                  screen: "ClubList"
                })
              }
            /> */}
            <ActionItem
              icon="briefcase-outline"
              label="Quản lí câu lạc bộ của tôi"
              onPress={() =>
                navigation.navigate("Club", {
                  screen: "ClubCreate"
                })
              }
            />
            <ActionItem
              icon="briefcase-outline"
              label="Tham gia câu lạc bộ của tôi"
              onPress={() =>
                navigation.navigate("Club", {
                  screen: "ClubRegister"
                })
              }
            />
            {/* <ActionItem
              icon="ticket-outline"
              label="Đăng kí sự kiện"
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "History",
                  params: {
                    userId: user.userId
                  }
                })
              }
            /> */}
            {/* <ActionItem
              icon="list-circle-outline"
              label="Sự kiện của tôi"
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "EventRoles"
                })
              }
            /> */}
            {/* <ActionItem
              icon="clipboard-outline"
              label="Tạo task sự kiện của bạn"
              onPress={() =>
                navigation.navigate("Event", {
                  screen: "EventTask"
                })
              }
            /> */}
            <ActionItem
              icon="call-outline"
              label="Thông tin liên lạc"
              onPress={() => navigation.navigate("Contact")}
              color="#f44336"
            />

            <ActionItem
              icon="ticket-outline"
              label="Sự kiện của tôi"
              onPress={() =>
                navigation.navigate("Profile", {
                  screen: "EventBuy"
                })
              }
            />
            <ActionItem
              icon="cube-outline"
              label="Đơn hàng của tôi"
              onPress={() =>
                navigation.navigate("Profile", {
                  screen: "MyOrder"
                })
              }
            />
            <ActionItem
              icon="create-outline"
              label="Xem hồ sơ"
              onPress={() =>
                navigation.navigate("Profile", {
                  screen: "ProfileView"
                })
              }
            />
            <ActionItem
              icon="log-out-outline"
              label="Đăng xuất"
              onPress={handleLogout}
              color="#f44336"
            />
            {/* <ActionItem
              icon="clipboard-outline"
              label="Tạo task sự kiện của bạn"
              onPress={() =>
                navigation.navigate("Profile", {
                  screen: "image"
                })
              }
            /> */}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <View style={styles.gradientBackgroundNoGradient}>
            <View style={styles.card}>
              <Text style={styles.notLoggedIn}>Bạn chưa đăng nhập</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.authBtn}
              >
                <Text style={styles.authText}>{t("login")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const ActionItem = ({ icon, label, onPress, color = "#333" }) => (
  <TouchableOpacity onPress={onPress} style={styles.actionItem}>
    <Ionicons name={icon} size={22} color={color} style={{ marginRight: 14 }} />
    <Text style={[styles.actionText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
    backgroundColor: "#f5f7fa"
  },
  container: {
    flex: 1
  },
  gradientBackgroundNoGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ff685d"
  },
  card: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6
  },
  notLoggedIn: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center"
  },
  authBtn: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25
  },
  authText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
  headerSectionNoGradient: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginBottom: 12
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  langButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 12
  },
  langText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333"
  },
  actions: {
    marginTop: 24,
    paddingHorizontal: 20
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600"
  }
});
