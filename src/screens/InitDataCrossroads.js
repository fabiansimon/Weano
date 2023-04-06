import {
  Image, Linking, Platform, StatusBar, StyleSheet, View,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import {
  flushFailedPurchasesCachedAsPendingAndroid, initConnection, purchaseErrorListener, purchaseUpdatedListener,
} from 'react-native-iap';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import GET_INIT_USER_DATA from '../queries/getInitUserData';
import userStore from '../stores/UserStore';
import COLORS from '../constants/Theme';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import tripsStore from '../stores/TripsStore';
import UPDATE_USER from '../mutations/updateUser';
import Logo from '../../assets/images/logo_temp.png';

const asyncStorageDAO = new AsyncStorageDAO();

export default function InitDataCrossroads() {
  // QUERIES
  const [getInitData, { error, data }] = useLazyQuery(GET_INIT_USER_DATA);

  // MUTATIONS
  const [updateUser] = useMutation(UPDATE_USER);

  // STORES
  const { authToken, pushToken } = userStore((state) => state.user);
  const setTrips = tripsStore((state) => state.setTrips);
  const updateUserData = userStore((state) => state.updateUserData);

  // STATE & MISC
  const [init, setInit] = useState(false);
  const [notification, setNotification] = useState();
  const [deepLink, setDeepLink] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const navigation = useNavigation();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const registerPushNotificationToken = async () => {
    const { status: currentStatus } = Notifications.getPermissionsAsync();
    let finalStatus = currentStatus;

    if (currentStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return Toast.show({
        type: 'error',
        text1: i18n.t('Oh no!'),
        text2: i18n.t('We need permission to remind you!'),
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

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
      console.log(e);
    }
  };

  const handleNavigation = () => {
    if (authToken && !notification && !deepLink) {
      navigation.navigate(ROUTES.mainScreen);
      return;
    }

    if (authToken && notification && !deepLink) {
      if (notification.type === 'upload_reminder') {
        navigation.navigate(ROUTES.cameraScreen, { tripId: notification.tripId });
        return;
      }
      if (notification.type === 'expense_reminder') {
        navigation.navigate(ROUTES.tripScreen, { tripId: notification.tripId });
        return;
      }
      if (notification.type === 'task_reminder') {
        navigation.navigate(ROUTES.tripScreen, { tripId: notification.tripId });
        return;
      }
    }

    if (authToken && !notification && deepLink) {
      navigation.navigate(deepLink.screen, deepLink.params);
      return;
    }

    if (!authToken && notification && !deepLink) {
      if (notification.type === 'upload_reminder') {
        navigation.navigate(ROUTES.signUpScreen, { uploadReminderId: notification.tripId });
        return;
      }
    }

    if (!authToken && !notification && !deepLink) {
      navigation.navigate(ROUTES.navigate(ROUTES.signUpScreen));
    }
  };

  const checkInitStatus = async () => {
    if (authToken) {
      await registerPushNotificationToken();
      updateUserData({ authToken: token });
      await getInitData();
      return;
    }

    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      await registerPushNotificationToken();
      updateUserData({ authToken: token });
      setTimeout(() => {
        getInitData();
      }, 500);
    }

    if (!token && !authToken) {
      navigation.navigate(ROUTES.signUpScreen);
    }
  };

  const populateState = async () => {
    setInit(true);
    const res = data.getUserInitData;
    const {
      userData, trips, freeTierLimits, premiumTierLimits,
    } = res;

    await asyncStorageDAO.setFreeTierLimits(freeTierLimits);
    await asyncStorageDAO.setPremiumTierLimits(premiumTierLimits);

    if (trips) {
      setTrips(trips);
    }

    if (userData) {
      updateUserData(userData);
    }

    handleNavigation();
  };

  useEffect(() => {
    if (data && !init) {
      populateState();
    }

    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }
  }, [data, error]);

  useEffect(() => {
    checkInitStatus();
  }, [authToken]);

  useEffect(() => {
    checkInitStatus();
  }, []);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((n) => {
      if (n.notification) {
        setNotification(n.notification.request.content.data);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotification(response.notification.request.content.data);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (
      lastNotificationResponse
      && lastNotificationResponse.notification.request.content.data.url
      && lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      setNotification(lastNotificationResponse.notification.request.content.data);
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

  const handleOpenUrl = (event) => {
    navigateHandler(event.url);
  };

  const navigateHandler = async (url) => {
    if (url) {
      const route = url.match(/[\d\w]+$/);
      const tripId = route[0].toString();
      if (tripId < 24) {
        return;
      }

      if (url.includes('invitation')) {
        setDeepLink({
          screen: ROUTES.invitationScreen,
          params: { tripId },
        });
      }
    }
  };

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      navigateHandler(url);
    });
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', handleOpenUrl);
    }
    return () => {
      if (Platform.OS === 'ios') {
        Linking.removeAllListeners('url', handleOpenUrl);
      }
    };
  }, []);

  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;
    (() => {
      initConnection().then(() => {
        flushFailedPurchasesCachedAsPendingAndroid()
          .catch((err) => console.log(err))
          .then(() => {
            purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
              console.log(`purchase${purchase}`);
            });
          });
        purchaseErrorSubscription = purchaseErrorListener(
          (err) => {
            console.warn('purchaseErrorListener', err);
          },
        );
      });
    })();

    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseUpdateSubscription = null;
      purchaseErrorSubscription?.remove();
      purchaseErrorSubscription = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={Logo}
        resizeMode="center"
        style={{ flex: 1 }}
      />
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
