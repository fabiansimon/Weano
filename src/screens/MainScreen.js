import {
  Pressable,
  ScrollView, StyleSheet, View,
} from 'react-native';
import React, {
  useRef, useState,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import COLORS, { PADDING } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import RecapCard from '../components/RecapCard';
import Button from '../components/Button';
import CreateModal from '../components/CreateModal';
import ROUTES from '../constants/Routes';
import AnimatedHeader from '../components/AnimatedHeader';
import SearchModal from '../components/Search/SearchModal';
import RewindTile from '../components/Trip/RewindTile';
import userStore from '../stores/UserStore';
import Body from '../components/typography/Body';
import Utils from '../utils';
import Avatar from '../components/Avatar';

export default function MainScreen() {
  const user = userStore((state) => state.user);
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const mockTrips = [
    {
      title: 'Graduation Trip 2022 🎓',
      description: 'Paris for a week with as a graduate. Nothing better than that! 😎',
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

  const HeaderSection = () => (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    }}
    >
      <Avatar
        onPress={() => navigation.navigate(ROUTES.profileScreen)}
        uri={user?.avatarUri}
        size={45}
      />
      <View style={{ }}>
        <Headline
          type={3}
          style={{ textAlign: 'center' }}
          text={`${i18n.t('Hey')} ${user?.firstName}!`}
        />
        <Body
          type={1}
          style={{ textAlign: 'center' }}
          text={i18n.t('ready for a new Adventure?')}
          color={COLORS.neutral[300]}
        />
      </View>
      <Button
        isSecondary
        style={styles.searchButton}
        backgroundColor={COLORS.shades[0]}
        icon={<Icon name="search1" size={20} />}
        fullWidth={false}
        onPress={() => setSearchVisible(true)}
        color={COLORS.neutral[900]}
      />
    </View>
  );

  const ChipSelection = () => {
    const options = [
      {
        title: i18n.t('• Active trip 🏖'),
        onPress: () => navigation.navigate(ROUTES.tripScreen, { isActive: true }),
        fontColor: COLORS.error[900],
        style: styles.activeTripChip,
        isShown: true,
      },
      {
        title: i18n.t('Successful Trips ✈️'),
        onPress: () => console.log('0'),
        style: styles.basicChip,
        fontColor: COLORS.neutral[900],
        isShown: true,
      },
      {
        title: i18n.t('Upcoming Trips ⏳'),
        fontColor: COLORS.neutral[900],
        onPress: () => console.log('1'),
        style: styles.basicChip,
        isShown: true,
      },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: PADDING.m }}
        style={{ marginTop: 20, marginBottom: 5 }}
      >
        {options.map((option) => option.isShown && (
          <Pressable
            onPress={option.onPress}
            style={[option.style, { marginRight: 10 }]}
          >
            <Body
              type={1}
              color={option.fontColor}
              text={option.title}
            />
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={{ backgroundColor: COLORS.neutral[50] }}>
      <AnimatedHeader
        scrollY={scrollY}
        maxHeight={120}
      >
        <View style={styles.header}>
          <View>
            <Headline type={3} text={`${i18n.t('Hey')} ${user?.firstName}!`} />
            <Body
              type={1}
              text={i18n.t('Are you looking for something? 👀')}
              color={COLORS.neutral[300]}
            />
          </View>
          <Button
            isSecondary
            style={styles.searchButton}
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
            <HeaderSection />
          </View>
          <ChipSelection />
          <RewindTile
            onPress={() => navigation.navigate(ROUTES.memoriesScreen, { tripId: '6376718ec191f0760fc39543' })}
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
                    onPress={() => navigation.navigate(ROUTES.tripScreen, { isActive: false })}
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
      <View style={styles.bottom}>
        <View style={styles.buttonContainer}>
          <Button
            text={i18n.t('new adventure')}
            onPress={() => setCreateVisible(true)}
            style={[styles.buttonShadow]}
          />
          <Button
            style={[styles.globeButton, styles.buttonShadow]}
            backgroundColor={COLORS.shades[0]}
            onPress={() => navigation.navigate(ROUTES.cameraScreen)}
            icon="globe"
            isSecondary
            fullWidth={false}
            color={COLORS.neutral[900]}
          />
        </View>
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
  bottom: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
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
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: PADDING.l,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 110,
    width: '100%',
  },

  container: {
    marginTop: 20,
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
  activeTripChip: {
    borderRadius: 100,
    padding: 15,
    backgroundColor: Utils.addAlpha(COLORS.error[700], 0.08),
    borderWidth: 1,
    borderColor: COLORS.error[700],
  },
  basicChip: {
    borderRadius: 100,
    padding: 15,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
