import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
          "Content-Type": "application/json",
        },
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
        <Text style={styles.heading}>🎓 Câu lạc bộ đã tham gia</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>
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
                    clubId: club.clubId,
                  },
                })
              }
              activeOpacity={0.85}
              style={styles.card}
            >
              <Image
                source={{
                  uri: club.logoUrl || "https://via.placeholder.com/80",
                }}
                style={styles.avatar}
              />

              <View style={styles.info}>
                <Text style={styles.name}>{club.name}</Text>
                <Text style={styles.desc}>
                  {stripMarkdown(club.description)}
                </Text>
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
    paddingBottom: 32,
    backgroundColor: "#F3F4F6",
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1D4ED8",
    textAlign: "center",
    marginBottom: 24,
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginTop: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: "#60A5FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E5E7EB",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#6D6D80",
  },
});
