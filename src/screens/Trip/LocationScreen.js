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
import Icon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
// import PollView from '../../components/Polls/PollView';
// import AddSuggestionModal from '../../components/Trip/AddSuggestionModal';
// import HighlightContainer from '../../components/Trip/HighlightContainer';
import BoardingPassModal from '../../components/Trip/BoardingPassModal';
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
  const scrollY = useRef(new Animated.Value(0)).current;
  const { location, id } = activeTripStore((state) => state.activeTrip);

  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  const [isBoardingPassVisible, setBoardingPassVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);

  const isHost = userManagement.isHost();

  const camera = useRef();
  // const [isVisible, setIsVisible] = useState(false);
  // const [pollData, setPollData] = useState(null);

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

  const LocationContainer = () => (
    <View>
      <View style={styles.locationContainer}>
        <View>
          <Headline
            type={4}
            text={i18n.t('Current destination')}
            color={COLORS.neutral[300]}
          />
          <Pressable
            onPress={() => isHost && setInputVisible(true)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Headline
              type={3}
              style={{ marginTop: 4 }}
              text={location.placeName}
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
        <RoleChip
          string={i18n.t('Set by host')}
          style={{ alignSelf: 'flex-start' }}
          isHost
        />
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
    </View>

  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find location')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          {!location ? (
            <SetupContainer
              onPress={() => setInputVisible(true)}
              type="location"
              style={{ marginBottom: 10 }}
            />
          ) : <LocationContainer />}

          {/* <PollView
            data={pollData}
            title={i18n.t('Destination options')}
            onAdd={() => setIsVisible(true)}
            subtitle={pollData.length < 1 ? i18n.t('No suggestion yet, add one!') : i18n.t('You can simply add a new one')}
          /> */}
        </View>
      </HybridHeader>
      {/* <AddSuggestionModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        data={pollData}
        setPollData={setPollData}
      /> */}

      {/* {location && (
      <HighlightContainer
        onPress={() => setBoardingPassVisible(true)}
        description={i18n.t('Location')}
        text={location.placeName}
      />
      )} */}

      <InputModal
        isVisible={inputVisible}
        geoMatching
        placeholder={i18n.t('Enter location')}
        onRequestClose={() => setInputVisible(false)}
        onPress={(input) => handleLocationInput(input)}
      />

      <BoardingPassModal
        isVisible={isBoardingPassVisible}
        onRequestClose={() => setBoardingPassVisible(false)}
        type="destination"
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
  pollContainer: {
    paddingVertical: 20,
    paddingHorizontal: PADDING.s,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
  isLiked: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.xl,
    height: 32,
  },
  isNotLiked: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.xl,
    height: 32,
  },
  map: {
    height: Dimensions.get('window').height * 0.3,
    width: '100%',
    flex: 1,
  },
  locationContainer: {
    marginHorizontal: PADDING.s,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
