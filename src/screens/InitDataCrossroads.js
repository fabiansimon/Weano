import { View } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import ROUTES from '../constants/Routes';

const asyncStorageDAO = new AsyncStorageDAO();

export default function InitDataCrossroads() {
  const navigation = useNavigation();

  const getInitData = async () => {
    const token = await asyncStorageDAO.getAccessToken();
    if (token) {
      navigation.push(ROUTES.mainScreen);
      return;
    }

    navigation.push(ROUTES.signUpScreen);
  };

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Headline type={3} text={i18n.t('Welcome to Henry')} />
    </View>
  );
}
