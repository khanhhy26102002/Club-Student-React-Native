import React from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 24 * 2 - CARD_MARGIN * 2) / 2; // spacing giữa 2 card và 2 bên ngoài
const ClubCard = ({ item }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    }).start();
  };
  const { t } = useTranslation();
  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        width: CARD_WIDTH,
        marginHorizontal: CARD_MARGIN
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardTextWrapper}>
          <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {t(item.descriptionKey)}
          </Text>
          {item.members && (
            <View style={styles.metaRow}>
              <Text style={styles.members}>👥 {item.members} thành viên</Text>
              <View style={styles.tagsContainer}>
                {item.tags?.slice(0, 2).map((tag, index) => (
                  <Text key={index} style={styles.tag}>
                    #{tag}
                  </Text>
                ))}
              </View>
            </View>
          )}
          <Text style={styles.readMore}>Xem thêm →</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    width: "100%"
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover"
  },
  cardTextWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1c1c1e"
  },
  cardDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18
  },
  readMore: {
    marginTop: 8,
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
    alignSelf: "flex-start"
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4
  },
  members: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500"
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 4
  },
  tag: {
    backgroundColor: "#EAF4FF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600"
  }
});


export default ClubCard;
