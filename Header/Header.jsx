import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  FlatList,
  Modal,
  Pressable
} from "react-native";
import { fetchBaseResponse } from "../utils/api";
function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [lang, setLang] = React.useState("vi");
  const [user, setUser] = React.useState(null);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  React.useEffect(() => {
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
      loadUnreadNotifications();
      loadNotifications();
    });
    return unsubscribe;
  }, [navigation]);
  const loadUnreadNotifications = React.useCallback(async () => {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetchBaseResponse(
        "/api/notifications/myNoti?unreadOnly=true",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setUnreadCount(response.data.length);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Lỗi tải notifications:", error);
      setUnreadCount(0);
    }
  }, []);

  // Load tất cả notifications
  const loadNotifications = React.useCallback(async () => {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetchBaseResponse(
        `/api/notifications/myNoti?unreadOnly=false`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Lỗi tải tất cả notifications:", error);
      setNotifications([]);
    }
  }, []);
  const markAsRead = async (notificationId) => {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return;

    try {
      // Gọi API cập nhật trạng thái đã đọc với URL mới
      const response = await fetchBaseResponse(
        `/api/notifications/read/${notificationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.notificationId === notificationId
              ? { ...noti, isRead: true }
              : noti
          )
        );
        setUnreadCount((count) => (count > 0 ? count - 1 : 0));
      }
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };
  const deleteNotification = async (notificationId) => {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return;

    try {
      const response = await fetchBaseResponse(
        `/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        // Loại bỏ notification khỏi state local
        setNotifications((prev) =>
          prev.filter((noti) => noti.notificationId !== notificationId)
        );
        // Nếu notification đó chưa đọc thì giảm badge
        const removedNoti = notifications.find(
          (noti) => noti.notificationId === notificationId
        );
        if (
          removedNoti &&
          (removedNoti.isRead === false || removedNoti.isRead === "false")
        ) {
          setUnreadCount((count) => (count > 0 ? count - 1 : 0));
        }
      }
    } catch (error) {
      console.error("Lỗi xóa notification:", error);
    }
  };
  React.useEffect(() => {
    loadUnreadNotifications();
    loadNotifications();
  }, [loadUnreadNotifications, loadNotifications]);

  const toggleLang = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const renderNotification = ({ item }) => {
    const isRead = item.isRead === true || item.isRead === "true";

    return (
      <TouchableOpacity
        onPress={() => {
          if (!isRead) {
            markAsRead(item.notificationId);
          }
          // Bạn có thể thêm điều hướng hoặc xử lý khác nếu muốn
        }}
        style={[
          styles.notificationItem,
          !isRead ? styles.unreadNotification : null
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationDate}>
              {formatDate(item.createdAt)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Ngăn onPress của TouchableOpacity cha bị kích hoạt khi bấm nút xóa
              deleteNotification(item.notificationId);
            }}
            style={{ padding: 8 }}
          >
            <MaterialIcons name="delete" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#ff6600" />
      <View style={styles.row}>
        {/* Nút menu */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Logo + Title */}
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

        {/* Nút đổi ngôn ngữ + Login/Register + Chuông thông báo */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.bellButton} onPress={toggleDropdown}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleLang} style={styles.language}>
            <Text style={styles.flag}>{lang === "vi" ? "🇻🇳" : "🇺🇸"}</Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            {!user && (
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

      {/* Dropdown notification */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleDropdown}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleDropdown}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Thông báo</Text>
            {notifications.length === 0 ? (
              <Text style={{ textAlign: "center", padding: 20 }}>
                Không có thông báo nào
              </Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.notificationId.toString()}
                renderItem={renderNotification}
                style={{ maxHeight: 300 }}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fe8a3cff",
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
    gap: 8,
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
  },
  bellButton: {
    marginLeft: 15
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold"
  },

  // Dropdown styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 55, // thay marginTop dropdown thành paddingTop cho overlay
    paddingRight: 10, // thay marginRight dropdown thành paddingRight cho overlay
    
  },
  dropdown: {
    width: 320,
    maxHeight: 300,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5
  },

  dropdownTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
    
  },
  unreadNotification: {
    backgroundColor: "#ffe6e6"
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 14
  },
  notificationMessage: {
    fontSize: 13,
    marginTop: 4
  },
  notificationDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 4
  }
});
