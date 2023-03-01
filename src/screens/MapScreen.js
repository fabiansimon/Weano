import React, {
  useMemo, useRef, useState,
  useEffect,
} from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import BottomSheet from '@gorhom/bottom-sheet';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_TOKEN } from '@env';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import CountriesVisited from '../components/Map/CountriesVisited';
import tripsStore from '../stores/TripsStore';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Utils from '../utils';
import ROUTES from '../constants/Routes';
import SearchModal from '../components/Search/SearchModal';
import TripContainer from '../components/Trip/TripContainer';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function MapScreen({ route }) {
  // PARAMS
  const { initTrip } = route.params;

  // STORES
  const trips = tripsStore((state) => state.trips);

  // STATE & MISC
  const [showSearch, setShowSearch] = useState(false);
  const snapPoints = useMemo(() => ['17%', '88%'], []);
  const sheetRef = useRef(null);

  const mapCamera = useRef();

  const navigation = useNavigation();

  useEffect(() => {
    if (initTrip) {
      setTimeout(() => {
        handleSearch(initTrip);
      }, 500);
    }
  }, [initTrip]);

  const handleSearch = (id) => {
    sheetRef.current.snapToIndex(0);

    if (!id) {
      return;
    }

    const searchTrip = trips.filter((trip) => trip.id === id)[0];
    const { location } = searchTrip;

    mapCamera.current.setCamera({
      centerCoordinate: location.latlon,
      zoomLevel: 3,
      animationDuration: 500,
    });
  };

  const renderTripPins = (trip) => {
    const { location } = trip;

    if (location?.latlon?.length < 2) {
      return;
    }

    return (
      <MapboxGL.MarkerView
        coordinate={location.latlon}
      >
        <TripContainer
          onPress={() => navigation.navigate(ROUTES.tripScreen, { tripId: trip.id })}
          isDense
          size={50}
          trip={trip}
        />
      </MapboxGL.MarkerView>
    );
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        rotateEnabled={false}
        style={styles.map}
      >
        <MapboxGL.Camera
          animationMode="moveTo"
          animated
          ref={mapCamera}
        />
        {trips && trips.map((trip) => renderTripPins(trip))}
      </MapboxGL.MapView>
      <BackButton style={styles.backButton} />
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
          data={trips}
          onSearchPress={() => setShowSearch(true)}
          onPress={(id) => handleSearch(id)}
        />
      </BottomSheet>
      <SearchModal
        isVisible={showSearch}
        onRequestClose={() => setShowSearch(false)}
        onPress={(id) => handleSearch(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: PADDING.l,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  map: {
    backgroundColor: COLORS.neutral[900],
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
    borderRadius: RADIUS.xl,
    backgroundColor: Utils.addAlpha(COLORS.primary[900], 0.2),
    borderWidth: 1,
    borderColor: COLORS.primary[700],
    position: 'absolute',
  },
  tab: {
    width: 120,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    margin: -1,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
  },
});
