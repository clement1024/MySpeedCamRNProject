import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './containers/LoginPage';
import DashboardPage from './containers/DashboardPage';
import SearchEventsPage from './containers/LoginPage';
import EventDetailPage from './containers/LoginPage';
import WifiSetupPage from './containers/WifiSetupPage';

const Stack = createStackNavigator();


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="Setup" component={WifiSetupPage} />
        <Stack.Screen name="SearchEvents" component={SearchEventsPage} />
        <Stack.Screen name="Event" component={EventDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;