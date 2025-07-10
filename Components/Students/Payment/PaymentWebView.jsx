import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import Header from "../../../Header/Header";
import { useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";

const PaymentWebView = ({ navigation }) => {
  const route = useRoute();
  const { paymentUrl } = route.params;
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
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("status=COMPLETED")) {
            Alert.alert("✅ Thành công", "Thanh toán thành công!");
            navigation.navigate("Main");
          } else if (navState.url.includes("status=FAILED")) {
            Alert.alert("❌ Huỷ", "Thanh toán bị huỷ");
            navigation.navigate("Main");
          }
        }}
      />
    </View>
  );
};

export default PaymentWebView;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center"
  }
});
