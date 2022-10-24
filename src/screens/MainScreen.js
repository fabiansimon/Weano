import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import { useQuery } from '@apollo/client';
import COLORS, { PADDING } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import TextField from '../components/TextField';
import RecapCard from '../components/RecapCard';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import CreateModal from '../components/CreateModal';
import ROUTES from '../constants/Routes';
import AnimatedHeader from '../components/AnimatedHeader';
import SearchModal from '../components/Search/SearchModal';
import RewindTile from '../components/Trip/RewindTile';
import GET_TRIPS_FROM_USER from '../queries/getTripsFromUser';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';

const asyncStorageDAO = new AsyncStorageDAO();

export default function MainScreen() {
  const { loading, error, data } = useQuery(GET_TRIPS_FROM_USER);
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const getInitData = async () => {
    const token = await asyncStorageDAO.getAccessToken();
    console.log(token);
  };

  useEffect(() => {
    getInitData();
  }, []);

  const mockTrips = [
    {
      title: 'Maturareise VBS Gang 🐕',
      description: 'Fucking sending it for a few weeks straight. Guys trip baby. LET’S GO 🍻',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      latlon: [48.864716, 2.349014],
      images: ['https://picsum.photos/315/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150'],
      invitees: [
        {
          name: 'Fabian Simon',
          uri: 'https://i.pravatar.cc/300',
        },
        {
          name: 'Julia Stefan',
          uri: 'https://i.pravatar.cc/300',
        },
        {
          name: 'Matthias Betonmisha',
          uri: 'https://i.pravatar.cc/300',
        },
      ],
    },
    {
      title: 'Paris with mon Amie 🇫🇷',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      latlon: [48.864716, 2.349014],
      images: ['https://picsum.photos/315/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150'],
      invitees: [
        {
          name: 'Fabian Simon',
          uri: 'https://i.pravatar.cc/300',
        },
        {
          name: 'Julia Stefan',
          uri: 'https://i.pravatar.cc/300',
        },
      ],
    },
    {
      title: 'Solo thru the US 🤠',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      latlon: [48.864716, 2.349014],
      invitees: [
        {
          name: 'Fabian Simon',
          uri: 'https://i.pravatar.cc/300',
        },
        {
          name: 'Julia Stefan',
          uri: 'https://i.pravatar.cc/300',
        },
        {
          name: 'Jonathan Witt',
          uri: 'https://i.pravatar.cc/300',
        },
        {
          name: 'Alexander Witt',
          uri: 'https://i.pravatar.cc/300',
        },
      ],
    },
  ];

  const mockPlannedTrips = [
    {
      title: 'Maturareise VBS Gang 🐕',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
    },
    {
      title: 'Paris with mon Amie 🇫🇷',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
    },
    {
      title: 'Solo thru the US 🤠',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
    },
  ];

  return (
    <View style={{ backgroundColor: COLORS.neutral[50] }}>
      {loading && <View style={{ flex: 1, backgroundColor: 'blue' }} />}
      {error && <View style={{ flex: 1, backgroundColor: 'red' }} />}
      <AnimatedHeader
        scrollY={scrollY}
        maxHeight={120}
      >
        <View style={styles.header}>
          <View>
            <Headline type={3} text={i18n.t('Hey Fabian')} />
            <Headline
              type={4}
              text={i18n.t('Are you looking for something? 👀')}
              color={COLORS.neutral[300]}
            />
          </View>
          <Button
            isSecondary
            style={[styles.searchButton, styles.buttonShadow]}
            backgroundColor={COLORS.shades[0]}
            icon={<Icon name="search1" size={20} />}
            fullWidth={false}
            onPress={() => setSearchVisible(true)}
            color={COLORS.neutral[900]}
          />
        </View>
      </AnimatedHeader>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <SafeAreaView style={styles.container}>
          <View style={{ paddingHorizontal: PADDING.l }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Headline type={3} text={i18n.t('Hey Fabian')} />
                <Headline
                  type={4}
                  text={i18n.t('ready for a new Adventure? 🌍')}
                  color={COLORS.neutral[300]}
                />
              </View>
              <Avatar
                uri="https://i.pravatar.cc/300"
                onPress={() => navigation.navigate(ROUTES.profileScreen)}
              />
            </View>
            <TextField
              style={{ marginTop: 20 }}
              focusable={false}
              disabled
              onPress={() => setSearchVisible(true)}
              placeholder={i18n.t('Barcelona 2021 🇪🇸')}
            />
          </View>
          <RewindTile
            onPress={() => navigation.navigate(ROUTES.memoriesScreen)}
            style={{ marginHorizontal: PADDING.l, marginTop: 20 }}
          />
          <View>
            <Headline
              type={3}
              text={i18n.t('Successful Trips ✈️')}
              style={{ marginLeft: PADDING.xl, marginTop: 25 }}
            />
            <ScrollView
              horizontal
              paddingHorizontal={PADDING.l}
              paddingTop={20}
              showsHorizontalScrollIndicator={false}
            >
              {mockTrips.map((trip, index) => (
                <>
                  <RecapCard
                    key={trip.latlon}
                    onPress={() => navigation.navigate(ROUTES.tripScreen)}
                    data={trip}
                    style={{ marginRight: 20 }}
                  />
                  {index === mockTrips.length - 1 && <View style={{ width: 25 }} />}
                </>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.carousel, { marginBottom: 110 }]}>
            <Headline
              type={3}
              text={i18n.t('Upcoming Trips ⏳')}
              style={{ marginLeft: PADDING.l, marginTop: 35 }}
            />
            <ScrollView
              horizontal
              paddingHorizontal={PADDING.l}
              paddingTop={20}
              showsHorizontalScrollIndicator={false}
            >
              {mockPlannedTrips.map((trip, index) => (
                <>
                  <RecapCard
                    key={trip.latlon}
                    data={trip}
                    style={{ marginRight: 20 }}
                    type="mini"
                  />
                  {index === mockTrips.length - 1 && <View style={{ width: 25 }} />}
                </>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Animated.ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          text={i18n.t('new adventure')}
          onPress={() => setCreateVisible(true)}
          style={[styles.buttonShadow]}
        />
        <Button
          style={[styles.globeButton, styles.buttonShadow]}
          backgroundColor={COLORS.shades[0]}
          onPress={() => navigation.navigate(ROUTES.mapScreen)}
          icon="globe"
          isSecondary
          fullWidth={false}
          color={COLORS.neutral[900]}
        />
      </View>
      <CreateModal
        isVisible={createVisible}
        onRequestClose={() => setCreateVisible(false)}
      />
      <SearchModal
        isVisible={searchVisible}
        onRequestClose={() => setSearchVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingTop: 18,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    shadowColor: COLORS.neutral[300],
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowOffset: {
      height: -10,
    },
    position: 'absolute',
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: PADDING.l,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 110,
    width: '100%',
    bottom: 0,
  },
  buttonShadow: {
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  globeButton: {
    marginLeft: 15,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  searchButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
});
