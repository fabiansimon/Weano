import {
  View, StyleSheet, StatusBar,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useMutation } from '@apollo/client';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import FeatherIcon from 'react-native-vector-icons/Feather';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Label from '../../components/typography/Label';
import activeTripStore from '../../stores/ActiveTripStore';
import SetupContainer from '../../components/Trip/SetupContainer';
import CalendarModal from '../../components/CalendarModal';
import UPDATE_TRIP from '../../mutations/updateTrip';
import Headline from '../../components/typography/Headline';
import RoleChip from '../../components/RoleChip';
import userManagement from '../../utils/userManagement';
import Utils from '../../utils';

export default function DateScreen() {
  // MUTATIONS
  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);

  // STORES
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const { dateRange, id } = activeTripStore((state) => state.activeTrip);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  });
  const [calendarVisible, setCalendarVisible] = useState(false);

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

  const handleDateUpdate = async (start, end) => {
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
            tripId: id,
            dateRange: {
              startDate: start,
              endDate: end,
            },
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

  const getDateContainer = () => (
    <View style={styles.dateContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Headline
          type={4}
          text={i18n.t('Current dates')}
          color={COLORS.neutral[300]}
        />
        <RoleChip
          string={i18n.t('Set by host')}
          isHost
        />
      </View>
      <Pressable
        onPress={() => isHost && setCalendarVisible(true)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Headline
          type={3}
          style={{ marginTop: 4 }}
          text={`${Utils.getDateFromTimestamp(dateRange.startDate, 'DD.MM.YY')} - ${Utils.getDateFromTimestamp(dateRange.endDate, 'DD.MM.YY')}`}
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
  );

  const getAvailbleExplanation = () => (
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
        content={getAvailbleExplanation()}
      >
        <View style={styles.innerContainer}>
          {!dateRange && (
          <SetupContainer
            onPress={() => setCalendarVisible(true)}
            type="date"
            style={{ margin: PADDING.s }}
          />
          )}
          {getDateContainer()}
          {/* <CalendarAvailabilityContainer
            style={{ marginBottom: 40, marginTop: 30 }}
          /> */}
        </View>
      </HybridHeader>

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
            handleDateUpdate(Date.parse(startData) / 1000, Date.parse(endData) / 1000);
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
  innerContainer: {
    paddingBottom: 120,
  },
  dateContainer: {
    marginHorizontal: PADDING.l,
    marginTop: PADDING.xl,
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
