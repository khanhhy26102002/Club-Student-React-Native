// screens/TransferLeadership.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { fetchBaseResponse } from "../../../utils/api";
import Header from "../../../Header/Header";
import { Ionicons } from "@expo/vector-icons";

export default function TransferLeadership() {
  const route = useRoute();
  const navigation = useNavigation();
  const { clubId } = route.params;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    const token = await AsyncStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const response = await fetchBaseResponse(`/api/clubs/${clubId}/members`, {
        headers
      });
      setMembers(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (newLeaderId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn chắc chắn muốn chuyển quyền lãnh đạo cho người này?",
      [
        { text: "Hủy" },
        {
          text: "Xác nhận",
          onPress: async () => {
            const token = await AsyncStorage.getItem("jwt");
            const headers = {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            };

            try {
              const res = await fetchBaseResponse(
                `/api/clubs/${clubId}/change-leader/${newLeaderId}`,
                {
                  method: "PUT",
                  headers,
                  data: { newLeaderId: newLeaderId }
                }
              );

              if (res.status === 200) {
                Alert.alert("✅ Thành công", "Đã chuyển quyền lãnh đạo.");
                navigation.goBack();
              } else {
                Alert.alert("❌ Lỗi", res.message || "Chuyển quyền thất bại");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("❌ Lỗi", err.message);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  return (
    <>
      <Header />
      <View style={{ flex: 1, padding: 16, backgroundColor: "#f0f2f5" }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            gap: 6
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1877f2" />
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#1877f2" }}>
            Quay lại
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#1c1e21",
            marginBottom: 12
          }}
        >
          Chọn thành viên để chuyển quyền
        </Text>

        <FlatList
          data={members}
          keyExtractor={(item) => item.userId.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", marginTop: 20, color: "#65676b" }}
            >
              Không có thành viên nào để chuyển quyền.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleTransfer(item.userId)}
              activeOpacity={0.85}
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#64b5f6",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}
                >
                  {item.fullName?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#050505",
                    marginBottom: 2
                  }}
                >
                  {item.fullName}
                </Text>
                <Text style={{ fontSize: 14, color: "#65676b" }}>
                  {item.email}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}
