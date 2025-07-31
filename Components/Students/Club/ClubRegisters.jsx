import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { stripMarkdown } from "../../../stripmarkdown";
const ClubRegisters = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse("/api/clubs/my-clubs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>🎓 Câu lạc bộ bạn đã tham gia</Text>
          <View style={styles.sectionUnderline} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : data.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#6B7280" }}>
            Bạn chưa tham gia câu lạc bộ nào.
          </Text>
        ) : (
          data.map((club) => (
            <TouchableOpacity
              key={club.clubId}
              onPress={() =>
                navigation.navigate("Club", {
                  screen: "ClubGroup",
                  params: {
                    clubId: club.clubId
                  }
                })
              }
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <Image
                  source={{
                    uri: club.logoUrl || "https://via.placeholder.com/80"
                  }}
                  style={styles.clubImage}
                />
                <View style={styles.clubInfo}>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <Text style={styles.description}>
                    {stripMarkdown(club.description)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );
};

export default ClubRegisters;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32
  },
  sectionTitleContainer: {
    marginBottom: 16,
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center"
  },
  sectionUnderline: {
    height: 5,
    width: "40%",
    backgroundColor: "#2563EB",
    marginTop: 6,
    alignSelf: "center",
    borderRadius: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center"
  },
  clubImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: "#F3F4F6"
  },
  clubInfo: {
    flex: 1,
    justifyContent: "center"
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: "#6B7280"
  },
  statusContainer: {
    alignItems: "flex-end",
    marginTop: -24,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  statusText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff"
  },
  approved: {
    backgroundColor: "#10B981"
  }
});
