import { useRoute } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../Header/Header";
import { fetchBaseResponse } from "../../../utils/api";

const PaymentWebView = ({ navigation }) => {
  const route = useRoute();
  const { registrationId, paymentUrl, eventId, title } = route.params;

  const [paymentFinished, setPaymentFinished] = React.useState(false);

  // Hàm lấy query param từ URL
  const getQueryParam = (url, key) => {
    const match = url.match(new RegExp("[?&]" + key + "=([^&]+)"));
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Gửi orderCode về backend để xác nhận
  const notifyBackend = async (orderCode) => {
    try {
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        console.error("❌ Không có token, không thể gửi backend");
        return;
      }
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

  // Bắt sự kiện chuyển hướng trong WebView
  const handleNavigation = (navState) => {
    const url = navState.url;
    const status = getQueryParam(url, "status");
    const cancel = getQueryParam(url, "cancel");
    const orderCode = getQueryParam(url, "orderCode");

    console.log("🌐 Payment redirect URL:", url);

    // Thanh toán thành công
    if ((status === "COMPLETED" || status === "PAID") && cancel === "false") {
      setPaymentFinished(true);
      notifyBackend(orderCode);
      Alert.alert("✅ Thành công", "Thanh toán thành công!");
      navigation.navigate("Event", {
        screen: "EventRegistration",
        params: {
          eventId,
          title: title ?? route.params?.title
        }
      });
    }
    // Thanh toán thất bại hoặc bị hủy
    else if (
      status === "CANCELLED" ||
      status === "FAILED" ||
      cancel === "true"
    ) {
      setPaymentFinished(true);
      Alert.alert("❌ Thất bại", "Thanh toán đã bị huỷ hoặc thất bại.");
      navigation.navigate("Event", {
        screen: "EventRegistration",
        params: {
          eventId,
          title: title ?? route.params?.title
        }
      });
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
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log("🌐 Lỗi WebView:", nativeEvent.description);

          // Nếu lỗi do redirect localhost sau khi thanh toán thì quay về
          if (paymentFinished) {
            navigation.navigate("Event", {
              screen: "EventRegistration",
              params: {
                eventId,
                title: title ?? route.params?.title
              }
            });
          } else {
            Alert.alert("Lỗi", "Không thể tải trang thanh toán.");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default PaymentWebView;
