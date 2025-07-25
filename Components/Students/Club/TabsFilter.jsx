import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'blog', label: 'Blogs' },
  { key: 'event', label: 'Sự kiện' },
];

export default function TabsFilter({ selected, onSelect }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      }}
    >
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onSelect(tab.key)}
          style={{
            backgroundColor: selected === tab.key ? '#e7f3ff' : 'transparent',
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              color: selected === tab.key ? '#1877f2' : '#555',
              fontWeight: selected === tab.key ? '700' : '500',
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
