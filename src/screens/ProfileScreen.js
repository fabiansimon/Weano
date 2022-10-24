import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import i18n from '../utils/i18n';
import HybridHeader from '../components/HybridHeader';
import INFORMATION from '../constants/Information';
import Avatar from '../components/Avatar';
import Headline from '../components/typography/Headline';
import Body from '../components/typography/Body';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import ROUTES from '../constants/Routes';

const asyncStorageDAO = new AsyncStorageDAO();

export default function ProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const statData = [
    {
      title: i18n.t('Trips'),
      amount: 12,
    },
    {
      title: i18n.t('Moments'),
      amount: 12,
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
      onPress: () => console.log('tapped'),
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

  const handleLogOut = async () => {
    console.log('hello');
    await asyncStorageDAO.clearAccessToken();
    navigation.navigate(ROUTES.initDataCrossroads);
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
      <Avatar size={85} />
      <View style={styles.editContainer}>
        <Icon
          size={18}
          color={COLORS.neutral[300]}
          name="square-edit-outline"
        />
      </View>
      <Headline
        type={2}
        text="Fabian Simon"
      />
      <Body
        type={1}
        text="+436641865358"
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
          <TouchableOpacity
            onPress={() => console.log('delete')}
            style={{
              flexDirection: 'row', alignItems: 'center', marginTop: 28, width: '95%',
            }}
          >
            <IonIcon
              name="ios-trash-outline"
              color={COLORS.error[900]}
              size={22}
            />
            <Headline
              style={{ marginLeft: 8 }}
              color={COLORS.error[900]}
              text={i18n.t('Delete Account')}
              type={4}
            />
          </TouchableOpacity>
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
