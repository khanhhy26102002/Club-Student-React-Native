import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../Header/Header";
import { LinearGradient } from "expo-linear-gradient";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("vi");

  useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedToken = await AsyncStorage.getItem("jwt");
      if (storedEmail && storedToken) {
        setUser({ email: storedEmail, token: storedToken });
      }
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
    navigation.replace("Main");
  };

  return (
    <>
      <Header />
      {user ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.headerSection}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }}
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
          </LinearGradient>

          <View style={styles.actions}>
            <ActionItem
              icon="add-circle-outline"
              label="Tạo câu lạc bộ"
              onPress={() =>
                navigation.navigate("Club", { screen: "FormClub" })
              }
              color="#2196F3"
            />
            <ActionItem
              icon="person-add"
              label="Đăng kí câu lạc bộ"
              onPress={() =>
                navigation.navigate("Club", { screen: "FormRegister" })
              }
              color="#4CAF50"
            />
            <ActionItem
              icon="calendar"
              label="Tạo sự kiện"
              onPress={() =>
                navigation.navigate("Event", { screen: "EventRegister" })
              }
              color="#FF9800"
            />
            <ActionItem
              icon="log-out-outline"
              label="Đăng xuất"
              onPress={handleLogout}
              color="#f44336"
            />
            <ActionItem
              icon="call-outline"
              label="Thông tin liên lạc"
              onPress={() => navigation.navigate("Contact")}
              color="#f44336"
            />
            <ActionItem
              icon="bar-chart-outline"
              label="Quản lí dự án"
              onPress={() =>
                navigation.navigate("Profile", {
                  screen: "Project"
                })
              }
              color="#f44336"
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <LinearGradient
            colors={["#ff9966", "#ff5e62"]}
            style={styles.gradientBackground}
          >
            <View style={styles.card}>
              <Text style={styles.notLoggedIn}>Bạn chưa đăng nhập</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.authBtn}
              >
                <Text style={styles.authText}>{t("login")}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    paddingBottom: 40,
    backgroundColor: "#f5f7fa"
  },
  container: {
    flex: 1
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
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
  icon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    tintColor: "#ff6600"
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
  headerSection: {
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
    color: "#fff"
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
