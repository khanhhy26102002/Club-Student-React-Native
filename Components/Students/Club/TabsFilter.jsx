import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";

const tabs = [
  { key: "event", label: "Sự kiện" },
  { key: "blog", label: "Blogs" }
];

export default function TabsFilter({ selected, onSelect }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 8
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onSelect(tab.key)}
          activeOpacity={0.7} // tạo hiệu ứng mờ khi nhấn
          style={{
            backgroundColor: selected === tab.key ? "#adadaeff" : "transparent",
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 20,
            shadowColor: selected === tab.key ? "#000" : "transparent",
            shadowOpacity: selected === tab.key ? 0.08 : 0,
            shadowRadius: 3,
            width: 150
          }}
        >
          <Text
            style={{
              color: selected === tab.key ? "#1877f2" : "#555",
              fontWeight: selected === tab.key ? "700" : "500",
              fontSize: 14,
              textAlign: "center",
              marginLeft: -8
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
