import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "../Components/Students/Home/Homepage";
import Contact from "../Components/Students/Contact/Contact";
import BlogStack from "../Components/Students/Blog/BlogStack";
import EventStack from "../Components/Students/Event/EventStack";
import AboutStack from "../Components/Students/About/AboutStack";
const Tab = createBottomTabNavigator();
const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "About") iconName = "alert-circle-outline";
          else if (route.name === "Contact") iconName = "call-outline";
          else if (route.name === "Event") iconName = "remove-circle-sharp";
          else if (route.name === "Profile") iconName = "person-circle-sharp";
          else if (route.name === "Blog") iconName = "document-text-outline";
          const iconSize = focused ? 28 : 24;
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: "black",
          height: 70,
          borderTopWidth: 0,
          elevation: 5
        },
        tabBarActiveTintColor: "#42f44b",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5
        },
        tabBarItemStyle: {
          borderRadius: 10,
          paddingVertical: 10,
          marginHorizontal: 5
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={Homepage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Event"
        component={EventStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="About"
        component={AboutStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Blog"
        component={BlogStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
