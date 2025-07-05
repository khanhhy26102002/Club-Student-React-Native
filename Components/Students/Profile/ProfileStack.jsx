import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import Contact from "../Contact/Contact";
import ProjectStack from "../Projects/ProjectStack";
import Feedback from "../Feedback/Feedback";
const Stack = createNativeStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileNo" component={Profile} />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Project"
        component={ProjectStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedBack"
        component={Feedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
