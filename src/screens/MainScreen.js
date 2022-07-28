import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
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

export default function MainScreen() {
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const mockTrips = [
    {
      title: 'Maturareise VBS Gang 🐕',
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
      <AnimatedHeader
        scrollY={scrollY}
        maxHeight={120}
      >
        <View style={styles.header}>
          <View>
            <Headline type={3} text={i18n.t('Hey Fabian')} />
            <Headline type={4} text={i18n.t('Are you looking for something? 👀')} />
          </View>
          <Button
            style={[styles.searchButton, styles.buttonShadow]}
            backgroundColor={COLORS.shades[0]}
            icon={<Icon name="search1" size={20} />}
            fullWidth={false}
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
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Headline type={3} text={i18n.t('Hey Fabian')} />
                <Headline type={4} text={i18n.t('ready for a new Adventure? 🌍')} />
              </View>
              <Avatar
                uri="https://i.pravatar.cc/300"
                onPress={() => navigation.navigate(ROUTES.introScreen)}
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
          <View style={styles.carousel}>
            <Headline
              type={3}
              text={i18n.t('Successful Trips ✈️')}
              style={{ marginLeft: 30, marginTop: 25 }}
            />
            <ScrollView
              horizontal
              paddingHorizontal={25}
              paddingTop={20}
              showsHorizontalScrollIndicator={false}
            >
              {mockTrips.map((trip, index) => (
                <>
                  <RecapCard
                    key={trip.latlon}
                    onPress={() => navigation.navigate(ROUTES.tripScreen)}
                    data={trip}
                    style={{ marginRight: 30 }}
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
              style={{ marginLeft: 30, marginTop: 35 }}
            />
            <ScrollView
              horizontal
              paddingHorizontal={25}
              paddingTop={20}
              showsHorizontalScrollIndicator={false}
            >
              {mockPlannedTrips.map((trip, index) => (
                <>
                  <RecapCard
                    key={trip.latlon}
                    data={trip}
                    style={{ marginRight: 30 }}
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
          fullWidth={false}
          color={COLORS.neutral[900]}
        />
      </View>
      <CreateModal
        isVisible={createVisible}
        onRequestClose={() => setCreateVisible(false)}
      />
      <SearchModal isVisible={searchVisible} onRequestClose={() => setSearchVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingTop: 18,
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowOffset: {
      height: -10,
    },
    position: 'absolute',
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: 20,
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
  carousel: {
    Horizontal: 25,
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
