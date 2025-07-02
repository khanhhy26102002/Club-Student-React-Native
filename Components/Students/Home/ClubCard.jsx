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
const CARD_MARGIN = 1;
const CARD_WIDTH = (width - 24 * 2 - CARD_MARGIN * 2) / 2;

const ClubCard = ({ item, onPress }) => {
  const { t } = useTranslation();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.card}
      >
        <Image source={{ uri: item.image }} style={styles.image} />

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
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedCard: {
    marginBottom: 18,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#121212",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    height: 220,
    justifyContent: "flex-end"
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  content: {
    padding: 14,
    position: "relative"
  },
  membersBadge: {
    position: "absolute",
    top: -20,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: "rgba(255,255,255,0.3)"
  },
  membersText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff"
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap"
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },
  tagText: {
    color: "#E0E0E0",
    fontSize: 12,
    fontWeight: "500"
  }
});

export default ClubCard;
