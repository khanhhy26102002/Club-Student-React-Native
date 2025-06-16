import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const clubs = [
  { id: 1, title: "CLB Lập Trình", description: "Nơi học hỏi về code" },
  { id: 2, title: "CLB Thiết Kế", description: "Phát triển tư duy sáng tạo" },
  { id: 3, title: "CLB Nhiếp Ảnh", description: "Ghi lại khoảnh khắc đẹp" },
  {
    id: 4,
    title: "CLB Kinh Doanh",
    description: "Rèn luyện tư duy chiến lược"
  },
  { id: 5, title: "CLB Âm Nhạc", description: "Nơi thể hiện đam mê âm nhạc" },
  {
    id: 6,
    title: "CLB Thể Thao",
    description: "Tăng cường thể chất và tinh thần"
  }
];

const AboutId = () => {
  const route = useRoute();
  const { id } = route.params;

  const club = clubs.find((item) => item.id === id);

  if (!club) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy câu lạc bộ.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FontAwesome5
        name="users"
        size={40}
        color="#6366f1"
        style={styles.icon}
      />
      <Text style={styles.title}>{club.title}</Text>
      <Text style={styles.description}>{club.description}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Lợi ích khi tham gia:</Text>
        <Text style={styles.bullet}>• Giao lưu, mở rộng mạng lưới bạn bè</Text>
        <Text style={styles.bullet}>• Phát triển kỹ năng chuyên môn</Text>
        <Text style={styles.bullet}>• Cơ hội tham gia các sự kiện lớn</Text>
        <Text style={styles.bullet}>• Được cấp giấy chứng nhận hoạt động</Text>
      </View>
    </ScrollView>
  );
};

export default AboutId;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#eef2ff",
    alignItems: "center"
  },
  icon: {
    marginBottom: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4338ca",
    marginBottom: 12,
    textAlign: "center"
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    width: "100%"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937"
  },
  bullet: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 8
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40
  }
});
