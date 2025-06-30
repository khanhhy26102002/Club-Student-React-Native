import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Header from "../../../Header/Header";
import { useTranslation } from "react-i18next";
import { fetchBaseResponse } from "../../../utils/api";

const About = ({ navigation }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBaseResponse("/clubs/public", {
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
      }
    };
    fetchData();
  }, []);

  const renderClubCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate("About", {
            screen: "AboutId",
            params: { clubId: item.clubId }
          })
        }
      >
        <Image source={{ uri: item.logoUrl }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("About", {
            screen: "FormClub"
          })
        }
      >
        <Text style={styles.buttonText}>🚀 Tham gia ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Header />
      <FlatList
        data={data}
        keyExtractor={(item) => item.clubId.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>🎓 Khám phá Câu lạc bộ</Text>
            <Text style={styles.subtitle}>
              Nơi kết nối đam mê, rèn luyện kỹ năng và phát triển bản thân trong
              môi trường năng động.
            </Text>
            <Text style={styles.subHeading}>📚 Danh sách các Câu lạc bộ</Text>
          </View>
        }
        ListFooterComponent={
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
                    size={22}
                    color="#6366f1"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={styles.valueTitle}>{item.title}</Text>
                  <Text style={styles.valueText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        }
        renderItem={renderClubCard}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32
  },
  header: {
    marginTop: 16,
    marginBottom: 20,
    alignItems: "center"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 24,
    marginBottom: 12
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  image: {
    width: "100%",
    height: 120
  },
  cardContent: {
    padding: 10
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 13,
    color: "#6b7280"
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 13
  },
  section: {
    marginTop: 30,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 16
  },
  valueGrid: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  valueCard: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center"
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center"
  },
  valueText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center"
  }
});

export default About;
