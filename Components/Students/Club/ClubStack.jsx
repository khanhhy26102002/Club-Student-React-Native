import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Club from "./Club";
import ClubId from "./ClubId";
import FormClub from "../Club/FormClub";
import FormRegister from "../Club/FormRegister";
import ClubRegisters from "./ClubRegisters";
import ClubCreated from "./ClubCreated";
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
    </Stack.Navigator>
  );
};

export default ClubStack;
