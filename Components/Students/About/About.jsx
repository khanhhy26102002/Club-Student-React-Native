import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Header from "../../../Header/Header";
import { useTranslation } from "react-i18next";
import { fetchBaseResponse } from "../../../utils/api";
import React from "react";
const About = ({ navigation }) => {
  const { t } = useTranslation();
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/clubs/public", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response || response.length === 0) {
          Alert.alert("Không hiển thị được data club");
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        const errorMessage =
          typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error);

        Alert.alert("Error fetching data club", errorMessage);
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎓 Giới thiệu các câu lạc bộ</Text>
          <Text style={styles.subtitle}>
            Khám phá những câu lạc bộ nổi bật của trường — nơi phát triển kỹ
            năng, tạo dựng đam mê và kết nối bạn bè.
          </Text>
        </View>
        <View style={styles.cardGrid}>
          {data.map((item) => (
            <View key={item.clubId} style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("About", {
                    screen: "AboutId",
                    params: { clubId: item.clubId }
                  })
                }
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.logoUrl }}
                    style={styles.image}
                    resizeMode="cover" // hoặc "contain", tùy ý
                  />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("Event", {
                    screen: "FormClub"
                  })
                }
              >
                <Text style={styles.buttonText}>🚀 Tham gia ngay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("whyChooseUs")}</Text>
          <View style={styles.valueGrid}>
            {[
              {
                icon: "users",
                title: t("value1Title"),
                text: t("value1Text")
              },
              {
                icon: "calendar-alt",
                title: t("value2Title"),
                text: t("value2Text")
              },
              {
                icon: "star",
                title: t("value3Title"),
                text: t("value3Text")
              }
            ].map((item, index) => (
              <View key={index} style={styles.valueCard}>
                <FontAwesome5
                  name={item.icon}
                  size={24}
                  color="#6366f1"
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.valueTitle}>{item.title}</Text>
                <Text style={styles.valueText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4fc",
    padding: 16
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: "center",
    paddingHorizontal: 12
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4338ca",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24
  },
  cardGrid: {
    gap: 16
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60 // ảnh tròn, bỏ nếu muốn góc bo nhẹ
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4f46e5"
  },
  cardDesc: {
    fontSize: 15,
    color: "#4b5563",
    marginTop: 6,
    lineHeight: 22
  },
  button: {
    marginTop: 16,
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    borderRadius: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15
  },
  section: {
    marginTop: 48,
    marginBottom: 36,
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4f46e5",
    marginBottom: 24
  },
  valueGrid: {
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 12
  },
  valueCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
    marginBottom: 16
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1f2937",
    textAlign: "center"
  },
  valueText: {
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center"
  }
});

export default About;
