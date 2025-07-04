import { View, Text, Button, Alert } from "react-native";
import React from "react";
import { sendProjectUpdateNotification } from "../../../utils/notification";
import Header from "../../../Header/Header";
// import axios from "axios"; // Tạm bỏ nếu chưa có API

const ProjectDetail = ({ route }) => {
  const { id } = route.params;
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    // Dữ liệu giả để test
    const mockProject = {
      id,
      title: "Ứng dụng ToDo",
      description: "Ghi chú công việc hằng ngày",
      advisor: { name: "Thầy Nam" },
      participants: ["An", "Bình", "Chi"],
      schedule: "Thứ 3 & Thứ 6 lúc 19:00"
    };
    setProject(mockProject);

    // Nếu bạn có API thật:
    /*
    axios
      .get(`http://localhost:3000/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch((err) => {
        console.log("Lỗi:", err);
        Alert.alert("Lỗi", "Không lấy được dữ liệu dự án");
      });
    */
  }, []);

  if (!project) {
    return <Text>Đang tải....</Text>;
  }

  return (
    <>
      <Header />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24 }}>{project.title}</Text>
        <Text>{project.description}</Text>
        <Text>Cố vấn: {project.advisor.name}</Text>
        <Text>Thành viên: {project.participants.join(", ")}</Text>
        <Text>Lịch họp: {project.schedule}</Text>

        <Button
          title="Gửi thông báo"
          onPress={() => sendProjectUpdateNotification(project)}
        />
      </View>
    </>
  );
};

export default ProjectDetail;
