import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal
} from "react-native";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [lang, setLang] = React.useState("vi");
  const [dropdown, setDropdown] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedToken = await AsyncStorage.getItem("jwt");
      if (storedEmail && storedToken) {
        setUser({ email: storedEmail, token: storedToken });
      }
    };
    fetchUser();
  }, []);

  const toggleLang = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("jwt");
    await AsyncStorage.removeItem("role");
    setUser(null);
    setDropdown(false);
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#ff6600" />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#333" />
        </TouchableOpacity>

        <View style={styles.center}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnL5O9nttQugNjhsuWpmCvTS8NI3iiRUFoEA&s"
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>{t("title")}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleLang} style={styles.language}>
            <Text style={styles.flag}>{lang === "vi" ? "🇻🇳" : "🇺🇸"}</Text>
          </TouchableOpacity>

          {user ? (
            <View style={styles.avatarWrapper}>
              <TouchableOpacity onPress={() => setDropdown(!dropdown)}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/300" }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              {dropdown && (
                <Modal
                  visible={dropdown}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setDropdown(false)}
                >
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setDropdown(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.dropdown}>
                        <View style={styles.userBox}>
                          <Text style={styles.helloRow}>
                            👋 {t("hello")}:{" "}
                            <Text style={styles.emailText}>{user.email}</Text>
                          </Text>
                        </View>
                        <View style={{ marginTop: -20 }}>
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={handleLogout}
                          >
                            <Text style={styles.logoutText}>
                              🔓 {t("title88")}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                              setDropdown(false);
                              navigation.navigate("Event", {
                                screen: "FormClub"
                              });
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center"
                              }}
                            >
                              <Ionicons
                                name="add-circle-outline"
                                size={18}
                                color="#333"
                                style={{ marginRight: 8 }}
                              />
                              <Text style={styles.logoutText}>
                                Tạo câu lạc bộ
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() =>
                              navigation.navigate("Event", {
                                screen: "FormRegister"
                              })
                            }
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center"
                              }}
                            >
                              <Ionicons
                                name="person-add"
                                size={18}
                                color="#333"
                                style={{ marginRight: 8 }}
                              />
                              <Text style={styles.logoutText}>
                                Đăng kí câu lạc bộ
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
            </View>
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.authText}>{t("login")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[styles.authText, { color: "#ff6600" }]}>
                  {t("register")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default Header;
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FF6600",
    paddingTop: 42,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  center: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333"
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  language: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#eee"
  },
  flag: {
    fontSize: 16
  },
  avatarWrapper: {
    position: "relative"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#ff6600",
    borderWidth: 2
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 20
  },
  dropdown: {
    position: "absolute",
    top: -15,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999
  },
  userBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10
  },
  helloText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF"
  },
  email: {
    fontWeight: "600",
    color: "#007AFF"
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f6f6f6",
    marginTop: 6,
    width: "100%"
  },
  logoutText: {
    color: "#d9534f",
    fontWeight: "600",
    fontSize: 15
  },
  dropdownLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 10,
    color: "#555"
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10
  },
  authButtons: {
    flexDirection: "row",
    gap: 12
  },
  authText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600"
  }
});
