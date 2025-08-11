import { useState } from "react";
//...

const PaymentWebView = ({ navigation }) => {
  const route = useRoute();
  const { registrationId, paymentUrl, qrCode, eventId } = route.params;

  const [paymentFinished, setPaymentFinished] = useState(false);

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

    if ((status === "COMPLETED" || status === "PAID") && cancel === "false") {
      setPaymentFinished(true); // báo đã thanh toán xong
      notifyBackend(orderCode);
      Alert.alert("✅ Thành công", "Thanh toán thành công!");
      navigation.navigate("Event", {
        screen: "EventRegistration"
      });
    } else if (
      status === "CANCELLED" ||
      status === "FAILED" ||
      cancel === "true"
    ) {
      setPaymentFinished(true); // cũng thoát khi thất bại hoặc hủy
      Alert.alert("❌ Thất bại", "Thanh toán đã bị huỷ hoặc thất bại.");
      navigation.navigate("Event", {
        screen: "EventRegistration"
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
          console.log("🌐 Đã chặn lỗi WebView:", nativeEvent.description);

          if (paymentFinished) {
            // Nếu đã hoàn thành thanh toán, lỗi loading page do redirect localhost thì cứ tắt WebView
            navigation.navigate("Event", {
              screen: "EventRegistration",
              params: {
                eventId: eventId
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

export default PaymentWebView;
