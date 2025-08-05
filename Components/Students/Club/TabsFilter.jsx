import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const tabs = [
  { key: "event", label: "Sự kiện" },
  { key: "blog", label: "Blogs" },
];

export default function TabsFilter({ selected, onSelect }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onSelect(tab.key)}
          style={{
            backgroundColor: selected === tab.key ? "#e7f3ff" : "transparent",
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 20,
            marginLeft: -55
          }}
        >
          <Text
            style={{
              color: selected === tab.key ? "#1877f2" : "#555",
              fontWeight: selected === tab.key ? "700" : "500"
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
