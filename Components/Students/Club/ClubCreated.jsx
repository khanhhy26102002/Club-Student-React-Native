import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const ClubCreated = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse("/clubs/my-club-roles", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status: ${response.status}`);
        }
      } catch (error) {
        Alert.alert("Lỗi", error.message);
        console.error("Error: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>🎓 Câu lạc bộ bạn đang quản lý</Text>
        {data.length > 0 ? (
          data.map((club) => (
            <View key={club.clubId} style={styles.card}>
              <View style={styles.logoWrapper}>
                {club.logoUrl ? (
                  <Image
                    source={{ uri: club.logoUrl }}
                    style={styles.logo}
                  />
                ) : (
                  <View style={styles.logoFallback}>
                    <Text style={styles.logoFallbackText}>No Logo</Text>
                  </View>
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.clubName}>{club.clubName}</Text>
                <Text style={styles.role}>
                  Vai trò:{" "}
                  <Text style={styles.roleValue}>{club.role}</Text>
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Bạn chưa quản lý câu lạc bộ nào.</Text>
        )}
      </ScrollView>
    </>
  );
};

export default ClubCreated;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 220,
    backgroundColor: "#F3F4F6"
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3
  },
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover"
  },
  logoFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center"
  },
  logoFallbackText: {
    color: "#6B7280",
    fontSize: 10
  },
  info: {
    flex: 1
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827"
  },
  role: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4
  },
  roleValue: {
    color: "#10B981",
    fontWeight: "600"
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#9CA3AF"
  }
});
