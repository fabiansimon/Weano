import { View, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useMutation } from '@apollo/client';
import COLORS, { PADDING } from '../../constants/Theme';
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

export default function LocationScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { location, id } = activeTripStore((state) => state.activeTrip);
  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);

  const [isBoardingPassVisible, setBoardingPassVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pollData, setPollData] = useState(null);

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

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find location')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <SetupContainer
            onPress={() => setInputVisible(true)}
            type="location"
            style={{ marginBottom: 10 }}
          />
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

      {/* <HighlightContainer
        onPress={() => setBoardingPassVisible(true)}
        description={i18n.t('Location')}
        text={location.placeName}
      /> */}

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
    backgroundColor: COLORS.neutral[50],
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
});
