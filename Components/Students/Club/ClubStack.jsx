import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Club from "./Club";
import ClubId from "./ClubId";
import FormClub from "../Club/FormClub";
import FormRegister from "../Club/FormRegister";
import ClubRegisters from "./ClubRegisters";
import ClubCreated from "./ClubCreated";
import ClubRegistersId from "./ClubRegistersId";
import ClubGroup from "./ClubGroup";
import ClubGroupId from "./ClubGroupId";
import ClubMembership from "./ClubMembership";
import Membership from "./Membership";
import Blog from "../Blog/Blog";
const Stack = createNativeStackNavigator();
const ClubStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClubNo" component={Club} />
      <Stack.Screen name="ClubId" component={ClubId} />
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
      <Stack.Screen
        name="ClubList"
        component={ClubRegisters}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubCreate"
        component={ClubCreated}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubRegisterId"
        component={ClubRegistersId}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubGroup"
        component={ClubGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubGroupId"
        component={ClubGroupId}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClubMembership"
        component={ClubMembership}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Membership"
        component={Membership}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Blog"
        component={Blog}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ClubStack;
