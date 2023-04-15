import {
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useLazyQuery} from '@apollo/client';
import Toast from 'react-native-toast-message';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
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
import META_DATA from '../constants/MetaData';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import PremiumController from '../PremiumController';
import ProUserBubble from '../components/ProUserBubble';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ScannerModal from '../components/ScannerModal';

const asyncStorageDAO = new AsyncStorageDAO();

export default function MainScreen() {
  // QUERIES
  const [getTripsForUser, {error, data}] = useLazyQuery(GET_TRIPS_FOR_USER, {
    fetchPolicy: 'network-only',
  });

  // STORES
  const user = userStore(state => state.user);
  const trips = tripsStore(state => state.trips);
  const setTrips = tripsStore(state => state.setTrips);

  // STATE & MISC
  const [createVisible, setCreateVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scanVisible, setScanVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'upcoming', title: i18n.t('Upcoming')},
    {key: 'recent', title: i18n.t('Recent')},
  ]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // ----------- //
  const onRefresh = () => {
    setRefreshing(true);

    getTripsForUser()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  const {height} = Dimensions.get('window');

  const upcomingTrips = trips.filter(
    trip => trip.type === 'upcoming' || trip.type === 'soon',
  );
  const soonTrip = trips.filter(trip => trip.type === 'soon')[0];
  const recentTrips = trips.filter(trip => trip.type === 'recent');
  const activeTrip = trips.filter(trip => trip.type === 'active')[0];

  const highlightTrip = activeTrip || soonTrip || null;

  const createTrip = async () => {
    const usageLimit = JSON.parse(
      user.isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).totalTrips;
    if (trips?.length >= usageLimit) {
      return PremiumController.showModal();
    }

    setCreateVisible(true);
  };

  const getTabBarHeight = () => {
    const containerHeight = 190;
    if (upcomingTrips.length > recentTrips.length) {
      return upcomingTrips.length * containerHeight;
    }
    return recentTrips.length * containerHeight;
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  const handleLongPress = ({nativeEvent: {name}}, {id}) => {
    if (name === i18n.t('Invite Friends')) {
      return Share.share({
        message: `Hey! You've been invited to join a trip! Click the link below to join! ${META_DATA.baseUrl}/redirect/invitation/${id}`,
      });
    }
    if (name === i18n.t('See memories')) {
      return navigation.navigate(ROUTES.memoriesScreen, {
        tripId: id,
        initShowStory: true,
      });
    }
    if (name === i18n.t('Visit on Map')) {
      return navigation.navigate(ROUTES.mapScreen, {initTrip: id});
    }
    if (name === i18n.t('Capture a memory')) {
      return navigation.navigate(ROUTES.cameraScreen, {tripId: id});
    }
  };

  const getHeaderSection = () => (
    <SafeAreaView
      style={[
        styles.header,
        {
          paddingBottom: highlightTrip ? 40 : 16,
          borderBottomWidth: highlightTrip ? 1 : 0,
        },
      ]}
      edges={['top']}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Headline type={3} text={`${i18n.t('Hey')} ${user?.firstName} 👋🏻`} />
          {user?.isProMember && <ProUserBubble style={{marginLeft: 4}} />}
        </View>
        <Body
          type={1}
          style={{marginTop: -2}}
          text={i18n.t('ready for a new Adventure?')}
          color={COLORS.neutral[300]}
        />
      </View>
      <Pressable
        onPress={() => navigation.navigate(ROUTES.profileScreen)}
        isSecondary
        style={styles.searchButton}>
        <IonIcon name="ios-person" color={COLORS.neutral[900]} size={18} />
      </Pressable>
      <Pressable
        onPress={() => setSearchVisible(true)}
        isSecondary
        style={[styles.searchButton, {marginLeft: 6}]}>
        <Icon name="search1" color={COLORS.neutral[900]} size={20} />
      </Pressable>
    </SafeAreaView>
  );

  const renderTabBar = props => (
    <>
      <Divider style={{top: 57.5, marginHorizontal: PADDING.l}} />
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: COLORS.primary[500],
          width: 70,
          marginLeft: '12%',
          height: 3,
          borderRadius: 2,
        }}
        style={{backgroundColor: 'transparent'}}
        activeColor={COLORS.primary[700]}
        inactiveColor={COLORS.neutral[300]}
        renderLabel={({color, route, focused}) => (
          <Body
            style={{fontWeight: focused ? '500' : '400'}}
            color={color}
            type={1}
            text={route.title}
          />
        )}
      />
    </>
  );

  const getUpcomingTab = () => {
    if (upcomingTrips.length <= 0) {
      return (
        <View style={[styles.tabStyle, {marginTop: 20, marginLeft: 10}]}>
          <Body
            type={1}
            text={i18n.t('No upcoming trips 🥱')}
            style={{marginBottom: 4}}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={i18n.t(
              'I’m sure it can’t hurt to add a new trip. You know, just to have something to look forward to 🤷‍♂️',
            )}
          />
        </View>
      );
    }

    return (
      <Pressable style={styles.tabStyle}>
        {upcomingTrips.map(trip => (
          <RecapCardMini
            key={trip.id}
            onPress={() =>
              navigation.navigate(ROUTES.tripScreen, {tripId: trip.id})
            }
            onLongPress={e => handleLongPress(e, trip)}
            style={{marginTop: 10}}
            data={trip}
          />
        ))}
      </Pressable>
    );
  };

  const getRecentTab = () => {
    if (recentTrips.length <= 0) {
      return (
        <View style={[styles.tabStyle, {marginTop: 20, marginLeft: 10}]}>
          <Body
            type={1}
            text={i18n.t('No recent trips 👎🏻')}
            style={{marginBottom: 4}}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={i18n.t(
              'I’m sure it can’t hurt to add a new trip. You know, just to have something to look forward to 🤷‍♂️',
            )}
          />
        </View>
      );
    }

    return (
      <Pressable style={styles.tabStyle}>
        {recentTrips.map(trip => (
          <RecapCardMini
            key={trip.id}
            onLongPress={e => handleLongPress(e, trip)}
            onPress={() =>
              navigation.navigate(ROUTES.tripScreen, {tripId: trip.id})
            }
            style={{marginTop: 10}}
            data={trip}
          />
        ))}
      </Pressable>
    );
  };

  const renderScene = SceneMap({
    upcoming: getUpcomingTab,
    recent: getRecentTab,
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: COLORS.neutral[50],
          flex: 1,
        }}>
        <AnimatedHeader scrollY={scrollY} maxHeight={110} minHeight={10}>
          <SafeAreaView
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              paddingTop: 10,
              paddingHorizontal: PADDING.l,
              marginBottom: -18,
              height: 140,
            }}>
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
              style={styles.searchButton}>
              <Icon name="search1" color={COLORS.neutral[900]} size={20} />
            </Pressable>
          </SafeAreaView>
        </AnimatedHeader>
        <Animated.ScrollView
          refreshControl={
            <RefreshControl
              progressViewOffset={50}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}>
          <View style={styles.container}>
            {getHeaderSection()}
            <ActionTile trip={highlightTrip} style={{top: -25}} />
            <StorySection
              onLongPress={(e, id) => handleLongPress(e, {id})}
              contentContainerStyle={{marginHorizontal: PADDING.l}}
              style={{
                marginHorizontal: -PADDING.l,
                marginTop: !highlightTrip ? 18 : 0,
                marginBottom: -8,
              }}
              data={trips}
            />
            <Pressable
              style={{
                marginHorizontal: -PADDING.l,
                height: getTabBarHeight(),
              }}>
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
              />
            </Pressable>
          </View>
        </Animated.ScrollView>
        <CreateModal
          isVisible={createVisible}
          onRequestClose={() => setCreateVisible(false)}
        />
        <SearchModal
          isVisible={searchVisible}
          onRequestClose={() => setSearchVisible(false)}
          onPress={id => navigation.navigate(ROUTES.tripScreen, {tripId: id})}
        />
        <ScannerModal
          trips={trips}
          isVisible={scanVisible}
          onRequestClose={() => setScanVisible(false)}
        />
        <FAButton
          options={[
            {
              title: i18n.t('Join trip'),
              icon: 'scan',
              onPress: () => setScanVisible(true),
            },
            {
              title: i18n.t('Create trip'),
              icon: 'add',
              onPress: createTrip,
            },
          ]}
          icon="add"
          iconSize={28}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING.l,
    flex: 1,
    minHeight: Dimensions.get('window').height,
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
  tabBar: {
    flexDirection: 'row',
  },
  tabStyle: {
    paddingHorizontal: PADDING.m,
  },
  tabItem: {
    width: Dimensions.get('window').width / 2,
    height: 30,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 14 : 0,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    marginHorizontal: -PADDING.l,
    paddingHorizontal: PADDING.l,
    backgroundColor: COLORS.shades[0],
  },
});
