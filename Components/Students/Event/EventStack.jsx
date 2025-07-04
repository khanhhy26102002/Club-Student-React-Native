import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Event from "./Event";
import EventId from "./EventId";
import FormClub from "../Club/FormClub";
import FormRegister from "../Club/FormRegister";
import EventRegister from "./EventRegister";
const Stack = createNativeStackNavigator();
const EventStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventStack" component={Event} />
      <Stack.Screen name="EventId" component={EventId} />
      <Stack.Screen name="EventRegister" component={EventRegister} />
    
    </Stack.Navigator>
  );
};
export default EventStack;
