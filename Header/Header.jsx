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
    localStorage.clear();
    setUser(null);
    setDropdown(false);
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#ff6600" />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.center}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnL5O9nttQugNjhsuWpmCvTS8NI3iiRUFoEA&s"
            }}
            style={styles.logo}
          />
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {t("title")}
          </Text>
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
                        <Text style={styles.helloRow}>
                          👋 {t("hello")}:{" "}
                          <Text style={styles.emailText}>{user.email}</Text>
                        </Text>

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
                          <View style={styles.dropdownRow}>
                            <Ionicons
                              name="add-circle-outline"
                              size={18}
                              color="#333"
                              style={{ marginRight: 8 }}
                            />
                            <Text style={styles.dropdownText}>
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
                          <View style={styles.dropdownRow}>
                            <Ionicons
                              name="person-add"
                              size={18}
                              color="#333"
                              style={{ marginRight: 8 }}
                            />
                            <Text style={styles.dropdownText}>
                              Đăng kí câu lạc bộ
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
            </View>
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.authBtn}
              >
                <Text style={styles.authText}>{t("login")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                style={[styles.authBtn, { backgroundColor: "#fff" }]}
              >
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
    paddingTop: 12,
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
    justifyContent: "space-between",
    marginLeft: -10
  },
  center: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    gap: 8
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 6
  },
  title: {
    fontSize: 11,
    color: "#fff",
    marginLeft: -10,
    fontWeight: "bold"
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  language: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
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
    borderColor: "#fff",
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
  modalContainer: {
    width: 250
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999
  },
  helloRow: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444"
  },
  emailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF"
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginTop: 6
  },
  logoutText: {
    color: "#d9534f",
    fontWeight: "600",
    fontSize: 15
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333"
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  authButtons: {
    flexDirection: "row",
    gap: 8
  },
  authBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#fff"
  },
  authText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333"
  }
});
