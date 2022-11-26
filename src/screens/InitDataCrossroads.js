import {
  ActivityIndicator, Linking, Platform, View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import GET_INIT_USER_DATA from '../queries/getInitUserData';
import activeTripStore from '../stores/ActiveTripStore';
import recapTripStore from '../stores/RecapTripStore';
import userStore from '../stores/UserStore';
import COLORS from '../constants/Theme';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';

const asyncStorageDAO = new AsyncStorageDAO();

export default function InitDataCrossroads() {
  const [getInitData, { loading, error, data }] = useLazyQuery(GET_INIT_USER_DATA);
  const [init, setInit] = useState(false);
  const { authToken } = userStore((state) => state.user);
  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);
  const setRecapTrip = recapTripStore((state) => state.setRecapTrip);
  const updateUserData = userStore((state) => state.updateUserData);

  const navigation = useNavigation();

  const checkInitStatus = async () => {
    return;
    if (authToken) {
      getInitData();
      return;
    }

    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      updateUserData({ authToken: token });
      setTimeout(() => {
        getInitData();
      }, 500);
      return;
    }
    navigation.push(ROUTES.signUpScreen);
  };

  const populateState = () => {
    setInit(true);
    const res = data.getUserInitData;

    const { activeTrip, recapTrip, userData } = res;
    if (activeTrip) {
      setActiveTrip(activeTrip);
    }

    if (recapTrip) {
      setRecapTrip(recapTrip);
    }

    if (userData) {
      updateUserData(userData);
    }

    if (activeTrip) {
      navigation.push(ROUTES.tripScreen, { isActive: true });
    } else {
      navigation.push(ROUTES.mainScreen);
    }
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
        navigation.navigate(ROUTES.invitationScreen, { tripId });
        return;
      }

      if (url.includes('upload-reminder')) {
        navigation.navigate(ROUTES.cameraScreen, { tripId });
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Headline type={3} text={i18n.t('Loading')} />}
      {error && <Headline type={3} text="error" />}
      <ActivityIndicator color={COLORS.shades[0]} />
    </View>
  );
}
