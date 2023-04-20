import React, {useEffect, useRef} from 'react';
import {LogBox, StatusBar, View} from 'react-native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorageDAO from './src/utils/AsyncStorageDAO';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import toastConfig from './src/constants/ToastConfig';
import userStore from './src/stores/UserStore';
import META_DATA from './src/constants/MetaData';
import InternetCheckProvider from './src/Providers/InternetCheckProvider';
import ROUTES from './src/constants/Routes';
import InitDataCrossroads from './src/screens/InitDataCrossroads';
import SignUpScreen from './src/screens/Intro/SignUpScreen';
import MainScreen from './src/screens/MainScreen';
import InvitationScreen from './src/screens/InvitationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';
import TripScreen from './src/screens/Trip/TripScreen';
import InviteeScreen from './src/screens/Trip/InviteeScreen';
// import LocationScreen from './src/components/Search/SearchModal';
import IndividualExpenseScreen from './src/screens/Trip/IndividualExpenseScreen';
import ExpenseScreen from './src/screens/Trip/ExpenseScreen';
import ChecklistScreen from './src/screens/Trip/ChecklistScreen';
import MemoriesScreen from './src/screens/MemoriesScreen';
import CameraScreen from './src/screens/Trip/CameraScreen';
import PollScreen from './src/screens/Trip/PollScreen';
import DocumentsScreen from './src/screens/Trip/DocumentsScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import MyAccountScreen from './src/screens/MyAccount';
import PacklistScreen from './src/screens/Trip/PacklistScreen';
import RegisterScreen from './src/screens/RegisterScreen';
// import PremiumModal from './src/components/PremiumModal';

const Stack = createNativeStackNavigator();

const asyncStorageDAO = new AsyncStorageDAO();

function App() {
  const updateUserData = userStore(state => state.updateUserData);
  const {authToken} = userStore(state => state.user);
  const navigationRef = useRef();

  const client = new ApolloClient({
    uri: `${META_DATA.baseUrl}/graphql`,
    // uri: 'http://10.100.31.19:4000/graphql',
    cache: new InMemoryCache(),
    headers: {Authorization: authToken || ''},
  });

  const checkAuth = async () => {
    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      updateUserData({authToken: token});
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
    }),
  });

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs(); // Ignore all log notifications
  });

  return (
    <>
      <InternetCheckProvider>
        <ApolloProvider client={client}>
          <NavigationContainer ref={navigationRef}>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen
                name={ROUTES.initDataCrossroads}
                component={InitDataCrossroads}
              />
              <Stack.Screen
                name={ROUTES.signUpScreen}
                initialParams={{uploadReminderId: null}}
                component={SignUpScreen}
                options={{gestureEnabled: false}}
              />
              <Stack.Screen
                name={ROUTES.mainScreen}
                component={MainScreen}
                options={{gestureEnabled: false}}
              />
              <Stack.Screen
                name={ROUTES.invitationScreen}
                // initialParams={{tripId: '640cda3fe90057102b89c66d'}}
                component={InvitationScreen}
                options={{gestureEnabled: false}}
              />
              <Stack.Screen
                name={ROUTES.profileScreen}
                component={ProfileScreen}
              />
              <Stack.Screen
                name={ROUTES.mapScreen}
                initialParams={{initTrip: null}}
                component={MapScreen}
              />
              <Stack.Screen
                name={ROUTES.tripScreen}
                options={{gestureEnabled: false}}
                component={TripScreen}
              />
              <Stack.Screen
                name={ROUTES.inviteeScreen}
                component={InviteeScreen}
              />
              {/* <Stack.Screen
                  name={ROUTES.locationScreen}
                  component={LocationScreen}
                /> */}
              <Stack.Screen
                name={ROUTES.individualExpenseScreen}
                component={IndividualExpenseScreen}
              />
              <Stack.Screen
                name={ROUTES.expenseScreen}
                component={ExpenseScreen}
              />
              <Stack.Screen
                name={ROUTES.checklistScreen}
                component={ChecklistScreen}
              />
              <Stack.Screen
                name={ROUTES.memoriesScreen}
                initialParams={{initShowStory: false}}
                component={MemoriesScreen}
              />
              <Stack.Screen
                name={ROUTES.cameraScreen}
                initialParams={{
                  onNavBack: () =>
                    navigationRef.current?.navigate(ROUTES.mainScreen),
                  preselectedImage: null,
                }}
                component={CameraScreen}
              />
              <Stack.Screen name={ROUTES.pollScreen} component={PollScreen} />
              <Stack.Screen
                name={ROUTES.documentsScreen}
                component={DocumentsScreen}
              />
              <Stack.Screen
                name={ROUTES.timelineScreen}
                component={TimelineScreen}
              />
              <Stack.Screen
                name={ROUTES.myAccountScreen}
                component={MyAccountScreen}
              />
              <Stack.Screen
                name={ROUTES.packlistScreen}
                component={PacklistScreen}
              />
              <Stack.Screen
                name={ROUTES.registerScreen}
                component={RegisterScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ApolloProvider>
      </InternetCheckProvider>
      {/* <PremiumModal /> */}
      <Toast topOffset={60} position="top" config={toastConfig} />
    </>
  );
}

export default App;
