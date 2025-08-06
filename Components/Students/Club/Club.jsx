import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Club = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (!token) {
          Alert.alert("Thông báo", "Vui lòng đăng nhập để xem câu lạc bộ");
          return;
        }

        const response = await fetchBaseResponse("/api/clubs/my-clubs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (response?.status === 200 && response?.data?.length > 0) {
          setData(response.data);
        } else {
          setData([]);
          Alert.alert("Không tìm thấy câu lạc bộ đã tham gia");
        }
      } catch (error) {
        Alert.alert("Lỗi khi tải dữ liệu", error?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyClubs();
  }, []);

  const handleClubPress = (clubId) => {
    navigation.navigate("Club", {
      screen: "ClubGroup",
      params: { clubId }
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
        <FlatList
          scrollIndicatorInsets={{ bottom: 100 }}
          data={data}
          keyExtractor={(item) => item.clubId.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Câu lạc bộ của bạn</Text>
              <Text style={styles.subtitle}>
                Đây là danh sách các câu lạc bộ bạn đã đăng ký và đang tham gia.
              </Text>
              <Text style={styles.subHeading}>Danh sách Câu lạc bộ đã tham gia</Text>
            </View>
          }
          renderItem={renderClubCard}
        />
      )}
    </View>
  );
};

export default Club;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F3F4F6"
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: "center"
  },
  header: {
    paddingVertical: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 12,
    marginBottom: 16
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16
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
    elevation: 2
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "#E5E7EB"
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center"
  }
});
