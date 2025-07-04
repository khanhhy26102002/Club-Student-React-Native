import React from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from "react-native";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 0;
const CARD_WIDTH = (width - 21 * 2 - CARD_MARGIN * 1) / 2;

const ClubCard = ({ item, onPress }) => {
  const { t } = useTranslation();
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
      friction: 5,
      tension: 50,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.animatedCard,
        {
          transform: [{ scale: scaleAnim }],
          width: CARD_WIDTH,
          marginHorizontal: CARD_MARGIN
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.card}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.overlay} />

        <View style={styles.content}>
          {item.members && (
            <View style={styles.membersBadge}>
              <Text style={styles.membersText}>👥 {item.members}</Text>
            </View>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {t(item.titleKey)}
          </Text>

          <View style={styles.tags}>
            {item.tags?.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.moreBtn} onPress={onPress}>
            <Text style={styles.moreText}>{t("seeMore") || "Xem thêm"}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedCard: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    height: 240,
    justifyContent: "flex-end"
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  content: {
    padding: 16,
    position: "relative"
  },
  membersBadge: {
    position: "absolute",
    top: -18,
    right: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(6px)"
  },
  membersText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  tagText: {
    color: "#e0e0e0",
    fontSize: 12,
    fontWeight: "500"
  },
  moreBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff20",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10
  },
  moreText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600"
  }
});

export default ClubCard;
