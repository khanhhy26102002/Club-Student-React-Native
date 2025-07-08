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
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const ClubCreated = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Header />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>🎓 Câu lạc bộ bạn đang quản lý</Text>
          {data.length > 0 ? (
            data.map((club) => (
              <View key={club.clubId} style={styles.card}>
                <View style={styles.logoWrapper}>
                  {club.logoUrl ? (
                    <Image source={{ uri: club.logoUrl }} style={styles.logo} />
                  ) : (
                    <View style={styles.logoFallback}>
                      <Text style={styles.logoFallbackText}>No Logo</Text>
                    </View>
                  )}
                </View>

                <View style={styles.info}>
                  <Text style={styles.clubName}>{club.clubName}</Text>
                  <Text style={styles.role}>
                    Vai trò: <Text style={styles.roleValue}>{club.role}</Text>
                  </Text>

                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={() =>
                      Alert.alert(
                        "Lỗi",
                        "Mọi thông tin sẽ được xử lý trên phiên bản web."
                      )
                    }
                  >
                    <Text style={styles.manageButtonText}>Quản lý CLB</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Bạn chưa quản lý câu lạc bộ nào.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ClubCreated;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    padding: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1e293b"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  logoWrapper: {
    marginRight: 16,
    width: 64,
    height: 64
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover"
  },
  logoFallback: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center"
  },
  logoFallbackText: {
    fontSize: 10,
    color: "#64748b"
  },
  info: {
    flex: 1,
    justifyContent: "center"
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#0f172a"
  },
  role: {
    fontSize: 14,
    color: "#475569"
  },
  roleValue: {
    fontWeight: "bold",
    color: "#2563eb"
  },
  manageButton: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start"
  },
  manageButtonText: {
    color: "white",
    fontWeight: "600"
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    marginTop: 32
  }
});
