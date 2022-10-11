import React, { useEffect, useState } from 'react';
import {
  AppRegistry, LogBox, StatusBar,
} from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import CameraScreen from './src/screens/Trip/CameraScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();// Ignore all log notifications
  });

  const token = 'eyJphbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzQyZTFlYjQ5MWVlODQ3ZTIwMjVjMzgiLCJpYXQiOjE2NjUzMzE3MzYsImV4cCI6MTY2NTkzNjUzNn0.BvmGQ1t66Nmf9uacp1QWgl6EX548Xq6pFX76Up5l91c';

  const client = new ApolloClient({
    uri: 'http://192.168.1.164:4000/graphql',
    cache: new InMemoryCache(),
    headers: {
      Authorization: token,
    },
  });

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTES.cameraScreen} component={CameraScreen} />
          <Stack.Screen name={ROUTES.mainScreen} component={MainScreen} />
          <Stack.Screen name={ROUTES.mapScreen} component={MapScreen} />
          <Stack.Screen name={ROUTES.tripScreen} component={TripScreen} />
          <Stack.Screen name={ROUTES.introScreen} component={IntroScreen} />
          <Stack.Screen name={ROUTES.dateScreen} component={DateScreen} />
          <Stack.Screen name={ROUTES.inviteeScreen} component={InviteeScreen} />
          <Stack.Screen name={ROUTES.accomodationsScreen} component={AccomodationsScreen} />
          <Stack.Screen name={ROUTES.locationScreen} component={LocationScreen} />
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
