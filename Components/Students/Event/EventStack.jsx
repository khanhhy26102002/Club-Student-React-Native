import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Event from "./Event";
import EventId from "./EventId";
import FormClub from "./FormClub";
import FormRegister from "./FormRegister";
const Stack = createNativeStackNavigator();
const EventStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventStack" component={Event} />
      <Stack.Screen name="EventId" component={EventId} />
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
export default EventStack;
