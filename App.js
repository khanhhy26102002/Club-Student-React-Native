import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigation from "./DrawerNavigation/DrawerNavigation";
import Payment from "./Components/Students/Payment/Payment";
import LoginPage from "./Components/Login/LoginPage";
import RegisterPage from "./Components/Register/RegisterPage";
import React from "react";
import Feedback from "./Components/Students/Feedback/Feedback";
import * as Notifications from "expo-notifications";
import StudentOrganizer from "./Components/StudentOrganizer/StudentOrganizer";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
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
    registerForPushNotificationAsync();
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
        <Stack.Screen name="Organizer" component={StudentOrganizer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
async function registerForPushNotificationAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    return;
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo token:", token);
}
