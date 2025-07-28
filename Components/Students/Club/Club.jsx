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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Club = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // ⬅️ Loading state
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/api/clubs/public", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
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
      onPress={() =>
        navigation.navigate("Club", {
          screen: "ClubId",
          params: { clubId: item.clubId }
        })
      }
    >
      <Image source={{ uri: item.logoUrl }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Header />
      {loading ? ( // ⬅️ Loading Indicator
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

                    navigation.navigate("Event", {
                      screen: "EventRegistration",
                      params: {
                        eventId: data.eventId,
                        title: data.title
                      }
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
                  <Icon name="account-group" size={18} color="#1E40AF" />
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
    backgroundColor: "#F8FAFC"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
    backgroundColor: "#F8FAFC"
  },

  container: {
    padding: 20,
    paddingBottom: 10
  },
  headerSection: {
    marginVertical: 24,
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1E3A8A",
    marginBottom: 8,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginHorizontal: 12,
    lineHeight: 22
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 14,
    marginBottom: 10,
    textAlign: "center"
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#E5E7EB"
  },
  cardContent: {
    padding: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4
  },
  markdown: {
    body: {
      fontSize: 16,
      color: "#1a1a1a",
      lineHeight: 22
    },
    heading1: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#004aad",
      marginBottom: 8
    },
    heading2: {
      fontSize: 20,
      fontWeight: "700",
      color: "#0055cc",
      marginBottom: 6
    },
    heading3: {
      fontSize: 18,
      fontWeight: "600",
      color: "#0066cc"
    },
    strong: {
      fontWeight: "bold",
      color: "#000"
    },
    em: {
      fontStyle: "italic"
    },
    list_item: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 4
    },
    bullet_list_icon: {
      color: "#004aad"
    },
    paragraph: {
      marginBottom: 8
    },
    link: {
      color: "#0077ee",
      textDecorationLine: "underline"
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: "#004aad",
      paddingLeft: 10,
      color: "#444",
      fontStyle: "italic",
      marginBottom: 8
    },
    code_inline: {
      backgroundColor: "#f0f0f0",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: "monospace",
      color: "#333"
    },
    code_block: {
      backgroundColor: "#f4f4f4",
      padding: 10,
      borderRadius: 8,
      fontFamily: "monospace",
      color: "#333",
      marginBottom: 10
    }
  },
  joinButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center"
  },
  joinText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13
  },
  section: {
    marginTop: 36,
    marginBottom: -60,
    paddingHorizontal: 8
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20
  },
  valueGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 12
  },

  valueCard: {
    width: "48%",
    backgroundColor: "#F0F4FF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3
  },

  iconCircle: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 50,
    marginBottom: 10
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 6
  },
  valueText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18
  },
  clubButton: {
    borderWidth: 1,
    borderColor: "#93C5FD", // Nhẹ nhàng hơn
    borderRadius: 999, // Full bo tròn
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#EFF6FF",
    alignSelf: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  clubButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  clubButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
    marginLeft: 8
  }
});
