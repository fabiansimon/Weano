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

  let requestedRoute;

  const handleNavigation = () => {
    // no deep linked route && no active trip && authenticated
    if (requestedRoute) {
      navigation.navigate(requestedRoute.screen, requestedRoute.params || null);
      return;
    }

    if (authToken) {
      navigation.navigate(ROUTES.mainScreen);
      return;
    }

    navigation.navigate(ROUTES.signUpScreen);
  };

  const checkInitStatus = async () => {
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

    handleNavigation();
  };

  const populateState = () => {
    setInit(true);
    const res = data.getUserInitData;
    const { activeTrip, recapTrip, userData } = res;

    if (activeTrip) {
      setActiveTrip(activeTrip);

      if (!requestedRoute) {
        requestedRoute = {
          screen: ROUTES.tripScreen,
          params: { isActive: true },
        };
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
        requestedRoute = ({
          screen: ROUTES.invitationScreen,
          params: {
            tripId,
          },
        });
        return;
      }

      if (url.includes('upload-reminder')) {
        requestedRoute = ({
          screen: ROUTES.cameraScreen,
          params: {
            tripId,
          },
        });
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Headline type={3} text={i18n.t('Loading')} />}
      {error && <Headline type={3} text="error" />}
      <ActivityIndicator color={COLORS.shades[100]} />
    </View>
  );
}
