import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import Header from "../../../Header/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";

const FormBlog = () => {
  const route = useRoute();
  const { clubId } = route.params;

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("jwt");
    try {
      const response = await fetchBaseResponse(`/api/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
        // body: JSON.stringify({ title, content, isActive, clubId }) // nếu cần
      });
    } catch (error) {
      console.log("Submit error:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Chủ đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Mời bạn nhập chủ đề"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Mời bạn nhập nội dung"
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Trạng thái hiển thị</Text>
          <View style={styles.switchRow}>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#d1d5db", true: "#10b981" }}
              thumbColor={isActive ? "#ffffff" : "#f3f4f6"}
            />
            <Text style={styles.statusText}>
              {isActive ? "Đang bật" : "Đang tắt"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Tạo Blog</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 16,
    color: "#111827"
  },
  multiline: {
    height: 120
  },
  switchContainer: {
    marginTop: 24
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  statusText: {
    fontSize: 16,
    color: "#6b7280"
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 32
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default FormBlog;
