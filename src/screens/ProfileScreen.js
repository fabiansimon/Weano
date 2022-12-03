import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import i18n from '../utils/i18n';
import HybridHeader from '../components/HybridHeader';
import INFORMATION from '../constants/Information';
import Avatar from '../components/Avatar';
import Headline from '../components/typography/Headline';
import Body from '../components/typography/Body';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import ROUTES from '../constants/Routes';
import Utils from '../utils';
import userStore from '../stores/UserStore';
import httpService from '../utils/httpService';
import UPDATE_USER from '../mutations/updateUser';

const asyncStorageDAO = new AsyncStorageDAO();

export default function ProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [updateUser, { error }] = useMutation(UPDATE_USER);
  const user = userStore((state) => state.user);
  const updateUserState = userStore((state) => state.updateUserData);

  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }
  }, [error]);

  const statData = [
    {
      title: i18n.t('Trips'),
      amount: user.trips && user.trips.length,
    },
    {
      title: i18n.t('Moments'),
      amount: user.images && user.images.length,
    },
    {
      title: i18n.t('Countries'),
      amount: 12,
    },
    {
      title: i18n.t('Friends'),
      amount: 12,
    },
  ];

  const profileLinks = [
    {
      title: i18n.t('My Account'),
      onPress: () => navigation.navigate(ROUTES.myAccountScreen),
      icon: <IonIcon
        name="person-circle-outline"
        size={22}
      />,
    },
    {
      title: i18n.t('Privacy Policy'),
      onPress: () => console.log('tapped'),
      icon: <IonIcon
        name="ios-hand-left-outline"
        size={22}
      />,
    },
    {
      title: i18n.t('Contact us'),
      onPress: () => console.log('tapped'),
      icon: <IonIcon
        name="ios-mail-open-outline"
        size={22}
      />,
    },
    {
      title: i18n.t('Log out'),
      onPress: () => handleLogOut(),
      icon: <IonIcon
        name="ios-arrow-back-circle-outline"
        size={22}
      />,
    },
  ];

  const handleAddImage = async () => {
    const options = {
      mediaType: 'photo',
      presentationStyle: 'fullScreen',
    };
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      return;
    }

    try {
      const { Location } = await httpService.uploadToS3(result.assets[0]);

      const oldUri = user.thumbnailUri;
      updateUserState({ avatarUri: Location });

      await updateUser({
        variables: {
          user: {
            avatarUri: Location,
          },
        },
      }).catch(() => {
        updateUserState({ avatarUri: oldUri });
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      console.log(e);
    }
  };

  const handleLogOut = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Log out'),
      i18n.t('Are you sure you want to sign out of your Account?'),
      i18n.t('Sign out'),
      async () => {
        await asyncStorageDAO.clearAccessToken();
        updateUserState({ authToken: '' });
        navigation.navigate(ROUTES.initDataCrossroads);
      },
    );
  };

  const ListTile = ({ item, index }) => (
    <TouchableOpacity
      onPress={item.onPress}
      activeOpacity={0.9}
      style={[styles.listItem, { borderBottomWidth: index !== profileLinks.length - 1 ? 1 : 0 }]}
    >
      <View style={{ width: 40 }}>
        {item.icon}
      </View>
      <View>
        <Headline
          type={4}
          text={item.title}
        />
      </View>
    </TouchableOpacity>
  );

  const Header = () => (
    <>
      <Avatar
        onPress={handleAddImage}
        uri={user?.avatarUri}
        size={85}
      />
      <TouchableOpacity
        onPress={handleAddImage}
        activeOpacity={0.8}
        style={styles.editContainer}
      >
        <Icon
          size={18}
          color={COLORS.neutral[300]}
          name="square-edit-outline"
        />
      </TouchableOpacity>
      <Headline
        type={2}
        text={`${user?.firstName} ${user?.lastName}`}
      />
      <Body
        type={1}
        text={user?.phoneNumber}
        color={COLORS.neutral[300]}
      />
    </>
  );

  const StatsContainer = () => (
    <View style={styles.statContainer}>
      {statData.map((stat) => (
        <View style={styles.stat}>
          <Headline
            type={2}
            color={COLORS.neutral[900]}
            text={stat.amount}
          />
          <Body
            style={{ marginTop: 4 }}
            type={2}
            color={COLORS.neutral[500]}
            text={stat.title}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Profile')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <Header />
          <StatsContainer />
          {profileLinks.map((link, index) => <ListTile item={link} index={index} />)}

        </View>
      </HybridHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  innerContainer: {
    marginTop: 20,
    paddingBottom: 60,
    flex: 1,
    marginHorizontal: PADDING.xl,
    alignItems: 'center',
  },
  editContainer: {
    top: -15,
    borderRadius: RADIUS.xl,
    padding: 10,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 0.2,
    borderColor: COLORS.neutral[300],
  },
  statContainer: {
    marginVertical: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[50],
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
  },
  stat: {
    alignItems: 'center',
  },
  listItem: {
    marginHorizontal: PADDING.l,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '94%',
    borderColor: COLORS.neutral[100],
  },
});
