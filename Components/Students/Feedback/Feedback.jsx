import { View, Text, Alert, TextInput, Button } from "react-native";
import React from "react";
import Header from "../../../Header/Header";

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
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Góp ý cho sự kiện đã tham gia
        </Text>
        <TextInput
          value={feedback}
          onChangeText={setFeedBack}
          placeholder="Nội dung góp ý..."
          multiline
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            height: 120,
            textAlignVertical: "top",
            marginBottom: 20
          }}
        />
        <Button title="Gửi góp ý" onPress={handleSubmit} />
      </View>
    </>
  );
};

export default Feedback;
