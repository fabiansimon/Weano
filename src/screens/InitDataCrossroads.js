import {
  Image, Linking, Platform, StyleSheet, View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import GET_INIT_USER_DATA from '../queries/getInitUserData';
import activeTripStore from '../stores/ActiveTripStore';
import recapTripStore from '../stores/RecapTripStore';
import userStore from '../stores/UserStore';
import COLORS from '../constants/Theme';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import tripsStore from '../stores/TripsStore';
import { usePushNotificationContext } from '../providers/PushNotificationProvider';
import UPDATE_USER from '../mutations/updateUser';
import Logo from '../../assets/images/logo_temp.png';

const asyncStorageDAO = new AsyncStorageDAO();

export default function InitDataCrossroads() {
  const [getInitData, { loading, error, data }] = useLazyQuery(GET_INIT_USER_DATA);
  const [updateUser] = useMutation(UPDATE_USER);
  const [init, setInit] = useState(false);
  const [requestedRoute, setRequestedRoute] = useState(null);
  const { authToken, pushToken } = userStore((state) => state.user);
  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);
  const setRecapTrip = recapTripStore((state) => state.setRecapTrip);
  const setTrips = tripsStore((state) => state.setTrips);
  const updateUserData = userStore((state) => state.updateUserData);

  const { uploadId, cleanData } = usePushNotificationContext();
  const navigation = useNavigation();

  const registerPushNotificationToken = async () => {
    if (pushToken) {
      return;
    }

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
    setTimeout(() => {
      if (uploadId) {
        const tripId = uploadId;
        cleanData();
        navigation.navigate(ROUTES.cameraScreen, { tripId });
        return;
      }

      // no deep linked route && no active trip && authenticated
      if (requestedRoute != null) {
        navigation.navigate(requestedRoute.screen, requestedRoute.params || null);
        return;
      }

      if (authToken) {
        navigation.navigate(ROUTES.mainScreen);
        return;
      }

      navigation.navigate(ROUTES.signUpScreen);
    }, 1000);
  };

  const checkInitStatus = async () => {
    if (authToken) {
      getInitData();
      registerPushNotificationToken();
      return;
    }

    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      updateUserData({ authToken: token });
      registerPushNotificationToken();
      setTimeout(() => {
        getInitData();
      }, 500);
    }

    handleNavigation();
  };

  const populateState = () => {
    setInit(true);
    const res = data.getUserInitData;
    const {
      activeTrip, recapTrip, userData, trips,
    } = res;

    if (trips) {
      setTrips(trips);
    }

    if (activeTrip) {
      setActiveTrip(activeTrip);

      if (requestedRoute == null) {
        // Not working for some reason
        setRequestedRoute({
          screen: ROUTES.tripScreen,
          params: { isActive: true },
        });
      }
    }

    if (recapTrip) {
      setRecapTrip(recapTrip);
    }

    if (userData) {
      updateUserData(userData);
    }
  };

  useEffect(() => {
    if (data && !init) {
      populateState();
      handleNavigation();
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
    Linking.getInitialURL().then((url) => {
      navigateHandler(url);
    });
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', handleOpenUrl);
    }
    return () => {
      if (Platform.OS === 'ios') {
        Linking.removeEventListener('url', handleOpenUrl);
      }
    };
  }, []);

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
        setRequestedRoute({
          screen: ROUTES.invitationScreen,
          params: { tripId },
        });
      }
    }
  };

  const AnimatedImage = Animatable.createAnimatableComponent(Image);

  return (
    <View style={styles.container}>
      <AnimatedImage
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        source={Logo}
        style={{ height: 200, width: 377 }}
        resizeMode="center"
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
