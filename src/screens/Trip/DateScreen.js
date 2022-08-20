import { View, StyleSheet } from 'react-native';
import React, { useState, useRef, useMemo } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../../components/typography/Headline';
import TrailContainer from '../../components/Trip/TrailContainer';
import DateRangeContainer from '../../components/Trip/DateRangeContainer';
import AvailabilityModal from '../../components/Trip/AvailabilityModal';
import AvailabilityCard from '../../components/Trip/AvailabilityCard';
import FilterModal from '../../components/FilterModal';
import CalendarOverviewModal from '../../components/Trip/CalendarOverviewModal';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Divider from '../../components/Divider';
import BoardingPassModal from '../../components/Trip/BoardingPassModal';
// import BoardingPassBackDrop from '../../components/Trip/BoardingPassBackDrop';

export default function DateScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);
  const [days, setDays] = useState(7);
  const [daysVisible, setDaysVisible] = useState(false);
  const snapPoints = useMemo(() => ['20%', '85%'], []);
  const sheetRef = useRef(null);

  const daysOptions = {
    title: 'Set days amount',
    options: [
      {
        name: i18n.t('7 Days'),
        value: 7,
      },
      {
        name: i18n.t('14 Days'),
        value: 14,
      },
      {
        name: i18n.t('21 Days'),
        value: 21,
      },
      {
        name: i18n.t('28 Days'),
        value: 28,
      },
    ],
  };

  const dateData = [
    {
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      votes: 5,
    },
    {
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      votes: 4,
    },
    {
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      votes: 3,
    },
    {
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      votes: 3,
    },
  ];

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

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find date')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <View style={styles.tileContainer}>
            <View style={styles.suggestedHeader}>
              <Headline
                type={3}
                text={i18n.t('Suggested dates for')}
              />
              <TrailContainer
                text={`${days} ${i18n.t('days')}`}
                icon="chevron-down"
                onPress={() => setDaysVisible(true)}
              />
            </View>
            <ScrollView horizontal style={styles.dateCarousel}>
              {dateData.map((date, index) => (
                <DateRangeContainer
                  style={{ marginRight: dateData.length - 1 !== index ? 10 : 40 }}
                  dateRange={date.dateRange}
                  title={date.votes}
                  subtitle={i18n.t('votes')}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.tileContainer}>
            <View style={styles.suggestedHeader}>
              <Headline
                type={3}
                text={i18n.t('Your (un)availabilities')}
              />
              <TrailContainer
                onPress={() => setIsVisible(true)}
                text={i18n.t('add')}
                icon="plus"
              />
            </View>
            <Headline
              type={4}
              style={{ marginLeft: PADDING.m, marginBottom: -10, marginTop: 14 }}
              text={i18n.t('Available')}
            />
            <ScrollView horizontal style={styles.dateCarousel}>
              {availabilityData.available.map((date, index) => (
                <AvailabilityCard
                  style={{ marginRight: availabilityData.length - 1 !== index ? 10 : 40 }}
                  dateRange={date.dateRange}
                />
              ))}
            </ScrollView>
            <Divider
              top={1}
              style={{ marginHorizontal: PADDING.m }}
            />
            <Headline
              type={4}
              style={{ marginLeft: PADDING.m, marginBottom: -10, marginTop: 10 }}
              text={i18n.t('Unavailable')}
            />
            <ScrollView horizontal style={styles.dateCarousel}>
              {availabilityData.available.map((date, index) => (
                <AvailabilityCard
                  style={{ marginRight: availabilityData.length - 1 !== index ? 10 : 40 }}
                  dateRange={date.dateRange}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </HybridHeader>
      <AvailabilityModal
        isVisible={isVisible}
        data={availabilityData}
        onRequestClose={() => setIsVisible(false)}
      />
      <CalendarOverviewModal
        isVisible={overviewVisible}
        onRequestClose={() => setOverviewVisible(false)}
      />
      <FilterModal
        isVisible={daysVisible}
        onRequestClose={() => setDaysVisible(false)}
        data={daysOptions}
        onPress={(d) => setDays(d.value)}
      />
      <BottomSheet
        handleIndicatorStyle={{ opacity: 0 }}
        backgroundStyle={{
          backgroundColor: 'transparent',
          borderRadius: 20,
        }}
        // backdropComponent={BoardingPassBackDrop}
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
      >
        <BoardingPassModal type="date" />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[50],
    paddingBottom: 100,
  },
  dateCarousel: {
    paddingHorizontal: PADDING.m,
    paddingTop: 20,
    paddingBottom: 25,
  },
  innerContainer: {
    paddingHorizontal: PADDING.s,
    paddingTop: 20,
    paddingBottom: 36,
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