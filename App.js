import React, {
  useEffect, useRef,
} from 'react';
import {
  AppRegistry, LogBox, StatusBar,
} from 'react-native';
import {
  ApolloClient, InMemoryCache, ApolloProvider,
} from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ROUTES from './src/constants/Routes';
import MainScreen from './src/screens/MainScreen';
import TripScreen from './src/screens/Trip/TripScreen';
import MapScreen from './src/screens/MapScreen';
import InviteeScreen from './src/screens/Trip/InviteeScreen';
import LocationScreen from './src/screens/Trip/LocationScreen';
import ChecklistScreen from './src/screens/Trip/ChecklistScreen';
import ExpenseScreen from './src/screens/Trip/ExpenseScreen';
import IndividualExpenseScreen from './src/screens/Trip/IndividualExpenseScreen';
import MemoriesScreen from './src/screens/MemoriesScreen';
import CameraScreen from './src/screens/Trip/CameraScreen';
import SignUpScreen from './src/screens/Intro/SignUpScreen';
import InitDataCrossroads from './src/screens/InitDataCrossroads';
import ProfileScreen from './src/screens/ProfileScreen';
import toastConfig from './src/constants/ToastConfig';
import InvitationScreen from './src/screens/InvitationScreen';
import userStore from './src/stores/UserStore';
import AsyncStorageDAO from './src/utils/AsyncStorageDAO';
import PollScreen from './src/screens/Trip/PollScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import MyAccountScreen from './src/screens/MyAccount';
import META_DATA from './src/constants/MetaData';
import DocumentsScreen from './src/screens/Trip/DocumentsScreen';
import InternetCheckProvider from './src/Providers/InternetCheckProvider';
import PremiumModal from './src/components/PremiumModal';
import PacklistScreen from './src/screens/Trip/PacklistScreen';

const Stack = createNativeStackNavigator();

const asyncStorageDAO = new AsyncStorageDAO();

export default function App() {
  const updateUserData = userStore((state) => state.updateUserData);
  const { authToken } = userStore((state) => state.user);
  const navigationRef = useRef();

  const client = new ApolloClient({
    uri: `${META_DATA.baseUrl}/graphql`,
    // uri: 'http://10.100.31.188:4000/graphql',
    cache: new InMemoryCache(),
    headers: { Authorization: authToken || '' },
  });

  const checkAuth = async () => {
    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      updateUserData({ authToken: token });
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
    }),
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();// Ignore all log notifications
  });

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InternetCheckProvider>
          <ApolloProvider client={client}>
            <NavigationContainer
              ref={navigationRef}
            >
              <StatusBar barStyle="dark-content" />
              <Stack.Navigator
                screenOptions={{ headerShown: false }}
              >
                {/* <Stack.Screen
                name={ROUTES.cameraScreen}
                initialParams={{ tripId: '63c3e95eafa1d7827eb9c3bd' }}
                component={CameraScreen}
              /> */}
                <Stack.Screen
                  name={ROUTES.initDataCrossroads}
                  component={InitDataCrossroads}
                />
                <Stack.Screen
                  name={ROUTES.signUpScreen}
                  component={SignUpScreen}
                  initialParams={{ uploadReminderId: null }}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name={ROUTES.mainScreen}
                  component={MainScreen}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                  name={ROUTES.invitationScreen}
                  component={InvitationScreen}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen name={ROUTES.profileScreen} component={ProfileScreen} />
                <Stack.Screen
                  name={ROUTES.mapScreen}
                  initialParams={{ initTrip: null }}
                  component={MapScreen}
                />
                <Stack.Screen
                  name={ROUTES.tripScreen}
                  options={{ gestureEnabled: false }}
                  component={TripScreen}
                />
                <Stack.Screen name={ROUTES.inviteeScreen} component={InviteeScreen} />
                <Stack.Screen name={ROUTES.locationScreen} component={LocationScreen} />
                <Stack.Screen name={ROUTES.individualExpenseScreen} component={IndividualExpenseScreen} />
                <Stack.Screen name={ROUTES.expenseScreen} component={ExpenseScreen} />
                <Stack.Screen name={ROUTES.checklistScreen} component={ChecklistScreen} />
                <Stack.Screen
                  name={ROUTES.memoriesScreen}
                  initialParams={{ initShowStory: false }}
                  component={MemoriesScreen}
                />
                <Stack.Screen
                  name={ROUTES.cameraScreen}
                  initialParams={{ onNavBack: () => navigationRef.current?.navigate(ROUTES.mainScreen), preselectedImage: null }}
                  component={CameraScreen}
                />
                <Stack.Screen name={ROUTES.pollScreen} component={PollScreen} />
                <Stack.Screen name={ROUTES.documentsScreen} component={DocumentsScreen} />
                <Stack.Screen name={ROUTES.timelineScreen} component={TimelineScreen} />
                <Stack.Screen name={ROUTES.myAccountScreen} component={MyAccountScreen} />
                <Stack.Screen name={ROUTES.packlistScreen} component={PacklistScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ApolloProvider>
        </InternetCheckProvider>
      </GestureHandlerRootView>
      <PremiumModal />
      <Toast
        topOffset={60}
        position="top"
        config={toastConfig}
      />
    </>
  );
}
AppRegistry.registerComponent('MyApplication', () => App);
