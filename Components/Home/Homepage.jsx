import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Homepage = ({ navigation }) => {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedToken = await AsyncStorage.getItem("jwt");
      if (storedEmail && storedToken) {
        setUser({ email: storedEmail, token: storedToken });
      }
    };
    // lên mạng task manager cho mobile
    //
    fetchUser();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });
    return unsubscribe;
  }, []);
  return (
    <>
      <Header />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {user ? `Hi, ${user.email}` : "Hi 👋"}
          </Text>
          <Text style={styles.subtitle}>
            What would you like to manage today?
          </Text>
          <TouchableOpacity style={styles.notification}>
            <Ionicons name="notifications-outline" size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput placeholder="Search Club..." style={styles.searchInput} />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🔥 CLB Tuần Này</Text>
          <Text style={styles.bannerDesc}>
            Xem ngay những CLB đang nổi bật trong tuần và xu hướng hoạt động.
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Loại CLB</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryList}>
          {["Kỹ năng", "Học thuật", "Tình nguyện"].map((c, i) => (
            <TouchableOpacity key={i} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Clubs */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>CLB nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2].map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTag}>Kỹ năng</Text>
                <Text style={styles.cardTitle}>CLB Thuyết trình</Text>
                <Text style={styles.cardSub}>120 thành viên</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Top Mentors */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Ban chủ nhiệm</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>XEM TẤT CẢ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mentorRow}>
          {["Trang", "Minh", "Ngọc", "Quân"].map((name, index) => (
            <View key={index} style={styles.mentorCard}>
              <View style={styles.mentorAvatar} />
              <Text style={styles.mentorName}>{name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40 // thêm padding dưới cho dễ cuộn
  },
  header: {
    marginBottom: 20
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A"
  },
  subtitle: {
    color: "#64748B",
    marginTop: 4
  },
  notification: {
    position: "absolute",
    top: 0,
    right: 0
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8
  },
  banner: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700"
  },
  bannerDesc: {
    color: "#E0F2FE",
    marginTop: 4
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop:10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A"
  },
  seeAll: {
    color: "#2563EB",
    fontWeight: "600"
  },
  categoryList: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },
  categoryItem: {
    backgroundColor: "#E0F2FE",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  categoryText: {
    color: "#0369A1",
    fontWeight: "600"
  },
  card: {
    backgroundColor: "#fff",
    width: 200,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  cardImage: {
    height: 100,
    backgroundColor: "#CBD5E1",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  cardContent: {
    padding: 12
  },
  cardTag: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 4
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A"
  },
  cardSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4
  },
  mentorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  mentorCard: {
    alignItems: "center",
    flex: 1
  },
  mentorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#CBD5E1",
    marginBottom: 6
  },
  mentorName: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "600"
  }
});
