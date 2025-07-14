import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Header from "../../../Header/Header";
import { useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";
import { fetchBaseResponse } from "../../../utils/api"; // tùy đường dẫn bạn
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentWebView = ({ navigation }) => {
  const route = useRoute();
  const { paymentUrl } = route.params;

  const getQueryParam = (url, key) => {
    const match = url.match(new RegExp("[?&]" + key + "=([^&]+)"));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const notifyBackend = async (orderCode) => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      const response = await fetchBaseResponse(
        "/payment/payos_transfer_handler",
        "POST",
        { orderCode },
        token
      );

      console.log("📡 Backend đã nhận thanh toán:", response);
    } catch (error) {
      console.error("❌ Lỗi khi gửi về backend:", error);
    }
  };

  const handleNavigation = (navState) => {
    const url = navState.url;
    const status = getQueryParam(url, "status");
    const cancel = getQueryParam(url, "cancel");
    const orderCode = getQueryParam(url, "orderCode");

    console.log("🌐 Payment redirect URL:", url);

    if (status === "COMPLETED" && cancel === "false") {
      notifyBackend(orderCode);
      Alert.alert("✅ Thành công", "Thanh toán thành công!");
      navigation.navigate("Main");
    } else if (
      status === "CANCELLED" ||
      status === "FAILED" ||
      cancel === "true"
    ) {
      Alert.alert("❌ Thất bại", "Thanh toán đã bị huỷ hoặc thất bại.");
      navigation.navigate("Main");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <WebView
        source={{ uri: paymentUrl }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.loader}
          />
        )}
        onNavigationStateChange={handleNavigation}
      />
    </View>
  );
};

export default PaymentWebView;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
