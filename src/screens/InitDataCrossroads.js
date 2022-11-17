import { ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
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

  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);

  const setRecapTrip = recapTripStore((state) => state.setRecapTrip);

  const setUserData = userStore((state) => state.setUserData);

  const navigation = useNavigation();

  const checkInitStatus = async () => {
    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      getInitData();
      return;
    }
    navigation.push(ROUTES.signUpScreen);
  };

  const populateState = () => {
    const res = data.getUserInitData;

    const { activeTrip, recapTrip, userData } = res;
    if (activeTrip) {
      setActiveTrip(activeTrip);
    }

    if (recapTrip) {
      setRecapTrip(recapTrip);
    }

    if (userData) {
      setUserData(userData);
    }

    if (activeTrip) {
      navigation.push(ROUTES.tripScreen, { isActive: true });
    } else {
      navigation.push(ROUTES.mainScreen);
    }
  };

  useEffect(() => {
    if (data) {
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
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Headline type={3} text={i18n.t('Loading')} />}
      {error && <Headline type={3} text="error" />}
      <ActivityIndicator color={COLORS.shades[0]} />
    </View>
  );
}
