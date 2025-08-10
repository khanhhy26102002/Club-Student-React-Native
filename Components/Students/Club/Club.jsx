import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Club = ({ navigation }) => {
  const [joinedClubs, setJoinedClubs] = React.useState([]);
  const [pendingClubs, setPendingClubs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (!token) {
          Alert.alert("Thông báo", "Vui lòng đăng nhập để xem câu lạc bộ");
          return;
        }

        // Fetch joined clubs
        const joinedRes = await fetchBaseResponse("/api/clubs/my-clubs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (joinedRes?.status === 200) {
          setJoinedClubs(joinedRes.data);
        }

        // Fetch all memberships to find pending ones
        const pendingRes = await fetchBaseResponse("/api/memberships", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (pendingRes?.status === 200) {
          const pending = pendingRes.data.filter(
            (item) => item.status === "PENDING"
          );
          setPendingClubs(pending);
        }
      } catch (error) {
        Alert.alert("Lỗi khi tải dữ liệu", error?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClubPress = (clubId) => {
    navigation.navigate("Club", {
      screen: "ClubGroup",
      params: { clubId },
    });
  };

  const renderClubCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleClubPress(item.clubId)}
    >
      <Image
        source={{ uri: item.logoUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text numberOfLines={2} style={styles.cardTitle}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPendingClubCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { opacity: 1 }]}
      activeOpacity={1}
    >
      <Image
        source={{ uri: item.logoUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text numberOfLines={2} style={styles.cardTitle}>
        {item.clubName}
      </Text>
      <Text style={styles.pendingLabel}>Đang chờ duyệt</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Header />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: "#6B7280" }}>
            Đang tải dữ liệu...
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Đã tham gia */}
          <View style={styles.header}>
            <Text style={styles.title}>Câu lạc bộ của bạn</Text>
            <Text style={styles.subtitle}>
              Đây là danh sách các câu lạc bộ bạn đã đăng ký và đang tham gia.
            </Text>
          </View>

          <Text style={styles.subHeading}>Danh sách câu lạc bộ đã tham gia</Text>
          <FlatList
            data={joinedClubs}
            keyExtractor={(item) => item.clubId.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            renderItem={renderClubCard}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Bạn chưa tham gia câu lạc bộ nào.</Text>
            }
          />

          {/* Đang chờ duyệt */}
          {/* <Text style={[styles.subHeading, { marginTop: 24 }]}>
            Danh sách câu lạc bộ đang chờ duyệt
          </Text>
          <FlatList
            data={pendingClubs}
            keyExtractor={(item) => item.clubId.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            renderItem={renderPendingClubCard}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không có câu lạc bộ nào đang chờ duyệt.</Text>
            }
          /> */}
        </ScrollView>
      )}
    </View>
  );
};

export default Club;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 0.48,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  pendingLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#F59E0B",
    fontStyle: "italic",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 16,
  },
});
