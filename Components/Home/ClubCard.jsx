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
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
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
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.6)"]}
          style={styles.overlay}
        />

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

          <LinearGradient
            colors={["#2563EB", "#1D4ED8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.moreBtn}
          >
            <Text style={styles.moreText}>{t("seeMore") || "Xem thêm"}</Text>
          </LinearGradient>
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
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    height: 250,
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
    borderRadius: 20
  },
  content: {
    padding: 14,
    position: "relative"
  },
  membersBadge: {
    position: "absolute",
    top: -18,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
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
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  tagText: {
    color: "#f0f0f0",
    fontSize: 12,
    fontWeight: "500"
  },
  moreBtn: {
    alignSelf: "flex-start",
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
