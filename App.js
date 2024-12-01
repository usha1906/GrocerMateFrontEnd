import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen"; // Adjust the path if needed
import ScheduleScreen from "./components/ScheduleScreen"; // Adjust the path if needed
import TaskScreen from "./components/TaskScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{ title: "Schedule Tasks" }}
        />
        <Stack.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: "Tasks" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}