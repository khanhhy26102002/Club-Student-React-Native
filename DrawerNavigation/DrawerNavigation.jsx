import { createDrawerNavigator } from "@react-navigation/drawer";
import Navigation from "../Navigation/Navigation";
import { CustomDrawer } from "../CustomDrawer/CustomDrawer";
const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Navigation"
        component={Navigation}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
