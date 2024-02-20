import {
  Dimensions,
  NativeModules,
  Platform,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useRef, useState, useEffect, useCallback, useMemo} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {useNavigation} from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import EntIcon from 'react-native-vector-icons/Entypo';
import {useLazyQuery} from '@apollo/client';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import SearchModal from '../components/Search/SearchModal';
import userStore from '../stores/UserStore';
import tripsStore from '../stores/TripsStore';
import GET_TRIPS_FOR_USER from '../queries/getTripsForUser';
import {MAPBOX_TOKEN} from '@env';
import META_DATA from '../constants/MetaData';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import PremiumController from '../PremiumController';
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient';
import TripContainer from '../components/Trip/TripContainer';
import CreateModal from '../components/CreateModal';
import Subtitle from '../components/typography/Subtitle';
import Body from '../components/typography/Body';
import StorySection from '../components/StorySection';
import FAButton from '../components/FAButton';
import ScannerModal from '../components/ScannerModal';
import RecapCardMini from '../components/RecapCardMini';
import ActionTile from '../components/Trip/ActionTile';
import {SafeAreaView} from 'react-native-safe-area-context';
import Headline from '../components/typography/Headline';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

const asyncStorageDAO = new AsyncStorageDAO();

const {StatusBarManager} = NativeModules;
const {height} = Dimensions.get('window');

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function MainScreen() {
  // QUERIES
  const [getTripsForUser, {data}] = useLazyQuery(GET_TRIPS_FOR_USER, {
    fetchPolicy: 'network-only',
  });

  // STORES
  const user = userStore(state => state.user);
  const trips = tripsStore(state => state.trips);
  const setTrips = tripsStore(state => state.setTrips);

  // STATE & MISC
  const [searchVisible, setSearchVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [scanVisible, setScanVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandIndex, setExpandIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [chipFilter, setChipFilter] = useState([
    {
      title: i18n.t('upcoming'),
      color: COLORS.success[700],
      isSelected: true,
      trips: upcomingTrips,
    },
    {
      title: i18n.t('recent'),
      color: COLORS.primary[700],
      isSelected: true,
      trips: recentTrips,
    },
    {
      title: i18n.t('active'),
      color: COLORS.error[900],
      isSelected: true,
      trips: activeTrips,
    },
  ]);

  const snapPoints = useMemo(
    () => ['28%', Platform.OS === 'android' ? '94%' : '92%'],
    [],
  );
  const sheetPosition = useSharedValue(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollRef = useRef();
  const mapCamera = useRef();
  const sheetRef = useRef();

  const navigation = useNavigation();
  const top = height - (parseInt(snapPoints[1], 10) / 100) * height;
  const bottom = height - (parseInt(snapPoints[0], 10) / 100) * height;

  const onRefresh = () => {
    setRefreshing(true);

    getTripsForUser()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false))
      .finally(setRefreshing(false));
  };

  const upcomingTrips = trips.filter(
    trip => trip.type === 'upcoming' || trip.type === 'soon',
  );
  const soonTrip = trips.filter(trip => trip.type === 'soon')[0];
  const recentTrips = trips.filter(trip => trip.type === 'recent');
  const activeTrips = trips.filter(trip => trip.type === 'active');

  const combinedTrips = [upcomingTrips, recentTrips, activeTrips];

  const highlightTrip = activeTrips[0] || soonTrip || null;

  const animatedIcon = useAnimatedStyle(() => {
    const opacity = ((sheetPosition.value - top) / (bottom - top)) * -40;
    return {
      transform: [{translateY: opacity}],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    if (sheetPosition.value <= headerHeight) {
      return {
        transform: [{translateY: 0}],
      };
    }

    const translateY = -Math.abs(sheetPosition.value - headerHeight);
    return {
      transform: [{translateY}],
    };
  });

  const animatedBottomStyle = useAnimatedStyle(() => {
    const marginTop = sheetPosition.value - headerHeight + 70;
    return {
      marginTop,
    };
  });

  const headerShadowAnimated = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 0.1],
    extrapolate: 'clamp',
  });

  const createTrip = async () => {
    const usageLimit = JSON.parse(
      user.isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).totalTrips;

    if (trips?.length >= usageLimit) {
      return PremiumController.showModal(user.isProMember);
    }

    setCreateVisible(true);
  };

  useEffect(() => {
    if (data) {
      setTrips(data.getTripsForUser);
    }
  }, [data]);

  const handleSheetChanges = useCallback(i => {
    if (i === 0) {
      scrollRef.current?.scrollTo({y: 0});
    }
    setExpandIndex(i);
  }, []);

  const handleLongPress = ({nativeEvent: {name}}, {id}) => {
    if (name === i18n.t('Invite Friends')) {
      return Share.share({
        message: `Hey! You've been invited to join a trip! Click the link below to join! ${META_DATA.baseUrl}/redirect/invitation/${id}`,
      });
    }
    if (name === i18n.t('See memories')) {
      return navigation.push(ROUTES.memoriesScreen, {
        tripId: id,
        initShowStory: true,
      });
    }
    if (name === i18n.t('Visit on Map')) {
      return handleSearch(id);
    }
    if (name === i18n.t('Capture a memory')) {
      return navigation.push(ROUTES.cameraScreen, {tripId: id});
    }
  };

  const handleFilterChoice = (index, isSelected) => {
    RNReactNativeHapticFeedback.trigger('impactLight');

    if (
      chipFilter.filter(c => c.isSelected).length === 1 &&
      chipFilter[index].isSelected
    ) {
      return setChipFilter(prev =>
        prev.map(c => {
          return {
            ...c,
            isSelected: true,
          };
        }),
      );
    }

    if (!chipFilter.find(c => !c.isSelected)) {
      return setChipFilter(prev =>
        prev.map((c, i) => {
          if (i === index) {
            return {
              ...c,
              isSelected: true,
            };
          }

          return {
            ...c,
            isSelected: false,
          };
        }),
      );
    }

    setChipFilter(prev =>
      prev.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            isSelected: !isSelected,
          };
        }

        return c;
      }),
    );
  };

  const handleSearch = id => {
    sheetRef.current.snapToIndex(0);

    if (!id) {
      return;
    }

    const searchTrip = trips.filter(trip => trip.id === id)[0];
    const {destinations} = searchTrip;

    mapCamera.current.setCamera({
      centerCoordinate: destinations[0].latlon,
      zoomLevel: 4,
      animationDuration: 300,
    });
  };

  const toggleExpansion = () => {
    sheetRef.current.snapToIndex(expandIndex ? 0 : 1);
  };

  const getFilteredTrips = useCallback(() => {
    if (!chipFilter.find(filter => !filter.isSelected)) {
      return trips.sort(
        (a, b) => b?.dateRange?.startDate - a?.dateRange?.startDate,
      );
    }

    let filteredTrips = [];
    for (var i = 0; i < chipFilter.length; i++) {
      if (chipFilter[i].isSelected && combinedTrips[i]) {
        filteredTrips.push(...combinedTrips[i]);
      }
    }

    filteredTrips.sort(
      (a, b) => a?.dateRange?.startDate - b?.dateRange?.startDate,
    );

    if (filteredTrips.length > 0 && expandIndex === 0) {
      handleSearch(filteredTrips[0].id);
    }
    return filteredTrips;
  }, [chipFilter, trips]);

  const renderTripPins = trip => {
    const {destinations} = trip;

    if (destinations[0]?.latlon?.length < 2) {
      return;
    }

    return (
      <MapboxGL.MarkerView
        allowOverlap
        key={trip.id}
        surfaceView
        requestDisallowInterceptTouchEvent
        coordinate={destinations[0].latlon}>
        <TripContainer
          onPressOut={() =>
            navigation.push(ROUTES.tripScreen, {tripId: trip.id})
          }
          isDense
          size={40}
          trip={trip}
        />
      </MapboxGL.MarkerView>
    );
  };

  const getFilterRow = useCallback(
    showSearch => {
      return (
        <>
          <View style={{flexDirection: 'row', flex: 1}}>
            {chipFilter.map((chip, index) => {
              const {color, title, isSelected} = chip;
              let tripLength =
                (index === 0
                  ? upcomingTrips?.length
                  : index === 1
                  ? recentTrips?.length
                  : activeTrips?.length) || 0;

              return (
                <Pressable
                  onPress={() => handleFilterChoice(index, isSelected)}
                  style={[
                    styles.chip,
                    {backgroundColor: color, opacity: isSelected ? 1 : 0.3},
                  ]}>
                  <Subtitle
                    type={1}
                    color={COLORS.shades[0]}
                    text={`${tripLength} ${title}`}
                  />
                </Pressable>
              );
            })}
          </View>
          {(highlightTrip || showSearch) && (
            <Pressable
              style={styles.searchChip}
              onPress={() => {
                RNReactNativeHapticFeedback.trigger('impactLight');
                setSearchVisible(true);
              }}>
              <Body
                color={COLORS.shades[100]}
                type={2}
                text={i18n.t('Search')}
              />
              <Icon
                color={COLORS.shades[100]}
                name="search1"
                style={{marginLeft: 4}}
                size={14}
              />
            </Pressable>
          )}
        </>
      );
    },
    [chipFilter, trips],
  );

  const getAnimatedHeader = () => {
    return (
      <Animated.View
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
        style={[
          styles.headerContainer,
          headerAnimatedStyle,
          {
            shadowOpacity: headerShadowAnimated,
          },
        ]}>
        <SafeAreaView edges={['top']}>
          <View>
            <Headline
              type={4}
              style={{textAlign: 'center'}}
              text={`${i18n.t('Hey')} ${user?.firstName}!`}
            />
            <Body
              type={2}
              style={{textAlign: 'center'}}
              text={i18n.t('ready for a new Adventure?')}
              color={COLORS.neutral[300]}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  };

  const getSheetContent = useCallback(() => {
    const filteredTrips = getFilteredTrips();
    return (
      <Pressable
        onPress={expandIndex === 0 ? toggleExpansion : null}
        style={styles.sheetContainer}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{paddingBottom: 120}}
          refreshControl={
            <RefreshControl
              progressViewOffset={50}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          scrollEventThrottle={16}
          scrollEnabled={expandIndex === 1}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: true,
            },
          )}
          showsVerticalScrollIndicator={false}>
          <View
            style={[styles.handler, {opacity: expandIndex === 0 ? 1 : 0}]}
          />

          <Subtitle
            type={1}
            style={{marginLeft: 5}}
            text={i18n.t('Memories')}
          />

          <Pressable>
            <StorySection
              contentContainerStyle={{
                paddingLeft: 10,
              }}
              onLongPress={(e, id) => handleLongPress(e, {id})}
              style={{marginTop: 14}}
              data={trips}
            />
          </Pressable>
          <Animated.View style={animatedBottomStyle}>
            <Subtitle
              type={1}
              style={{marginLeft: 5}}
              text={i18n.t('All trips')}
            />
          </Animated.View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            {getFilterRow(true)}
          </View>
          {filteredTrips?.length <= 0 && (
            <View style={[styles.tabStyle, {marginTop: 20}]}>
              <Body
                type={2}
                color={COLORS.neutral[700]}
                text={i18n.t('No trips found 🥱')}
                style={{
                  marginBottom: 4,
                  fontWeight: '500',
                }}
              />
              <Body
                type={2}
                color={COLORS.neutral[300]}
                text={i18n.t(
                  'I’m sure it can’t hurt to add a new trip. You know, just to have something to look forward to 🤷‍♂️',
                )}
              />
            </View>
          )}
          {filteredTrips?.map(trip => (
            <RecapCardMini
              key={trip.id}
              onPress={() =>
                navigation.push(ROUTES.tripScreen, {tripId: trip.id})
              }
              onLongPress={e => handleLongPress(e, trip)}
              style={{marginTop: 10}}
              data={trip}
            />
          ))}
        </Animated.ScrollView>
      </Pressable>
    );
  }, [trips, chipFilter, expandIndex]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <MapboxGL.MapView
          compassEnabled={false}
          scaleBarEnabled={false}
          rotateEnabled={false}
          onDidFinishLoadingMap={() => {
            mapCamera.current.setCamera({
              zoomLevel: 2,
              animationDuration: 500,
              centerCoordinate: [16, 48],
            });
          }}
          style={styles.map}
          styleURL="mapbox://styles/fabiansimon/clezrm6w7002g01p9eu1n0aos">
          <MapboxGL.Camera animationMode="moveTo" animated ref={mapCamera} />
          {getFilteredTrips()?.map(trip => renderTripPins(trip))}
        </MapboxGL.MapView>

        <View style={styles.actionTile}>
          <ActionTile trip={highlightTrip} isMinimized />
        </View>

        {!highlightTrip && (
          <View style={[styles.actionTile, styles.titleTile]}>
            <Icon
              color={COLORS.neutral[300]}
              name="search1"
              style={{marginRight: 4}}
              size={16}
            />
            <Subtitle
              type={1}
              style={{flex: 1}}
              color={COLORS.neutral[300]}
              text={i18n.t('Search')}
            />
          </View>
        )}

        <View style={{bottom: '20%', position: 'absolute', width: '100%'}}>
          <LinearGradient
            style={styles.gradient}
            colors={['transparent', COLORS.neutral[900]]}
          />
          <View style={styles.filterRow}>{getFilterRow()}</View>
        </View>

        <BottomSheet
          enableContentPanningGesture={expandIndex === 0}
          handleIndicatorStyle={{opacity: 0}}
          backgroundStyle={{
            backgroundColor: 'transparent',
            borderRadius: 20,
          }}
          ref={sheetRef}
          onChange={i => handleSheetChanges(i)}
          index={0}
          snapPoints={snapPoints}
          animatedPosition={sheetPosition}
          onClose={() => {}}>
          {getSheetContent()}
        </BottomSheet>
        {getAnimatedHeader()}

        <View style={styles.header}>
          <Pressable style={styles.searchButton} onPress={toggleExpansion}>
            <Animated.View style={[{opacity: 1, top: 40}, animatedIcon]}>
              <EntIcon
                color={COLORS.shades[100]}
                name={'chevron-up'}
                size={20}
              />
            </Animated.View>
            <Animated.View style={[{position: 'absolute'}, animatedIcon]}>
              <FontIcon
                name="globe-americas"
                color={COLORS.shades[100]}
                size={20}
              />
            </Animated.View>
          </Pressable>
          <Pressable
            onPress={() => {
              if (highlightTrip && expandIndex !== 1) {
                return navigation.push(ROUTES.tripScreen, {
                  tripId: highlightTrip.id,
                });
              }

              if (!highlightTrip && expandIndex !== 1) {
                setSearchVisible(true);
              }
            }}
            style={{flex: 1}}
          />

          <Pressable
            style={styles.searchButton}
            onPress={() => navigation.push(ROUTES.profileScreen)}>
            <IonIcon color={COLORS.shades[100]} name="ios-person" size={18} />
          </Pressable>
        </View>

        <SearchModal
          isVisible={searchVisible}
          onRequestClose={() => setSearchVisible(false)}
          onPress={id => handleSearch(id)}
        />
        <CreateModal
          isVisible={createVisible}
          onRequestClose={() => setCreateVisible(false)}
        />

        <ScannerModal
          trips={trips}
          isVisible={scanVisible}
          onRequestClose={() => setScanVisible(false)}
        />

        <FAButton
          description={
            trips.length <= 0
              ? i18n.t('Create or join \na trip right here')
              : null
          }
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
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: StatusBarManager.HEIGHT,
    paddingHorizontal: PADDING.m,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  map: {
    backgroundColor: COLORS.shades[0],
    flex: 1,
  },
  searchButton: {
    overflow: 'hidden',
    borderWidth: 1,
    height: 45,
    width: 45,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.shades[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    paddingHorizontal: PADDING.m,
    backgroundColor: COLORS.neutral[50],
    flex: 1,
    borderTopRightRadius: RADIUS.m,
    borderTopLeftRadius: RADIUS.m,
  },
  handler: {
    marginBottom: 4,
    alignSelf: 'center',
    width: 70,
    height: 7,
    borderRadius: 100,
    backgroundColor: COLORS.neutral[100],
    marginTop: 8,
  },
  filterRow: {
    zIndex: 99,
    position: 'absolute',
    paddingHorizontal: PADDING.m,
    top: -85,
    flexDirection: 'row',
    width: '100%',
  },
  gradient: {
    opacity: 0.3,
    width: '100%',
    height: 120,
    position: 'absolute',
    bottom: 0,
  },
  chip: {
    marginRight: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
  searchChip: {
    minHeight: 35,
    backgroundColor: COLORS.neutral[100],
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  animatedHeader: {
    minHeight: Platform.OS === 'android' ? 45 : 70,
    backgroundColor: COLORS.neutral[50],
    bottom: -20,
    zIndex: 0,
  },
  headerContainer: {
    backgroundColor: COLORS.neutral[50],
    paddingBottom: 10,
    position: 'absolute',
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    shadowColor: COLORS.neutral[900],
    shadowRadius: 20,
    shadowOffset: {},
  },
  actionTile: {
    alignSelf: 'center',
    position: 'absolute',
    width: '73%',
    top: StatusBarManager.HEIGHT,
    paddingHorizontal: PADDING.m,
  },
  titleTile: {
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    width: '65%',
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
