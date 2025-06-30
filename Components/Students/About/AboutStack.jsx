import { createNativeStackNavigator } from "@react-navigation/native-stack";
import About from "./About";
import AboutId from "./AboutId";
import FormClub from "../Event/FormClub";
import FormRegister from "../Event/FormRegister";
const Stack = createNativeStackNavigator();
const AboutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AboutNo" component={About} />
      <Stack.Screen name="AboutId" component={AboutId} />
      <Stack.Screen
        name="FormClub"
        component={FormClub}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FormRegister"
        component={FormRegister}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AboutStack;
