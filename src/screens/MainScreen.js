import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView, StyleSheet, View,
} from 'react-native';
import React, {
  useRef, useState,
  useEffect,
  useCallback,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import { useLazyQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
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
import tripsStore from '../stores/TripsStore';
import Suitcase3D from '../../assets/images/suitcase_3d.png';
import GET_TRIPS_FOR_USER from '../queries/getTripsForUser';
import RecapCardMini from '../components/RecapCardMini';

export default function MainScreen() {
  const [getTripsForUser, { error, data }] = useLazyQuery(GET_TRIPS_FOR_USER);
  const user = userStore((state) => state.user);
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const trips = tripsStore((state) => state.trips);
  const setTrips = tripsStore((state) => state.setTrips);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTripsForUser().then(() => setRefreshing(false)).catch(() => setRefreshing(false));
  }, []);

  const now = Date.now() / 1000;
  let recapTimestamp = new Date();
  recapTimestamp.setFullYear(recapTimestamp.getFullYear() - 1);
  recapTimestamp = Date.parse(recapTimestamp) / 1000;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (data) {
      setTrips(data.getTripsForUser);
    }

    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
    }
  }, [data, error]);

  const upcomingTrips = trips.filter((trip) => trip.dateRange.startDate > now && trip.dateRange.endDate > now);
  const recentTrips = trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate < now);
  const activeTrip = trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate > now)[0];
  const recapTrip = trips.filter((trip) => trip.dateRange.startDate < recapTimestamp && trip.dateRange.endDate < now)[0];

  const navigation = useNavigation();

  const HeaderSection = () => (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    }}
    >
      <Avatar
        onPress={() => navigation.navigate(ROUTES.profileScreen)}
        isSelf
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
        onPress: () => navigation.navigate(ROUTES.tripScreen, { tripId: activeTrip.id }),
        fontColor: COLORS.error[900],
        style: styles.activeTripChip,
        isShown: activeTrip,
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
    <View style={{ backgroundColor: COLORS.neutral[50], flex: 1 }}>
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
        refreshControl={(
          <RefreshControl
            progressViewOffset={50}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
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
            location={recapTrip?.location?.placeName}
            tripId={recapTrip?.id}
            style={{ marginHorizontal: PADDING.l, marginTop: 20 }}
          />
          <View>
            <Headline
              type={3}
              text={i18n.t('Successful Trips ✈️')}
              style={{ marginLeft: PADDING.xl, marginTop: 25 }}
            />

            <FlatList
              horizontal
              scrollEnabled={recentTrips.length > 0}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 20, paddingHorizontal: PADDING.m }}
              ListEmptyComponent={() => (
                <View style={{ width: width * 0.9, alignItems: 'center' }}>
                  <Image
                    source={Suitcase3D}
                    style={{ height: 150 }}
                    resizeMode="contain"
                  />
                  <Body
                    style={{ alignSelf: 'center', marginVertical: 10 }}
                    type={1}
                    text={i18n.t('No Trips to show 😢')}
                    color={COLORS.neutral[300]}
                  />
                  <Pressable
                    onPress={() => setCreateVisible(true)}
                    style={styles.addtripButton}
                  >
                    <Body
                      type={1}
                      color={COLORS.shades[100]}
                      text={i18n.t('Add trip')}
                    />
                  </Pressable>
                </View>
              )}
              data={recentTrips}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <RecapCard
                  key={item.latlon}
                  onPress={() => navigation.navigate(ROUTES.tripScreen, { tripId: item.id })}
                  data={item}
                  style={{ marginRight: 20 }}
                />
              )}
            />
          </View>
          {upcomingTrips && (
          <View style={[styles.carousel, { marginBottom: 110 }]}>
            {upcomingTrips.length > 0 && (
            <Headline
              type={3}
              text={i18n.t('Upcoming Trips ⏳')}
              style={{ marginLeft: PADDING.l, marginTop: 35 }}
            />
            )}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: PADDING.l }}
              style={{ marginTop: 20, paddingHorizontal: PADDING.m }}
              data={upcomingTrips}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <RecapCardMini
                  key={item.latlon}
                  onPress={() => navigation.navigate(ROUTES.tripScreen, { tripId: item.id })}
                  data={item}
                  style={{ marginRight: 10 }}
                />
              )}
            />
          </View>
          )}
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
            onPress={() => navigation.navigate(ROUTES.mapScreen)}
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
        onPress={(id) => navigation.navigate(ROUTES.tripScreen, { tripId: id })}
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
  addtripButton: {
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
