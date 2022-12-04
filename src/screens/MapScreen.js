import React, {
  useMemo, useRef, useState, useEffect,
} from 'react';
import {
  Image, Pressable, StyleSheet, View,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import BottomSheet from '@gorhom/bottom-sheet';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_TOKEN } from '@env';
import BackButton from '../components/BackButton';
import CountriesVisited from '../components/Map/CountriesVisited';
import tripsStore from '../stores/TripsStore';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import DefaultImage from '../../assets/images/default_trip.png';
import Body from '../components/typography/Body';
import i18n from '../utils/i18n';
import Utils from '../utils';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function MapScreen() {
  const snapPoints = useMemo(() => ['20%', '86%'], []);
  const sheetRef = useRef(null);
  const trips = tripsStore((state) => state.trips);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [upcomingTrips, setUpcomingTrips] = useState(false);
  const [recentTrips, setRecentTrips] = useState(false);

  const ICON_WIDTH = 40;
  const ICON_HEIGHT = 50;

  const now = Date.now() / 1000;

  useEffect(() => {
    setUpcomingTrips(trips.filter((trip) => trip.dateRange.endDate > now));
    setRecentTrips(trips.filter((trip) => trip.dateRange.endDate < now));
  }, [trips]);

  const renderTripPins = (trip) => {
    const { location, thumbnailUri: uri } = trip;
    const source = uri ? { uri } : DefaultImage;

    return (
      <MapboxGL.MarkerView
        coordinate={location.latlon}
      >
        <View style={styles.imageContainer}>
          <Image
            source={source}
            style={{
              height: ICON_HEIGHT, width: ICON_WIDTH, borderRadius: RADIUS.s, zIndex: 100,
            }}
          />
          <View style={styles.pinShape} />
        </View>
      </MapboxGL.MarkerView>
    );
  };

  const TabSelector = () => (
    <Pressable
      onPress={() => setShowUpcoming(!showUpcoming)}
      style={styles.tabSelector}
    >
      <View style={[styles.tab, showUpcoming ? styles.activeTab : {}]}>
        <Body
          color={COLORS.shades[0]}
          type={2}
          text={`${i18n.t('Upcoming')} (${upcomingTrips?.length})`}
        />
      </View>
      <View style={[styles.tab, !showUpcoming ? styles.activeTab : {}]}>
        <Body
          color={COLORS.shades[0]}
          type={2}
          text={`${i18n.t('Finished')} (${recentTrips?.length})`}
        />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        {(showUpcoming && upcomingTrips) && upcomingTrips.map((trip) => renderTripPins(trip))}
        {(!showUpcoming && recentTrips) && recentTrips.map((trip) => renderTripPins(trip))}
      </MapboxGL.MapView>
      <BackButton style={styles.backButton} />
      <TabSelector />
      <BottomSheet
        handleIndicatorStyle={{ opacity: 0 }}
        backgroundStyle={{
          backgroundColor: 'transparent',
          borderRadius: 20,
        }}
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onClose={() => {

        }}
      >
        <CountriesVisited
          showUpcoming={showUpcoming}
          upcomingTrips={upcomingTrips}
          recentTrips={recentTrips}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: PADDING.l,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
  pinShape: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.shades[0],
    borderRadius: 2,
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    transform: [{ rotate: '45deg' }],
  },
  imageContainer: {
    padding: 4,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.m,
    shadowColor: COLORS.neutral[900],
    shadowOffset: {
      x: 0,
      y: 20,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  tabSelector: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    right: PADDING.l,
    top: 65,
    height: 40,
    borderRadius: RADIUS.s,
    backgroundColor: Utils.addAlpha('#FFFFFF', 0.1),
    borderWidth: 0.5,
    borderColor: COLORS.shades[0],
    position: 'absolute',
  },
  tab: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    margin: -1,
    borderRadius: 10,
    backgroundColor: COLORS.primary[700],
  },
});
