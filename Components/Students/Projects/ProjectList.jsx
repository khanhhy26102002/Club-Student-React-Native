import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from "react-native";
import Header from "../../../Header/Header";

const ProjectList = ({ navigation }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        title: "📋 Ứng dụng ToDo",
        description: "Ghi chú, nhắc nhở, deadline"
      },
      {
        id: 2,
        title: "💻 CLB Công Nghệ",
        description: "Website quản lý hoạt động CLB"
      }
    ];
    setProjects(mockProjects);
  }, []);

  const joinProject = (projectId) => {
    Alert.alert("✅ Đã gửi yêu cầu tham gia dự án ID " + projectId);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("Project", {
            screen: "ProjectDetail",
            params: { id: item.id }
          })
        }
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => navigation.navigate("FeedBack", { eventId: item.id })}
        >
          <Text style={styles.feedbackButtonText}>📝 Phản hồi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => joinProject(item.id)}
        >
          <Text style={styles.joinButtonText}>🚀 Tham gia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.headerText}>📂 Danh sách dự án</Text>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6"
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8
  },
  description: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 14
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12
  },
  feedbackButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "#e5e7eb"
  },
  feedbackButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#3b82f6"
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14
  }
});

export default ProjectList;
