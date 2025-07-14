import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
// mai hỏi cái image-controller
const ClubId = ({ navigation }) => {
  const route = useRoute();
  const { clubId } = route.params;
  const [data, setData] = React.useState(null);
  const [membershipStatus, setMembershipStatus] = React.useState(null); // Trạng thái tham gia
  const { width } = useWindowDimensions();
  const [loading, setLoading] = React.useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchBaseResponse(`/api/clubs/public/${clubId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("API response:", response);

      // 👉 Thêm check cho response.status
      if (!response || response.status !== 200 || !response.data) {
        Alert.alert(
          "Không thể hiển thị câu lạc bộ",
          response?.message || "Dữ liệu không hợp lệ"
        );
        setData(null);
      } else {
        setData(response.data);
      }
    } catch (error) {
      Alert.alert("Lỗi khi tải dữ liệu", error?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const statusData = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(
        `/api/memberships/status?clubId=${clubId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Membership API data:", response.data);
      if (response.status === 200) {
        setMembershipStatus(response.data);
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      Alert.alert("Lỗi khi tải dữ liệu", error?.message || "Unknown error");
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      statusData();
    }, [clubId])
  );

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : data ? (
          <View style={styles.card}>
            <View style={styles.logoWrapper}>
              {data.logoUrl ? (
                <Image source={{ uri: data.logoUrl }} style={styles.logo} />
              ) : (
                <Text style={styles.logoFallback}>No Logo</Text>
              )}
            </View>

            <Text style={styles.title}>{data.name}</Text>
            <Text
              style={[
                styles.status,
                { color: data.isActive ? "#10B981" : "#EF4444" }
              ]}
            >
              {data.isActive ? "🟢 Đang hoạt động" : "🔴 Ngừng hoạt động"}
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📄 Giới thiệu</Text>
              <RenderHTML
                contentWidth={width - 48}
                source={{ html: data.description || "<p>Không có mô tả</p>" }}
                tagsStyles={htmlStyles}
              />
              <View>
                {membershipStatus === "APPROVED" ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Club", {
                        screen: "ClubGroup",
                        params: {
                          clubId: data.clubId,
                          userId: data.userId
                        }
                      })
                    }
                    style={styles.accessButton}
                  >
                    <Text style={styles.accessButtonText}>
                      🚪 Truy cập nhóm
                    </Text>
                  </TouchableOpacity>
                ) : membershipStatus === "PENDING" ? (
                  <View style={styles.pendingButton}>
                    <Text style={styles.pendingButtonText}>
                      ⏳ Đang chờ duyệt
                    </Text>
                  </View>
                ) : membershipStatus === "REJECTED" ? (
                  <View style={styles.rejectedButton}>
                    <Text style={styles.rejectedButtonText}>❌ Bị từ chối</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() =>
                      navigation.navigate("Club", {
                        screen: "FormRegister",
                        params: {
                          clubId: data.clubId
                        }
                      })
                    }
                  >
                    <Text style={styles.registerButtonText}>📝 Tham gia</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
};

export default ClubId;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100
  },
  accessButton: {
    backgroundColor: "#22c55e", // Xanh lá
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center"
  },
  accessButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  registerButton: {
    backgroundColor: "#2563eb", // Xanh dương
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center"
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  pendingButton: {
    backgroundColor: "#facc15", // Vàng
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center"
  },
  pendingButtonText: {
    color: "#1f2937",
    fontWeight: "600",
    fontSize: 16
  },
  rejectedButton: {
    backgroundColor: "#ef4444", // Đỏ
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center"
  },
  rejectedButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  container: {
    padding: 20,
    paddingBottom: 140,
    backgroundColor: "#F3F4F6",
    alignItems: "center"
  },
  registerButton: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  logoWrapper: {
    alignSelf: "center",
    backgroundColor: "#FFF7ED",
    padding: 12,
    borderRadius: 100,
    marginBottom: 20,
    elevation: 2
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover"
  },
  logoFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    textAlign: "center",
    lineHeight: 120,
    color: "#6B7280"
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E40AF",
    textAlign: "center",
    marginBottom: 4
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20
  },
  section: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10
  }
});
const markdownStyles = {
  body: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    textAlign: "left",
    alignSelf: "stretch",
    paddingHorizontal: 4
  },
  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    color: "#1F2937"
  },
  heading2: {
    fontSize: 20,
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "700"
  },
  heading3: {
    fontSize: 18,
    color: "#1F2937",
    marginTop: 14,
    marginBottom: 6,
    fontWeight: "600"
  },
  paragraph: {
    marginBottom: 10
  },
  list_item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6
  },
  list_item_content: {
    fontSize: 16,
    color: "#4B5563"
  },
  link: {
    color: "#2563EB",
    textDecorationLine: "underline"
  },
  code_inline: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
    color: "#111827"
  }
};
const htmlStyles = {
  p: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 10
  },
  h2: {
    fontSize: 20,
    color: "#111827",
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "700"
  },
  h3: {
    fontSize: 18,
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "600"
  },
  img: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 8
  },
  table: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 10
  },
  th: {
    backgroundColor: "#F3F4F6",
    padding: 6,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#D1D5DB"
  },
  td: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB"
  },
  iframe: {
    width: "100%",
    height: 200,
    borderRadius: 8
  }
};
