import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from './src/constants/Routes';
import IntroScreen from './src/screens/Intro/IntroScreen';
import MainScreen from './src/screens/MainScreen';
// import MapScreen from './src/screens/MapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.introScreen} component={IntroScreen} />
        <Stack.Screen name={ROUTES.mainScreen} component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
