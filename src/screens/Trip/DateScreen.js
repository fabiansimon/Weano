import { View, StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../../components/typography/Headline';
import HighlightContainer from '../../components/Trip/HighlightContainer';
import TrailContainer from '../../components/Trip/TrailContainer';
import DateRangeContainer from '../../components/Trip/DateRangeContainer';
import AvailabilityModal from '../../components/Trip/AvailabilityModal';
import AvailabilityCard from '../../components/Trip/AvailabilityCard';
import FilterModal from '../../components/FilterModal';
import CalendarOverviewModal from '../../components/Trip/CalendarOverviewModal';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';

export default function DateScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);
  const [voteIndex, setVoteIndex] = useState(-1);
  const [days, setDays] = useState(7);
  const [daysVisible, setDaysVisible] = useState(false);

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
          <HighlightContainer
            onPress={() => setOverviewVisible(true)}
            description={i18n.t('Current dates')}
            text="21.04 to 28.04"
            style={{ marginBottom: 20 }}
          />
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
                  onPress={() => setVoteIndex(index === voteIndex ? -1 : index)}
                  isActive={index === voteIndex}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[50],
  },
  dateCarousel: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  innerContainer: {
    paddingHorizontal: 15,
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
    paddingHorizontal: 20,
  },
});
