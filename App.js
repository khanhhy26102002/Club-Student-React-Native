import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigation from "./DrawerNavigation/DrawerNavigation";
import Payment from "./Components/Students/Payment/Payment";
import LoginPage from "./Components/Login/LoginPage";
import RegisterPage from "./Components/Register/RegisterPage";
import React from "react";
import * as Notifications from "expo-notifications";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import { getFirebaseToken } from "./getFirebaseToken";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import CheckIn from "./Components/Students/CheckIn/CheckIn";
import ChangePasswordScreen from "./Components/ChangePassword/ChangePasswordScreen";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});
const Stack = createNativeStackNavigator();
export default function App() {
  React.useEffect(() => {
    getFirebaseToken()
      .then((token) => {
        if (token) {
          console.log("✅ Push Token:", token);
        } else {
          console.log("⚠️ Không nhận được token.");
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi hàm:", err);
      });
  });
  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "229693370621-o5k3ssjmvn9uuol6a9klo71ukc3mvpfe.apps.googleusercontent.com",
      offlineAccess: true,
      googlePlayServicesAuthVersion: "19.2.0"
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={DrawerNavigation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CHECKIN"
          component={CheckIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
