import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
const ClubRegisters = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse("/memberships", {
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
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>🎓 Câu lạc bộ bạn đã đăng kí</Text>
          <View style={styles.sectionUnderline} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          data.map((membership) => (
            <View key={membership.membershipId} style={styles.card}>
              <Text style={styles.clubName}>
                🏛️ Tên câu lạc bộ: {membership.clubName}
              </Text>

              <View style={styles.badgeWrapper}>
                <Text style={styles.statusLabel}>📌 Trạng thái:</Text>
                <View
                  style={[
                    styles.badge,
                    membership.status === "APPROVED"
                      ? styles.approved
                      : membership.status === "PENDING"
                      ? styles.pending
                      : styles.rejected
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {membership.status === "APPROVED"
                      ? "✅ Đã được duyệt"
                      : membership.status === "PENDING"
                      ? "⏳ Chờ duyệt"
                      : "❌ Từ chối"}
                  </Text>
                </View>
              </View>

              <Text style={styles.joinDate}>
                📅 Ngày tham gia:{" "}
                {new Date(membership.joinDate).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
};

export default ClubRegisters;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    paddingBottom: 230,
    backgroundColor: "#F9FAFB"
  },
  sectionTitleContainer: {
    marginBottom: 20,
    marginTop: 10,
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "center"
  },
  sectionUnderline: {
    width: 60,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 4,
    marginTop: 6
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  clubName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 10
  },
  badgeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap"
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151"
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E5E7EB"
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff"
  },
  approved: {
    backgroundColor: "#10B981" // xanh lá
  },
  pending: {
    backgroundColor: "#F59E0B" // vàng
  },
  rejected: {
    backgroundColor: "#EF4444" // đỏ
  },

  joinDate: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center"
  }
});

const markdownStyles = {
  body: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textAlign: "center" // canh giữa văn bản
  },
  heading2: {
    fontSize: 17,
    color: "#111827",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center"
  },
  heading3: {
    fontSize: 16,
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "600",
    textAlign: "center"
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "center"
  },
  list_item_content: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center"
  }
};
