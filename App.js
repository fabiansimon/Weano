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
import toastConfig from './src/constants/ToastConfig';
import InvitationScreen from './src/screens/InvitationScreen';
import userStore from './src/stores/UserStore';
import AsyncStorageDAO from './src/utils/AsyncStorageDAO';
import PollScreen from './src/screens/Trip/PollScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import MyAccountScreen from './src/screens/MyAccount';
import i18n from './src/utils/i18n';
import PushNotificationProvider from './src/providers/PushNotificationProvider';

const Stack = createNativeStackNavigator();

const asyncStorageDAO = new AsyncStorageDAO();

export default function App() {
  const updateUserData = userStore((state) => state.updateUserData);
  const { authToken } = userStore((state) => state.user);
  const notificationsListener = useRef();
  const navigationRef = useRef();

  const client = new ApolloClient({
    uri: 'http://143.198.241.91:4000/graphql',
    cache: new InMemoryCache(),
    headers: { Authorization: authToken || '' },
  });

  const checkAuth = async () => {
    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      updateUserData({ authToken: token });
    }
  };

  const handlePushTap = (response) => {
    const { data } = response.notification.request.content;
    if (data && authToken) {
      navigationRef.current?.navigate(ROUTES.cameraScreen, { tripId: data.upload_reminder_id });
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
    notificationsListener.current = Notifications.addNotificationResponseReceivedListener((response) => handlePushTap(response));

    return () => {
      Notifications.removeNotificationSubscription(notificationsListener.current);
    };
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();// Ignore all log notifications
  });

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ApolloProvider client={client}>
          <NavigationContainer
            ref={navigationRef}
          >
            <PushNotificationProvider>

              <StatusBar barStyle="dark-content" />
              <Stack.Navigator
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen
                  name={ROUTES.initDataCrossroads}
                  component={InitDataCrossroads}
                />

                <Stack.Screen
                  name={ROUTES.signUpScreen}
                  component={SignUpScreen}
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
                <Stack.Screen
                  name={ROUTES.introScreen}
                  component={IntroScreen}
                  options={{ gestureEnabled: false }}
                />
                <Stack.Screen name={ROUTES.profileScreen} component={ProfileScreen} />
                <Stack.Screen name={ROUTES.mapScreen} component={MapScreen} />
                <Stack.Screen
                  name={ROUTES.tripScreen}
                  options={{ gestureEnabled: false }}
                  component={TripScreen}
                />
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
                <Stack.Screen name={ROUTES.pollScreen} component={PollScreen} />
                <Stack.Screen name={ROUTES.timelineScreen} component={TimelineScreen} />
                <Stack.Screen name={ROUTES.myAccountScreen} component={MyAccountScreen} />
              </Stack.Navigator>
            </PushNotificationProvider>
          </NavigationContainer>
        </ApolloProvider>
      </GestureHandlerRootView>
      <Toast
        topOffset={60}
        position="top"
        config={toastConfig}
      />
    </>
  );
}
AppRegistry.registerComponent('MyApplication', () => App);
