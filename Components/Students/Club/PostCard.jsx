import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const screenWidth = Dimensions.get("window").width;

export default function PostCard({ data }) {
  const isEvent = data.type === "event";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginVertical: 10,
        width: screenWidth, // full screen width
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
        marginLeft: -5
      }}
    >
      {data.image && (
        <Image
          source={{ uri: data.image }}
          style={{ width: "100%", height: 190 }}
          resizeMode="cover"
        />
      )}

      <View style={{ padding: 14 }}>
        <View
          style={{
            backgroundColor: isEvent ? "#e3f2fd" : "#fff3e0",
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 8
          }}
        >
          <Text
            style={{
              color: isEvent ? "#1e88e5" : "#ef6c00",
              fontSize: 12,
              fontWeight: "600"
            }}
          >
            {isEvent ? "📅 Sự kiện" : "📝 Blog"}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            marginBottom: 6,
            color: "#333"
          }}
          numberOfLines={2}
        >
          {data.title}
        </Text>

        {isEvent ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#555", marginRight: 4 }}>
              📍 {data.location}
            </Text>
            <Icon
              name="clock"
              size={14}
              color="#888"
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: "#888" }}>
              {new Date(data.eventDate).toLocaleDateString()}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#555", marginBottom: 6, fontSize: 14 }}>
            ✍️ {data.authorName}{" "}
            <Text style={{ color: "#888" }}>
              · {new Date(data.createdAt).toLocaleDateString()}
            </Text>
          </Text>
        )}

        <TouchableOpacity
          style={{
            marginTop: 6,
            alignSelf: "flex-start",
            backgroundColor: "#1877f2",
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 20
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            Xem chi tiết
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
