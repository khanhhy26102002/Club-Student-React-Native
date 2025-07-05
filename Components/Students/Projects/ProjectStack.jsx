// navigation/ProjectStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";
const Stack = createNativeStackNavigator();

export default function ProjectStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectList" component={ProjectList} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
    </Stack.Navigator>
  );
}
