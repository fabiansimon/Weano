import {
  View, StyleSheet, StatusBar,
} from 'react-native';
import React, { useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import AvailabilityModal from '../../components/Trip/AvailabilityModal';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import BoardingPassModal from '../../components/Trip/BoardingPassModal';
import HighlightContainer from '../../components/Trip/HighlightContainer';
import CalendarAvailabilityContainer from '../../components/Trip/CalendarAvailabilityContainer';
import Label from '../../components/typography/Label';

export default function DateScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [isBoardingPassVisible, setBoardingPassVisible] = useState(false);

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

      <HighlightContainer
        onPress={() => setBoardingPassVisible(true)}
        description={i18n.t('Date')}
        text="Paris, France"
      />

      <BoardingPassModal
        isVisible={isBoardingPassVisible}
        onRequestClose={() => setBoardingPassVisible(false)}
        type="date"
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
