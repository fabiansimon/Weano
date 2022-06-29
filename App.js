import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from './src/constants/Routes';
import IntroScreen from './src/screens/Intro/IntroScreen';
import MainScreen from './src/screens/MainScreen';
import TripScreen from './src/screens/Trip/TripScreen';
import MapScreen from './src/screens/MapScreen';
import InviteeScreen from './src/screens/Trip/InviteeScreen';
import AccomodationsScreen from './src/screens/Trip/AccomodationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.mainScreen} component={MainScreen} />
        <Stack.Screen name={ROUTES.mapScreen} component={MapScreen} />
        <Stack.Screen name={ROUTES.tripScreen} component={TripScreen} />
        <Stack.Screen name={ROUTES.introScreen} component={IntroScreen} />
        <Stack.Screen name={ROUTES.inviteeScreen} component={InviteeScreen} />
        <Stack.Screen name={ROUTES.accomodationsScreen} component={AccomodationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
