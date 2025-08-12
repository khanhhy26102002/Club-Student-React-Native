import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated
} from "react-native";

export default function PaymentSuccessScreen({ navigation }) {
  // Hiệu ứng động khi load màn hình
  const scaleAnim = new Animated.Value(0.7);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png"
          }}
          style={styles.imgSuccess}
        />
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.subtitle}>Cảm ơn bạn đã đặt hàng 🌟</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation && navigation.navigate("Home")}
        >
          <Text style={styles.btnText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAFBF2",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#fff",
    padding: 38,
    borderRadius: 23,
    alignItems: "center",
    elevation: 15,
    shadowColor: "#72c48f",
    shadowOpacity: 0.23,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  imgSuccess: {
    width: 90,
    height: 90,
    marginBottom: 25,
    tintColor: "#10C469"
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#10C469",
    marginBottom: 7
  },
  subtitle: {
    fontSize: 17,
    color: "#666",
    marginBottom: 33
  },
  btn: {
    backgroundColor: "#10C469",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    shadowColor: "#10C469",
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.8
  }
});
