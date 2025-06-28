import { StyleSheet, Text, View, ScrollView, Alert, Image } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
const AboutId = () => {
  const route = useRoute();
  const { clubId } = route.params;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse(`/clubs/public/${clubId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response || response.length === 0) {
          Alert.alert("Không hiển thị được data theo clubId");
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        Alert.alert(
          "Lỗi khi tải dữ liệu",
          typeof error?.message === "string"
            ? error.message
            : JSON.stringify(error)
        );
        console.error("Error: ", error);
      }
    };
    fetchData();
  }, [clubId]);

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {data && (
          <>
            <View style={styles.logoWrapper}>
              <Image source={{ uri: data.logoUrl }} style={styles.logo} />
            </View>

            <Text style={styles.title}>{data.name}</Text>
            <Text style={styles.description}>{data.description}</Text>

            <View style={styles.statusWrapper}>
              <Text
                style={[
                  styles.status,
                  { color: data.isActive ? "#10B981" : "#EF4444" }
                ]}
              >
                {data.isActive ? "🟢 Đang hoạt động" : "🔴 Ngừng hoạt động"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌟 Lợi ích khi tham gia</Text>
              <Text style={styles.bullet}>
                • Giao lưu, mở rộng mạng lưới bạn bè
              </Text>
              <Text style={styles.bullet}>• Phát triển kỹ năng chuyên môn</Text>
              <Text style={styles.bullet}>
                • Cơ hội tham gia các sự kiện lớn
              </Text>
              <Text style={styles.bullet}>
                • Được cấp giấy chứng nhận hoạt động
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default AboutId;
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center"
  },
  logoWrapper: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 100,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 20
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E3A8A",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 12
  },
  statusWrapper: {
    marginVertical: 10
  },
  status: {
    fontSize: 16,
    fontWeight: "600"
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12
  },
  bullet: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
    paddingLeft: 4
  }
});
