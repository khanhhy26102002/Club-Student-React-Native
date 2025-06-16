import { createNativeStackNavigator } from "@react-navigation/native-stack";
import About from "./About";
import AboutId from "./AboutId";
const Stack = createNativeStackNavigator();
const AboutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AboutNo" component={About} />
      <Stack.Screen name="AboutId" component={AboutId} />
    </Stack.Navigator>
  );
};

export default AboutStack;
