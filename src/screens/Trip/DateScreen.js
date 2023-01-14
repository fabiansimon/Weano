import {
  View, StyleSheet, StatusBar,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useMutation } from '@apollo/client';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import AvailabilityModal from '../../components/Trip/AvailabilityModal';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import BoardingPassModal from '../../components/Trip/BoardingPassModal';
import HighlightContainer from '../../components/Trip/HighlightContainer';
import CalendarAvailabilityContainer from '../../components/Trip/CalendarAvailabilityContainer';
import Label from '../../components/typography/Label';
import activeTripStore from '../../stores/ActiveTripStore';
import Utils from '../../utils';
import SetupContainer from '../../components/Trip/SetupContainer';
import CalendarModal from '../../components/CalendarModal';
import UPDATE_TRIP from '../../mutations/updateTrip';

export default function DateScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [isBoardingPassVisible, setBoardingPassVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  const { dateRange, id } = activeTripStore((state) => state.activeTrip);

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

  const availabilityData = {
    available: [
      {
        dateRange: {
          startDate: 1656865380,
          endDate: 1658074980,
        },
      },
      {
        dateRange: {
          startDate: 1656865380,
          endDate: 1658074980,
        },
      },
      {
        dateRange: {
          startDate: 1656865380,
          endDate: 1658074980,
        },
      },
    ],
    unavailable: [
      {
        dateRange: {
          startDate: 1656865380,
          endDate: 1658074980,
        },
      },
      {
        dateRange: {
          startDate: 1656865380,
          endDate: 1658074980,
        },
      },
    ],
  };

  const handleDateUpdate = async () => {
    setTimeout(async () => {
      const oldDateRange = dateRange;
      updateActiveTrip({
        dateRange: {
          endDate,
          startDate,
        },
      });

      await updateTrip({
        variables: {
          trip: {
            dateRange: {
              endDate,
              startDate,
            },
            tripId: id,
          },
        },
      }).then(() => {
        setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: i18n.t('Great!'),
            text2: i18n.t('Dates successful updated'),
          });
        }, 500);
      }).catch((e) => {
        updateActiveTrip({ dateRange: oldDateRange });
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        }, 500);
        console.log(e);
      });
    }, 300);
  };

  const AvailbleExplanation = () => (
    <View style={{
      flexDirection: 'row', marginLeft: PADDING.l, marginTop: -10,
    }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: 8, width: 8, borderRadius: 100, marginTop: 2, marginRight: 6, backgroundColor: COLORS.primary[700],
        }}
        />
        <Label
          type={1}
          color={COLORS.primary[700]}
          text={i18n.t('available')}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
        <View style={{
          height: 8, width: 8, borderRadius: 100, marginTop: 2, marginRight: 6, borderWidth: 1, borderColor: COLORS.neutral[300],
        }}
        />
        <Label
          type={1}
          color={COLORS.neutral[300]}
          text={i18n.t('unavailable')}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HybridHeader
        title={i18n.t('Find date')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
        content={<AvailbleExplanation />}
      >

        <View style={styles.innerContainer}>
          {!dateRange && (
          <SetupContainer
            onPress={() => setCalendarVisible(true)}
            type="date"
            style={{ margin: PADDING.s }}
          />
          )}
          <CalendarAvailabilityContainer
            onPress={() => setIsVisible(true)}
            style={{ marginBottom: 40 }}
          />
        </View>
      </HybridHeader>
      <AvailabilityModal
        isVisible={isVisible}
        data={availabilityData}
        onRequestClose={() => setIsVisible(false)}
      />

      {dateRange && (
      <HighlightContainer
        onPress={() => setBoardingPassVisible(true)}
        description={i18n.t('Date')}
        text={Utils.getDateRange(dateRange)}
      />
      )}

      <BoardingPassModal
        isVisible={isBoardingPassVisible}
        onRequestClose={() => setBoardingPassVisible(false)}
      />

      <CalendarModal
        isVisible={calendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
        minimumDate={new Date()}
        initialStartDate={startDate}
        initialEndDate={endDate}
        onApplyClick={(startData, endData) => {
          if (startData != null && endData != null) {
            setStartDate(Date.parse(startData) / 1000);
            setEndDate(Date.parse(endData) / 1000);
            handleDateUpdate();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  dateCarousel: {
    paddingHorizontal: PADDING.m,
    paddingTop: 20,
    paddingBottom: 25,
  },
  innerContainer: {
    paddingBottom: 120,
  },
  tileContainer: {
    paddingTop: 10,
    paddingBottoms: 20,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
    marginBottom: 20,
  },
  suggestedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.m,
  },
});
