import {
  View, StyleSheet, Dimensions, Pressable, Image,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
// eslint-disable-next-line import/no-unresolved
import { MAPBOX_TOKEN } from '@env';
import Toast from 'react-native-toast-message';
import { useMutation } from '@apollo/client';
import MapboxGL from '@react-native-mapbox-gl/maps';
import FeatherIcon from 'react-native-vector-icons/Feather';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import activeTripStore from '../../stores/ActiveTripStore';
import SetupContainer from '../../components/Trip/SetupContainer';
import InputModal from '../../components/InputModal';
import UPDATE_TRIP from '../../mutations/updateTrip';
import Headline from '../../components/typography/Headline';
import RoleChip from '../../components/RoleChip';
import userManagement from '../../utils/userManagement';
import PinImage from '../../../assets/images/pin.png';

MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function LocationScreen() {
  // MUTATIONS
  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);

  // STORES
  const { location, id } = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const camera = useRef();
  const [inputVisible, setInputVisible] = useState(false);

  const isHost = userManagement.isHost();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
      }, 500);
    }
  }, [error]);

  const handleLocationInput = async (input) => {
    if (!input) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: i18n.t('Not a valid destination, try again!'),
      });
      return;
    }

    const { location: latlon, string: placeName } = input;

    const oldLocation = location;
    updateActiveTrip({
      location: {
        placeName,
        latlon,
      },
    });

    await updateTrip({
      variables: {
        trip: {
          location: {
            placeName,
            latlon,
          },
          tripId: id,
        },
      },
    }).then(() => {
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('Great!'),
          text2: i18n.t('Location successful updated'),
        });
      }, 500);
    }).catch((e) => {
      updateActiveTrip({ location: oldLocation });
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      }, 500);
      console.log(e);
    });

    setInputVisible(false);
  };

  const getLocationContainer = () => (
    <>
      <View style={styles.locationContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Headline
            type={4}
            text={i18n.t('Current destination')}
            color={COLORS.neutral[300]}
          />
          <RoleChip
            string={i18n.t('Set by host')}
            isHost
          />
        </View>
        <Pressable
          onPress={() => isHost && setInputVisible(true)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Headline
            type={3}
            style={{ marginTop: 4 }}
            text={location.placeName.split(',')[0]}
          />
          {isHost && (
          <View style={styles.editButton}>
            <FeatherIcon
              name="edit"
              color={COLORS.neutral[300]}
            />
          </View>
          )}
        </Pressable>
      </View>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          scrollEnabled={false}
          logoEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          compassEnabled={false}
          rotateEnabled={false}
          style={styles.map}
        >
          <MapboxGL.Camera
            zoomLevel={4}
            animated={false}
            ref={camera}
            centerCoordinate={location.latlon}
          />
          <MapboxGL.MarkerView
            coordinate={location.latlon}
          >
            <Image source={PinImage} style={{ height: 40, width: 50 }} resizeMode="contain" />
          </MapboxGL.MarkerView>
        </MapboxGL.MapView>
      </View>
    </>

  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find location')}
        scrollY={scrollY}
        info={INFORMATION.locationScreen}
      >
        <View style={styles.innerContainer}>
          {!location ? (
            <SetupContainer
              onPress={() => setInputVisible(true)}
              type="location"
              style={{ marginBottom: 10 }}
            />
          ) : getLocationContainer()}

        </View>
      </HybridHeader>
      <InputModal
        isVisible={inputVisible}
        geoMatching
        placeholder={i18n.t('Enter location')}
        onRequestClose={() => setInputVisible(false)}
        onPress={(input) => handleLocationInput(input)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  innerContainer: {
    paddingHorizontal: PADDING.s,
    paddingTop: 15,
    paddingBottom: 36,
  },
  map: {
    height: Dimensions.get('window').height * 0.3,
    width: '100%',
    flex: 1,
  },
  locationContainer: {
    marginHorizontal: PADDING.s,
    marginTop: 10,
  },
  mapContainer: {
    marginTop: 20,
    marginHorizontal: 4,
    borderRadius: RADIUS.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    shadowColor: COLORS.shades[100],
    shadowOffset: {
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.08,
  },
  editButton: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    marginTop: 4,
  },
});
