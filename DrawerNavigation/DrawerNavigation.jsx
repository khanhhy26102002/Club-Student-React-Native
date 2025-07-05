import { createDrawerNavigator } from "@react-navigation/drawer";
import Navigation from "../Navigation/Navigation";
import { CustomDrawer } from "../CustomDrawer/CustomDrawer";
import ProjectStack from "../Components/Students/Projects/ProjectStack";
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
      <Drawer.Screen
        name="Project"
        component={ProjectStack}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
