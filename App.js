import React, { useEffect, useState } from 'react';
import {
  AppRegistry, LogBox, StatusBar, Text, View,
} from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import ROUTES from './src/constants/Routes';
import IntroScreen from './src/screens/Intro/IntroScreen';
import MainScreen from './src/screens/MainScreen';
import TripScreen from './src/screens/Trip/TripScreen';
import MapScreen from './src/screens/MapScreen';
import InviteeScreen from './src/screens/Trip/InviteeScreen';
import AccomodationsScreen from './src/screens/Trip/AccomodationsScreen';
import LocationScreen from './src/screens/Trip/LocationScreen';
import DateScreen from './src/screens/Trip/DateScreen';
import ChatScreen from './src/screens/Trip/ChatScreen';
import ChecklistScreen from './src/screens/Trip/ChecklistScreen';
import ExpenseScreen from './src/screens/Trip/ExpenseScreen';
import IndividualExpenseScreen from './src/screens/Trip/IndividualExpenseScreen';
import MemoriesScreen from './src/screens/MemoriesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();// Ignore all log notifications
  });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
  });

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <IntroScreen />
      </NavigationContainer>
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTES.mainScreen} component={MainScreen} />
          <Stack.Screen name={ROUTES.mapScreen} component={MapScreen} />
          <Stack.Screen name={ROUTES.tripScreen} component={TripScreen} />
          <Stack.Screen name={ROUTES.introScreen} component={IntroScreen} />
          <Stack.Screen name={ROUTES.inviteeScreen} component={InviteeScreen} />
          <Stack.Screen name={ROUTES.accomodationsScreen} component={AccomodationsScreen} />
          <Stack.Screen name={ROUTES.locationScreen} component={LocationScreen} />
          <Stack.Screen name={ROUTES.dateScreen} component={DateScreen} />
          <Stack.Screen name={ROUTES.chatScreen} component={ChatScreen} />
          <Stack.Screen name={ROUTES.individualExpenseScreen} component={IndividualExpenseScreen} />
          <Stack.Screen name={ROUTES.expenseScreen} component={ExpenseScreen} />
          <Stack.Screen name={ROUTES.checklistScreen} component={ChecklistScreen} />
          <Stack.Screen name={ROUTES.memoriesScreen} component={MemoriesScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
AppRegistry.registerComponent('MyApplication', () => App);
