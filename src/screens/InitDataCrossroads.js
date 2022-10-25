import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import ROUTES from '../constants/Routes';
import GET_INIT_USER_DATA from '../queries/getInitUserData';
import userStore from '../stores/UserStore';

const asyncStorageDAO = new AsyncStorageDAO();

export default function InitDataCrossroads() {
  const { loading, error, data } = useQuery(GET_INIT_USER_DATA);
  const setUserData = userStore((state) => state.setUserData);
  const navigation = useNavigation();

  const getInitData = async () => {
    const { userData, images, trips } = data.getUserInitData;

    const user = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      avatarUri: userData.avatarUri,
      images,
      trips,
    };
    setUserData(user);

    if (!loading) {
      const token = await asyncStorageDAO.getAccessToken();
      if (token) {
        navigation.push(ROUTES.mainScreen);
        return;
      }

      navigation.push(ROUTES.signUpScreen);
    }
  };

  useEffect(() => {
    getInitData();
  }, [data, loading, error]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Headline type={3} text={i18n.t('Welcome to Henry')} />
    </View>
  );
}
