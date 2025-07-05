import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from "react-native";
import React from "react";
import Header from "../../../Header/Header";
import { LinearGradient } from "expo-linear-gradient";

const Feedback = ({ route }) => {
  const { eventId } = route.params;
  const [feedback, setFeedBack] = React.useState("");

  const handleSubmit = () => {
    if (!feedback.trim()) {
      return Alert.alert("Vui lòng nhập nội dung góp ý");
    }
    console.log("Gửi feedback:", { eventId, feedback });
    Alert.alert("Cảm ơn bạn!", "Phản hồi của bạn đã được ghi nhận.");
    setFeedBack("");
  };

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Avatar + tiêu đề */}
          <View style={styles.headerSection}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4712/4712107.png"
              }}
              style={styles.icon}
            />
            <Text style={styles.title}>Góp ý cho sự kiện bạn đã tham gia</Text>
            <Text style={styles.subtitle}>
              Chúng tôi rất trân trọng phản hồi từ bạn 💙
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <TextInput
              value={feedback}
              onChangeText={setFeedBack}
              placeholder="Hãy viết góp ý của bạn một cách chi tiết..."
              placeholderTextColor="#9ca3af"
              multiline
              style={styles.textArea}
            />

            {/* Gradient Button */}
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9}>
              <LinearGradient
                colors={["#2563eb", "#1d4ed8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Gửi góp ý</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Feedback;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6
  },
  textArea: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    height: 140,
    fontSize: 15,
    color: "#111827",
    textAlignVertical: "top",
    backgroundColor: "#f9fafb",
    marginBottom: 20
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
