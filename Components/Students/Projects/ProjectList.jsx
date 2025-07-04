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
        title: "Ứng dụng ToDo",
        description: "Ghi chú, nhắc nhở, deadline"
      },
      {
        id: 2,
        title: "CLB Công Nghệ",
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
        onPress={() => navigation.navigate("ProjectDetail", { id: item.id })}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => navigation.navigate("FeedBack", { eventId: item.id })}
        >
          <Text style={styles.feedbackButtonText}>Phản hồi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => joinProject(item.id)}
        >
          <Text style={styles.joinButtonText}>Tham gia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9faff"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12
  },
  feedbackButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0"
  },
  feedbackButtonText: {
    color: "#555",
    fontWeight: "600"
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#0077cc"
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "700"
  }
});

export default ProjectList;
