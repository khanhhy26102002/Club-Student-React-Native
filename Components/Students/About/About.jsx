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
    <TouchableOpacity
      style={styles.card}
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
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() =>
            navigation.navigate("About", {
              screen: "FormClub"
            })
          }
        >
          <Text style={styles.joinText}>🚀 {t("joinNow")}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Header />
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
                },
                {
                  icon: "star",
                  title: t("value3Title"),
                  text: t("value3Text")
                },
              ].map((item, index) => (
                <View key={index} style={styles.valueCard}>
                  <View style={styles.iconCircle}>
                    <FontAwesome5 name={item.icon} size={20} color="#4F46E5" />
                  </View>
                  <Text style={styles.valueTitle}>{item.title}</Text>
                  <Text style={styles.valueText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        }
        renderItem={renderClubCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  container: {
    padding: 20,
    paddingBottom: 70
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
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10
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
  }
});

export default About;
