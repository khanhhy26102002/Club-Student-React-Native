import BlogId from "./BlogId";
import Blog from "./Blog";
const {
  createNativeStackNavigator
} = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();
const BlogStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Blog" component={Blog} />
      <Stack.Screen name="BlogId" component={BlogId} />
    </Stack.Navigator>
  );
};
export default BlogStack;