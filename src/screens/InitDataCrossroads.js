import {
  ActivityIndicator,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import * as Notifications from 'expo-notifications';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery, useMutation} from '@apollo/client';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import GET_INIT_USER_DATA from '../queries/getInitUserData';
import userStore from '../stores/UserStore';
import COLORS from '../constants/Theme';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import tripsStore from '../stores/TripsStore';
import UPDATE_USER from '../mutations/updateUser';
import Logo from '../../assets/images/logo_temp.png';
import * as TaskManager from 'expo-task-manager';
import Purchases from 'react-native-purchases';
import Body from '../components/typography/Body';
import Utils from '../utils';

const asyncStorageDAO = new AsyncStorageDAO();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function InitDataCrossroads({route}) {
  // PARAMS
  const {inviteId} = route.params;

  // QUERIES
  const [getInitData, {data, error}] = useLazyQuery(GET_INIT_USER_DATA, {
    fetchPolicy: 'network-only',
  });

  // MUTATIONS
  const [updateUser] = useMutation(UPDATE_USER);

  // STORES
  const {authToken, pushToken} = userStore(state => state.user);
  const setTrips = tripsStore(state => state.setTrips);
  const updateUserData = userStore(state => state.updateUserData);
  const clearUserData = userStore(state => state.clearUserData);

  // STATE & MISC
  const [init, setInit] = useState(false);
  const [notification, setNotification] = useState();
  const [deepLink, setDeepLink] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const navigation = useNavigation();

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({data}) => {
    setNotification(data.body);
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

  const clearToken = () => {
    asyncStorageDAO.logout();
    clearUserData();
    setTimeout(() => {
      checkInitStatus();
    }, 100);
  };

  const registerPushNotificationToken = async () => {
    const {status: currentStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = currentStatus;

    if (currentStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: 'de5514f3-d75a-40d5-80f9-c8ff0fba37f5',
      })
    ).data;

    if (!token) {
      return;
    }

    if (token === pushToken) {
      return;
    }

    const updatedUser = {};
    updatedUser.pushToken = token;

    try {
      await updateUser({
        variables: {
          user: updatedUser,
        },
      });
    } catch (e) {
      console.error(e);
      clearToken();
    }
  };

  const handleNavigation = () => {
    if (authToken && inviteId) {
      return navigation.push(ROUTES.invitationScreen, {tripId: inviteId});
    }

    if (authToken && !notification && !deepLink) {
      return navigation.push(ROUTES.mainScreen);
    }

    if (authToken && notification && !deepLink) {
      if (notification.type === 'upload_reminder') {
        return navigation.push(ROUTES.cameraScreen, {
          tripId: notification.tripId,
        });
      }
      if (notification.type === 'expense_reminder') {
        return navigation.push(ROUTES.tripScreen, {
          tripId: notification.tripId,
        });
      }
      if (notification.type === 'task_reminder') {
        return navigation.push(ROUTES.tripScreen, {
          tripId: notification.tripId,
        });
      }
    }

    if (authToken && !notification && deepLink) {
      return navigation.push(deepLink.screen, deepLink.params);
    }
    if (!authToken && !notification && deepLink) {
      return navigation.push(ROUTES.signUpScreen, {
        inviteId: deepLink.params.tripId,
      });
    }

    if (!authToken && notification && !deepLink) {
      if (notification.type === 'upload_reminder') {
        return navigation.push(ROUTES.signUpScreen, {
          uploadReminderId: notification.tripId,
        });
      }
    }

    if (!authToken && !notification && !deepLink) {
      return navigation.push(ROUTES.signUpScreen);
    }
  };

  const checkInitStatus = async () => {
    if (authToken) {
      registerPushNotificationToken();
      updateUserData({authToken: token});
      getInitData().catch(e => {
        console.error(e);
        clearToken();
      });
      return;
    }

    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      registerPushNotificationToken();
      updateUserData({authToken: token});
      setTimeout(() => {
        getInitData().catch(e => {
          console.error(e);
          clearToken();
        });
      }, 500);
    }

    if (!token && !authToken) {
      navigation.navigate(ROUTES.signUpScreen);
    }
  };

  const populateState = async () => {
    setInit(true);
    const res = data.getUserInitData;
    const {userData, trips, freeTierLimits, premiumTierLimits} = res;

    await asyncStorageDAO.setFreeTierLimits(freeTierLimits);
    await asyncStorageDAO.setPremiumTierLimits(premiumTierLimits);

    let isProMember = false;

    const customerInfo = true ? {} : await Purchases.getCustomerInfo();

    if (customerInfo?.entitlements?.active?.pro) {
      isProMember = true;
    }

    if (trips) {
      setTrips(trips);
    }

    if (userData) {
      updateUserData({
        ...userData,
        isProMember,
      });
    }

    handleNavigation();
  };

  useEffect(() => {
    if (data && !init) {
      populateState();
    }
  }, [data]);

  useEffect(() => {
    checkInitStatus();
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(n => {
        if (n.notification) {
          setNotification(n.notification.request.content.data);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        setNotification(response.notification.request.content.data);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      setNotification(
        lastNotificationResponse.notification.request.content.data,
      );
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    if (!notification) {
      return;
    }
    handleNavigation();
  }, [notification]);

  useEffect(() => {
    if (!deepLink) {
      return;
    }
    handleNavigation();
  }, [deepLink]);

  const handleOpenUrl = event => {
    navigateHandler(event.url);
  };

  const navigateHandler = async url => {
    if (url) {
      const route = url.match(/[\d\w]+$/);
      const tripId = route[0].toString();
      if (tripId < 24) {
        return;
      }

      if (url.includes('invitation')) {
        setDeepLink({
          screen: ROUTES.invitationScreen,
          params: {tripId, fromDeeplink: true},
        });
      }
    }
  };

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      navigateHandler(url);
    });
    Linking.addEventListener('url', handleOpenUrl);
    return () => {
      Linking.removeAllListeners('url', handleOpenUrl);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Image source={Logo} resizeMode="contain" style={{height: 150}} />
      </View>
      <View style={{position: 'absolute', bottom: '10%'}}>
        <ActivityIndicator color={COLORS.shades[0]} />
        <Body
          type={2}
          text={i18n.t('Loading...')}
          style={{marginTop: 6}}
          color={Utils.addAlpha(COLORS.neutral[50], 0.8)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary[700],
  },
});
