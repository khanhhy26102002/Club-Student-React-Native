import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Club = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/api/clubs/public", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response || response.length === 0) {
          Alert.alert("Không hiển thị được data club");
          setData([]);
        } else {
          setData(response.data);
        }
      } catch (error) {
        Alert.alert("Lỗi khi tải dữ liệu", error?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderClubCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("Club", {
          screen: "ClubId",
          params: { clubId: item.clubId },
        })
      }
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
              <Text style={styles.title}>🎓 Khám phá Câu lạc bộ</Text>
              <Text style={styles.subtitle}>
                Nơi kết nối đam mê, rèn luyện kỹ năng và phát triển bản thân
                trong môi trường năng động.
              </Text>

              <TouchableOpacity
                style={styles.clubButton}
                onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem("jwt");
                    if (!token) {
                      Alert.alert(
                        "Thông báo",
                        "Vui lòng đăng nhập để xem câu lạc bộ đã đăng ký"
                      );
                      return;
                    }

                    navigation.navigate("Club", {
                      screen: "ClubList",
                    });
                  } catch (err) {
                    Alert.alert(
                      "Lỗi",
                      "Không thể kiểm tra trạng thái đăng nhập."
                    );
                  }
                }}
              >
                <View style={styles.clubButtonContent}>
                  <Icon name="account-group" size={20} color="#1E40AF" />
                  <Text style={styles.clubButtonText}>
                    Câu lạc bộ đã đăng kí
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.subHeading}>📚 Danh sách các Câu lạc bộ</Text>
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
    color: "#1D4ED8",
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
  clubButton: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 20,
  },
  clubButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clubButtonText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
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
});
