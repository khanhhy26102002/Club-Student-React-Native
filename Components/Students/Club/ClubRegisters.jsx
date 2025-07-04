import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { fetchBaseResponse } from "../../../utils/api";
import Markdown from "react-native-markdown-display";
import html2md from "html-to-md";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
const ClubRegisters = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse("/clubs/my-clubs", {
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
      }
    };
    fetchData();
  }, []);
  return (
    <>
    <Header/>
      <ScrollView contentContainerStyle={styles.container}>
        {data.map((club) => (
          <View key={club.clubId} style={styles.card}>
            <View style={styles.logoWrapper}>
              {club.logoUrl ? (
                <Image source={{ uri: club.logoUrl }} style={styles.logo} />
              ) : (
                <Text style={styles.logoFallback}>No Logo</Text>
              )}
            </View>

            <Text style={styles.title}>{club.name}</Text>

            <Text
              style={[
                styles.status,
                { color: club.isActive ? "#10B981" : "#EF4444" }
              ]}
            >
              {club.isActive ? "🟢 Đang hoạt động" : "🔴 Ngừng hoạt động"}
            </Text>

            <View style={styles.markdownWrapper}>
              <Markdown style={markdownStyles}>
                {html2md(club.description || "")}
              </Markdown>
            </View>
          </View>
        ))}
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
  card: {
    width: "100%",
    padding: 20,
  },
  logoWrapper: {
    alignSelf: "center",
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 100,
    marginBottom: 16,
    elevation: 3
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: "cover"
  },
  logoFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E5E7EB",
    textAlign: "center",
    lineHeight: 90,
    color: "#6B7280",
    fontSize: 14
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D4ED8",
    textAlign: "center",
    marginBottom: 4
  },
  status: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
    color: "#10B981"
  },
  markdownWrapper: {
    marginTop: 4,
    alignItems: "flex-start"
  }
});

const markdownStyles = {
  body: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textAlign: "left"
  },
  heading2: {
    fontSize: 17,
    color: "#111827",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "700"
  },
  heading3: {
    fontSize: 16,
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "600"
  },
  paragraph: {
    marginBottom: 6
  },
  list_item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4
  },
  list_item_content: {
    fontSize: 15,
    color: "#4B5563"
  }
};

