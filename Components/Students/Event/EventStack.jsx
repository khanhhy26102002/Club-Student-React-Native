import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Event from "./Event";
import EventId from "./EventId";
import FormClub from "../Club/FormClub";
import FormRegister from "../Club/FormRegister";
import EventRegister from "./EventRegister";
import EventParticipate from "./EventParticipate";
import Payment from "../Payment/Payment";
const Stack = createNativeStackNavigator();
const EventStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventStack" component={Event} />
      <Stack.Screen name="EventId" component={EventId} />
      <Stack.Screen name="EventRegister" component={EventRegister} />
      <Stack.Screen name="EventRegistration" component={EventParticipate} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
};
export default EventStack;
