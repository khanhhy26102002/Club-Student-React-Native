import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";
import Header from "../../../Header/Header";

const UpdateBlog = () => {
  const route = useRoute();
  const { blogId } = route.params;
  
  return (
    <View>
      <Header />
      <Text></Text>
    </View>
  );
};

export default UpdateBlog;
