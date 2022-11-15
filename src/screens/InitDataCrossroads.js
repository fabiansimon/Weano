import { ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import GET_INIT_USER_DATA from '../queries/getInitUserData';
import activeTripStore from '../stores/ActiveTripStore';
import recapTripStore from '../stores/RecapTripStore';
import userStore from '../stores/UserStore';
import COLORS from '../constants/Theme';

export default function InitDataCrossroads() {
  const { loading, error, data } = useQuery(GET_INIT_USER_DATA);

  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);

  const setRecapTrip = recapTripStore((state) => state.setRecapTrip);

  const setUserData = userStore((state) => state.setUserData);

  const navigation = useNavigation();

  // const getInitData = async () => {
  //   const token = await asyncStorageDAO.getAccessToken();
  //   if (token) {
  //     // navigation.push(ROUTES.mainScreen);
  //   }
  //   // navigation.push(ROUTES.signUpScreen);
  // };

  const populateState = () => {
    const res = data.getUserInitData;

    const { activeTrip, recapTrip, userData } = res;
    if (activeTrip) {
      console.log('activeTrip.expenses');
      console.log(activeTrip.expenses);
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
      return;
    }
    navigation.push(ROUTES.mainScreen);
  };

  useEffect(() => {
    if (data) {
      populateState();
    }

    if (error) {
      console.log(error);
    }
  }, [data, error]);

  // useEffect(() => {
  //   getInitData();
  // }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <Headline type={3} text={i18n.t('Loading')} />}
      {error && <Headline type={3} text="error" />}
      <ActivityIndicator color={COLORS.shades[0]} />
    </View>
  );
}
