import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Event from "./Event";
import EventId from "./EventId";
import FormClub from "../Club/FormClub";
import FormRegister from "../Club/FormRegister";
import EventRegister from "./EventRegister";
import EventParticipate from "./EventParticipate";
import Payment from "../Payment/Payment";
import EventHistory from "./EventHistory";
import PaymentWebView from "../Payment/PaymentWebView";
import EventRoles from "./EventRoles";
import EventRolesId from "./EventRolesId";
import EventAssign from "./EventAssign";
import EventTask from "./EventTask";
const Stack = createNativeStackNavigator();
const EventStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventStack" component={Event} />
      <Stack.Screen name="EventId" component={EventId} />
      <Stack.Screen name="EventRegister" component={EventRegister} />
      <Stack.Screen name="EventRegistration" component={EventParticipate} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="History" component={EventHistory} />
      <Stack.Screen name="PaymentWebView" component={PaymentWebView} />
      <Stack.Screen name="EventRoles" component={EventRoles} />
      <Stack.Screen name="EventRolesId" component={EventRolesId} />
      <Stack.Screen name="EventAssign" component={EventAssign} />
      <Stack.Screen name="EventTask" component={EventTask} />
    </Stack.Navigator>
  );
};
export default EventStack;
