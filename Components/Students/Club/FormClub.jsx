import React from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from "react-native";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import QuillEditor from "../../QuillEditor";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@env";
const screenWidth = Dimensions.get("window").width;
const FormClub = () => {
  const scrollViewRef = React.useRef(null);
  const quillRef = React.useRef(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [data, setData] = React.useState([]);
  const [logoFile, setLogoFile] = React.useState(null);
  const [mentorId, setMentorId] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const fetchData = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const response = await fetchBaseResponse("/api/clubs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.map((club) => club.name.toLowerCase());
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingNames = await fetchData();

    if (!name) {
      Alert.alert(
        "⚠️ Thiếu thông tin",
        "Vui lòng nhập đủ các trường bắt buộc."
      );
      return;
    }

    const htmlDescription = await quillRef.current.getHtml();
    if (!htmlDescription || htmlDescription.trim() === "") {
      Alert.alert("⚠️ Thiếu mô tả", "Vui lòng nhập mô tả cho CLB.");
      return;
    }

    const trimmedName = name.trim().toLowerCase();
    const isDuplicate = existingNames.includes(trimmedName);
    if (isDuplicate) {
      Alert.alert(
        "❌ Trùng tên",
        "Tên CLB đã tồn tại. Vui lòng chọn tên khác."
      );
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\sÀ-ỹ\-]{3,}$/;
    if (!nameRegex.test(trimmedName)) {
      Alert.alert(
        "⚠️ Tên không hợp lệ",
        "Tên CLB phải có ít nhất 3 ký tự và không chứa ký tự đặc biệt."
      );
      return;
    }

    const mentorNumber = Number(mentorId);
    if (isNaN(mentorNumber) || mentorNumber <= 0) {
      Alert.alert("⚠️ Mentor không hợp lệ", "Vui lòng chọn một mentor hợp lệ.");
      return;
    }

    if (!logoFile) {
      Alert.alert("⚠️ Thiếu ảnh", "Vui lòng chọn ảnh logo cho CLB.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwt");

      const uploadUrl = `${API_URL}/api/clubs/create-club`;

      console.log("📤 Submitting with:", logoFile);

      const result = await FileSystem.uploadAsync(uploadUrl, logoFile.uri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "logoFile", // Tên field backend expect
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        parameters: {
          name,
          description: htmlDescription,
          mentorId: mentorId.toString()
        }
      });

      const responseJson = JSON.parse(result.body);
      console.log("📥 Server response:", responseJson);

      if (
        responseJson.message ===
        "Your request to create the club has been successfully submitted and is currently awaiting approval."
      ) {
        Alert.alert("🎉 Thành công", "Câu lạc bộ đã được gửi để xét duyệt.");
      } else if (
        responseJson.message ===
        "You have already submitted a club creation request"
      ) {
        Alert.alert(
          "Thất bại",
          "Bạn chỉ được tạo 1 câu lạc bộ. Yêu cầu đã tồn tại."
        );
      } else {
        Alert.alert(
          "✅ Phản hồi",
          responseJson.message || "Gửi yêu cầu thành công."
        );
      }
    } catch (error) {
      console.log("❌ Error:", error);

      Alert.alert("❌ Lỗi", "Không thể gửi yêu cầu: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      try {
        const response = await fetchBaseResponse(`/api/users/mentors`, {
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
      }
    };
    fetchData();
  }, []);
  React.useEffect(() => {
    if (logoFile) console.log("🖼️ LogoFile đã được set:", logoFile);
  }, [logoFile]);

  const handlePickImage = async () => {
    // 1. Yêu cầu quyền truy cập
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền bị từ chối",
        "Bạn cần cấp quyền truy cập ảnh để chọn logo."
      );
      return;
    }
    console.log("handlePickImage called");
    // 2. Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    console.log("handlePickImage result:", result);

    // 3. Xử lý ảnh đã chọn
    if (!result.canceled && result.assets?.length > 0) {
      const picked = result.assets[0];
      const uri = picked.uri;
      const fileName = picked.fileName || `image_${Date.now()}.jpg`;

      const extension = fileName.split(".").pop()?.toLowerCase();
      const mimeType =
        extension === "png"
          ? "image/png"
          : extension === "jpg" || extension === "jpeg"
          ? "image/jpeg"
          : "image/*";

      const imageFile = {
        uri,
        name: fileName,
        type: mimeType
      };

      setLogoFile(imageFile);
      console.log("🖼️ LogoFile đã được set:", imageFile);
    }
  };

  const renderField = (
    label,
    iconName,
    value,
    setValue,
    placeholder,
    multiline = false,
    keyboardType = "default"
  ) => (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Icon
          name={iconName}
          size={18}
          color="#ff6600"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, multiline && styles.textarea]}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          multiline={multiline}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        >
          <Header />
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Tạo Câu Lạc Bộ</Text>
            <Text style={styles.bannerSubtitle}>
              Điền đầy đủ thông tin để gửi yêu cầu tạo CLB của bạn.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {renderField(
              "Tên CLB *",
              "group",
              name,
              setName,
              "Nhập tên câu lạc bộ"
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>📄 Miêu tả *</Text>
              <View style={styles.editorWrapper}>
                <QuillEditor
                  ref={quillRef}
                  initialHtml={description}
                  style={styles.editor}
                  containerStyle={styles.editorContainer}
                  theme="light"
                  placeholder="Nhập miêu tả ở đây..."
                />
              </View>
            </View>

            <View style={{ marginBottom: 18 }}>
              <Text style={styles.label}>🖼️ Logo CLB</Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Clicked");
                  handlePickImage();
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  alignItems: "center",
                  backgroundColor: "#fff"
                }}
              >
                <Text style={{ color: "#ff6600", fontWeight: "600" }}>
                  {logoFile ? "📝 Đổi ảnh" : "📷 Chọn ảnh từ thiết bị"}
                </Text>
              </TouchableOpacity>

              {logoFile && (
                <Image
                  source={{ uri: logoFile.uri }}
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    height: 180,
                    marginTop: 12,
                    borderRadius: 10,
                    alignSelf: "center"
                  }}
                  resizeMode="contain"
                />
              )}
            </View>

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Icon
                  name="badge"
                  size={18}
                  color="#ff6600"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.label}>Người phụ trách *</Text>
              </View>

              <View style={{ marginBottom: 18 }}>
                <Text
                  style={{
                    color: "#1f2937",
                    fontWeight: "500",
                    marginBottom: 6
                  }}
                >
                  Chọn mentor
                </Text>
                <View
                  style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: -5
                  }}
                >
                  <Picker
                    selectedValue={mentorId}
                    onValueChange={(itemValue) => setMentorId(itemValue)}
                    style={{
                      height: 60,
                      backgroundColor: "#fff", // fix nền trắng
                      color: "#000", // fix chữ đen
                      borderRadius: 10,
                      paddingHorizontal: 8
                    }}
                  >
                    {data.map((mentor) => (
                      <Picker.Item
                        key={mentor.userId || mentor.email}
                        label={`${mentor.fullName} (${mentor.email})`}
                        value={mentor.userId}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Gửi Yêu Cầu</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10
  },
  banner: {
    backgroundColor: "#fff4ec",
    padding: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: "center",
    shadowColor: "#ff7a00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },

  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6600",
    marginBottom: 6
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center"
  },
  formContainer: {
    padding: 16,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center"
  },
  field: {
    marginBottom: 18
  },
  fieldContainer: {
    marginBottom: 50,
    marginLeft: -10,

  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333"
  },
  editorWrapper: {
    height: 100, // ✅ chiều cao thu gọn
    padding: 10,
    minHeight: 70,
    marginBottom: -20,
    width: 400
  },
  editor: {
    flex: 1,
    fontSize: 14
  },
  editorContainer: {
    width: screenWidth - 16, // ✅ full width trừ padding (ví dụ: 16px mỗi bên)
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "center" // ✅ canh giữa nếu cần
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827"
  },
  textarea: {
    height: 100,
    textAlignVertical: "top"
  },
  button: {
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#ff6600",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    marginTop: 8
  },
  buttonDisabled: {
    backgroundColor: "#d4d4d8"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});

export default FormClub;
