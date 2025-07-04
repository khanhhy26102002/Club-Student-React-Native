import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import Contact from "../Contact/Contact";
import ProjectList from "../Projects/ProjectList";
import ProjectDetail from "../Projects/ProjectDetail";
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
        component={ProjectList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProjectDetail"
        component={ProjectDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
