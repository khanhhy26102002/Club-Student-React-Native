import React, { useEffect, useState, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { fetchBaseResponse } from "../../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskProgress = ({ tasks }) => {
  const [progress, setProgress] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (tasks.length === 0) {
      setProgress(0);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false
      }).start();
      return;
    }

    // Tính % hoàn thành
    const doneCount = tasks.filter(
      (t) => t.status.toUpperCase() === "DONE"
    ).length;
    const newProgress = (doneCount / tasks.length) * 100;
    setProgress(Math.round(newProgress));

    // Animate thanh tiến độ
    Animated.timing(animatedValue, {
      toValue: newProgress,
      duration: 800,
      useNativeDriver: false
    }).start();
  }, [tasks]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"]
  });

  return (
    <View style={{ marginVertical: 10 }}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[styles.progressBar, { width: widthInterpolated }]}
        />
      </View>
      <Text style={{ marginTop: 5, fontWeight: "bold" }}>
        {progress}% hoàn thành
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    overflow: "hidden"
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50"
  }
});

export default TaskProgress;
