import { View, Text, Button, Alert, StyleSheet } from "react-native";
import React from "react";
import { sendProjectUpdateNotification } from "../../../utils/notification";
import Header from "../../../Header/Header";

const ProjectDetail = ({ route }) => {
  const { id } = route.params;
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    const mockProject = {
      id,
      title: "Ứng dụng ToDo",
      description: "Ghi chú công việc hằng ngày",
      advisor: { name: "Thầy Nam" },
      participants: ["An", "Bình", "Chi"],
      schedule: "Thứ 3 & Thứ 6 lúc 19:00"
    };
    setProject(mockProject);
  }, []);

  if (!project) return <Text style={styles.loadingText}>Đang tải...</Text>;

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>{project.title}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>📄 Mô tả:</Text>
          <Text style={styles.value}>{project.description}</Text>

          <Text style={styles.label}>👨‍🏫 Cố vấn:</Text>
          <Text style={styles.value}>{project.advisor.name}</Text>

          <Text style={styles.label}>👥 Thành viên:</Text>
          <Text style={styles.value}>{project.participants.join(", ")}</Text>

          <Text style={styles.label}>🕒 Lịch họp:</Text>
          <Text style={styles.value}>{project.schedule}</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="🔔 Gửi thông báo"
            color="#10b981"
            onPress={() => sendProjectUpdateNotification(project)}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flex: 1
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#6b7280"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#374151",
    marginTop: 10
  },
  value: {
    fontSize: 15,
    color: "#4b5563",
    marginTop: 2
  },
  buttonWrapper: {
    marginTop: 20
  }
});

export default ProjectDetail;
