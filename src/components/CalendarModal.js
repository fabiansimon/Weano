import moment from 'moment';
import React, { useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { View } from 'react-native-animatable';
import { CalendarList } from 'react-native-calendars';
import COLORS from '../constants/Theme';
import Utils from '../utils';
import i18n from '../utils/i18n';
import TitleModal from './TitleModal';
import Body from './typography/Body';
import Headline from './typography/Headline';

const CalendarModal = ({
  isVisible,
  onRequestClose,
  minDate = new Date(),
  initialStartDate,
  initialEndDate,
  onApplyClick,
}) => {
  const [dateRange, setDateRange] = useState({});
  const RANGE = 24;

  const onDayTap = (day) => {
    if (day === dateRange.start) {
      return setDateRange((prev) => ({
        ...prev,
        start: null,
      }));
    }

    if (day === dateRange.end) {
      return setDateRange((prev) => ({
        ...prev,
        end: null,
      }));
    }

    if (!dateRange.start) {
      return setDateRange({
        start: day,
        end: null,
      });
    }

    if (!dateRange.end) {
      return setDateRange((prev) => ({
        ...prev,
        end: day,
      }));
    }
  };

  const getDateRange = useMemo(() => {
    if (!dateRange.start) {
      return;
    }

    const range = new Map();

    let diff = 1;
    if (dateRange.start && dateRange.end) {
      diff = Utils.getDaysDifference(dateRange.start.timestamp / 1000, dateRange.end.timestamp / 1000, true);
    }

    for (let i = 0; i < diff; i += 1) {
      const date = moment(dateRange.start).add(i, 'days');
      const formatted = JSON.stringify(date).split('T')[0];
    }

    // {
    //   '2023-05-22': { startingDay: true, color: COLORS.primary[700], textColor: COLORS.shades[0] },
    //   '2023-05-23': { color: COLORS.primary[700], textColor: COLORS.shades[0] },
    //   '2023-05-24': { color: COLORS.primary[700], textColor: COLORS.shades[0] },
    //   '2023-05-25': { endingDay: true, color: COLORS.primary[700], textColor: COLORS.shades[0] },
    // }
    return range;
  }, [dateRange]);

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={() => {
        onRequestClose();
        setDateRange({});
      }}
      title={i18n.t('Choose dates')}
      actionLabel={i18n.t('Apply')}
      isDisabled={false}
      onPress={() => onApplyClick()}
    >
      <CalendarList
        style={{ paddingTop: 10 }}
        minDate={minDate}
        markingType="period"
        onDayPress={(day) => onDayTap(day)}
        markedDates={getDateRange}
        // markedDates={{
        //   '2023-05-22': { startingDay: true, color: COLORS.primary[700], textColor: COLORS.shades[0] },
        //   '2023-05-23': { color: COLORS.primary[700], textColor: COLORS.shades[0] },
        //   '2023-05-24': { color: COLORS.primary[700], textColor: COLORS.shades[0] },
        //   '2023-05-25': { endingDay: true, color: COLORS.primary[700], textColor: COLORS.shades[0] },
        // }}
        theme={styles.calendar}
        // onVisibleMonthsChange={(months) => { console.log('now these months are visible', months); }}
        pastScrollRange={0}
        futureScrollRange={RANGE}
        staticHeader
        showScrollIndicator={false}
        renderHeader={(date) => (
          <Body
            type={1}
            style={{ marginBottom: 10, fontWeight: '500' }}
            text={date.toString('MMMM yyyy')}
          />
        )}
      />
    </TitleModal>
  );
};

const styles = StyleSheet.create({
  calendar: {
    // Month labels
    monthTextColor: COLORS.neutral[900],
    textMonthFontFamily: 'WorkSans-Regular',
    textMonthFontWeight: '500',

    // Number labels
    textDayFontSize: 14,
    textDayFontWeight: '400',
    textDayFontFamily: 'WorkSans-Regular',
    dayTextColor: COLORS.neutral[700],

    // Day labels
    textSectionTitleColor: COLORS.neutral[300],
    textDayHeaderFontWeight: '400',
    textDayHeaderFontSize: 14,
    textDayHeaderFontFamily: 'WorkSans-Regular',

  },
});

export default CalendarModal;
