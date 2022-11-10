import React, { useEffect } from 'react';
import {
  AppRegistry, LogBox, StatusBar,
} from 'react-native';
import {
  ApolloClient, InMemoryCache, ApolloProvider,
} from '@apollo/client';
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
import SignUpScreen from './src/screens/Intro/SignUpScreen';
import InitDataCrossroads from './src/screens/InitDataCrossroads';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();// Ignore all log notifications
  });

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzVhZDA5N2VjMDA0YTc4MjNhMjFjNGYiLCJpYXQiOjE2NjgxMTEyNjIsImV4cCI6MTY2ODcxNjA2Mn0.5N7nsVnIld-CLJUt0tFFGuDjYQGbOGs8vFxzAvBjPoE';

  const client = new ApolloClient({
    uri: 'http://143.198.241.91:4000/graphql',
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
          <Stack.Screen
            name={ROUTES.mainScreen}
            component={MainScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name={ROUTES.initDataCrossroads} component={InitDataCrossroads} />
          <Stack.Screen
            name={ROUTES.signUpScreen}
            component={SignUpScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name={ROUTES.introScreen}
            component={IntroScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name={ROUTES.profileScreen} component={ProfileScreen} />
          <Stack.Screen name={ROUTES.mapScreen} component={MapScreen} />
          <Stack.Screen name={ROUTES.tripScreen} component={TripScreen} />
          <Stack.Screen name={ROUTES.dateScreen} component={DateScreen} />
          <Stack.Screen name={ROUTES.inviteeScreen} component={InviteeScreen} />
          <Stack.Screen name={ROUTES.accomodationsScreen} component={AccomodationsScreen} />
          <Stack.Screen name={ROUTES.locationScreen} component={LocationScreen} />
          <Stack.Screen name={ROUTES.chatScreen} component={ChatScreen} />
          <Stack.Screen name={ROUTES.individualExpenseScreen} component={IndividualExpenseScreen} />
          <Stack.Screen name={ROUTES.expenseScreen} component={ExpenseScreen} />
          <Stack.Screen name={ROUTES.checklistScreen} component={ChecklistScreen} />
          <Stack.Screen name={ROUTES.memoriesScreen} component={MemoriesScreen} />
          <Stack.Screen name={ROUTES.cameraScreen} component={CameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
AppRegistry.registerComponent('MyApplication', () => App);
