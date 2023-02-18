import {
  Pressable,
  RefreshControl,
  StyleSheet, View,
} from 'react-native';
import React, {
  useRef, useState,
  useEffect,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useLazyQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import CreateModal from '../components/CreateModal';
import ROUTES from '../constants/Routes';
import AnimatedHeader from '../components/AnimatedHeader';
import SearchModal from '../components/Search/SearchModal';
import userStore from '../stores/UserStore';
import Body from '../components/typography/Body';
import tripsStore from '../stores/TripsStore';
import GET_TRIPS_FOR_USER from '../queries/getTripsForUser';
import RecapCardMini from '../components/RecapCardMini';
import ActionTile from '../components/Trip/ActionTile';
import FAButton from '../components/FAButton';
import StorySection from '../components/StorySection';
import Divider from '../components/Divider';

export default function MainScreen() {
  // QUERIES
  const [getTripsForUser, { error, data }] = useLazyQuery(GET_TRIPS_FOR_USER);

  // STORES
  const user = userStore((state) => state.user);
  const trips = tripsStore((state) => state.trips);
  const setTrips = tripsStore((state) => state.setTrips);

  // STATE & MISC
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // ----------- //
  const onRefresh = () => {
    setRefreshing(true);
    getTripsForUser().then(() => setRefreshing(false)).catch(() => setRefreshing(false));
  };

  const now = Date.now() / 1000;

  let recapTimestamp = new Date();
  recapTimestamp.setFullYear(recapTimestamp.getFullYear() - 1);
  recapTimestamp = Date.parse(recapTimestamp) / 1000;

  const upcomingTrips = trips.filter((trip) => trip.dateRange.startDate > now && trip.dateRange.endDate > now);
  const activeTrip = trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate > now)[0];
  const recapTrip = trips.filter((trip) => trip.dateRange.startDate < recapTimestamp && trip.dateRange.endDate < now)[0];
  const upcomingTrip = upcomingTrips.length > 0 && upcomingTrips.filter((trip) => ((trip.dateRange.startDate - now) / 86400) < 7)[0];

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

  const getHeaderSection = () => (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
    }}
    >
      <View style={{ flex: 1 }}>
        <Headline
          type={3}
          text={`${i18n.t('Hey')} ${user?.firstName} 👋🏻`}
        />
        <Body
          type={1}
          style={{ marginTop: -2 }}
          text={i18n.t('ready for a new Adventure?')}
          color={COLORS.neutral[300]}
        />
      </View>
      <Pressable
        onPress={() => navigation.navigate(ROUTES.profileScreen)}
        isSecondary
        style={styles.searchButton}
      >
        <IonIcon
          name="ios-person"
          color={COLORS.neutral[900]}
          size={18}
        />
      </Pressable>
      <Pressable
        onPress={() => setSearchVisible(true)}
        isSecondary
        style={[styles.searchButton, { marginLeft: 6 }]}
      >
        <Icon
          name="search1"
          color={COLORS.neutral[900]}
          size={20}
        />
      </Pressable>
    </View>
  );

  const getUpcomingTripSection = () => (
    <View>
      <Headline
        type={4}
        style={{ marginLeft: 5 }}
        text={i18n.t('Upcoming Trips')}
      />
      {upcomingTrips.map((trip) => (
        <RecapCardMini
          onPress={() => navigation.navigate(ROUTES.tripScreen, { tripId: trip.id })}
          style={{ marginTop: 15 }}
          data={trip}
        />
      ))}
    </View>
  );

  return (
    <View style={{ backgroundColor: COLORS.neutral[50], flex: 1 }}>
      <AnimatedHeader
        scrollY={scrollY}
        maxHeight={110}
        minHeight={10}
      >
        <SafeAreaView style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          paddingTop: 10,
          paddingHorizontal: PADDING.l,
          marginBottom: -18,
          height: 140,
        }}
        >
          <View>
            <Headline
              type={3}
              text={`${i18n.t('Hey')} ${user?.firstName}!`}
            />
            <Body
              type={1}
              text={i18n.t('Are you looking for something? 👀')}
              color={COLORS.neutral[300]}
            />
          </View>
          <Pressable
            onPress={() => setSearchVisible(true)}
            isSecondary
            style={styles.searchButton}
          >
            <Icon
              name="search1"
              color={COLORS.neutral[900]}
              size={20}
            />
          </Pressable>
        </SafeAreaView>
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
          {getHeaderSection()}
          <ActionTile
            type={activeTrip ? 'active' : upcomingTrip ? 'upcoming' : recapTrip ? 'recap' : null}
            trip={activeTrip || upcomingTrip || recapTrip || null}
            style={{ marginTop: 20 }}
          />
          <StorySection
            contentContainerStyle={{ marginHorizontal: PADDING.l }}
            style={{ marginHorizontal: -PADDING.l, marginTop: 20 }}
            onAddTrip={() => setCreateVisible(true)}
            data={trips}
          />
          <Divider color={COLORS.neutral[50]} vertical={20} />
          {getUpcomingTripSection()}
        </SafeAreaView>
      </Animated.ScrollView>
      <CreateModal
        isVisible={createVisible}
        onRequestClose={() => setCreateVisible(false)}
      />
      <SearchModal
        isVisible={searchVisible}
        onRequestClose={() => setSearchVisible(false)}
        onPress={(id) => navigation.navigate(ROUTES.tripScreen, { tripId: id })}
      />
      <FAButton
        icon="map"
        iconSize={22}
        onPress={() => navigation.navigate(ROUTES.mapScreen)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING.l,
    marginTop: 20,
    flex: 1,
  },
  searchButton: {
    borderWidth: 1,
    height: 45,
    width: 45,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.shades[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
