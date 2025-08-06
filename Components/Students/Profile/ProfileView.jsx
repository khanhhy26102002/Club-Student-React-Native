import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const ProfileView = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        const response = await fetchBaseResponse(`/api/users/getInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Lỗi", "Không nhận được dữ liệu từ userInfo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1877f2" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>Không có dữ liệu người dùng.</Text>
      </View>
    );
  }

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: data.avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{data.fullName}</Text>

        <View style={styles.infoWrapper}>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color="#2563eb" />
            <Text style={styles.infoText}>MSSV: {data.studentCode}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#2563eb" />
            <Text style={styles.infoText}>Email: {data.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#2563eb" />
            <Text style={styles.infoText}>
              Năm học: {renderYear(data.academicYear)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color="#2563eb" />
            <Text style={styles.infoText}>Ngành học: {data.majorName}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const renderYear = (year) => {
  switch (year) {
    case "YEAR_ONE":
      return "Năm nhất";
    case "YEAR_TWO":
      return "Năm hai";
    case "YEAR_THREE":
      return "Năm ba";
    case "YEAR_FOUR":
      return "Năm tư";
    default:
      return year;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    flexGrow: 1
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9"
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#60a5fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: "#fff"
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 24
  },
  infoWrapper: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  infoText: {
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center"
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8
  }
});

export default ProfileView;
