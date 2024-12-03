import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import ScheduleScreen from "./components/ScheduleScreen";
import TaskScreen from "./components/TaskScreen"; // Ensure TaskScreen is imported
import CreateListPage from './components/createlist';
import AddItemsPage from './components/additem';
import NewItemPage from "./components/newitem";
import ChooseListPage from "./components/chooselist";
import EditListPage from "./components/editlist";
import NotificationPage from "./components/notification";

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
          options={{ title: "Schedule" }}
        />
        <Stack.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={{ title: "Tasks" }}
        />
        <Stack.Screen
          name="CreateList"
          component={CreateListPage}
          options={{ title: 'CreateList' }}
        />
        <Stack.Screen
          name="AddItems"
          component={AddItemsPage}
          options={{ title: 'Add Item' }}
        />
        <Stack.Screen
          name="NewItem"
          component={NewItemPage}
          options={{ title: 'New Item' }}
        />
        <Stack.Screen
          name="ChooseList"
          component={ChooseListPage}
          options={{ title: 'ChooseList' }}
        />
        <Stack.Screen
          name="EditList"
          component={EditListPage}
          options={{ title: 'EditList' }}
        />
        <Stack.Screen
          name="NotificationPage"
          component={NotificationPage}
          options={{ title: 'Notifications' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
