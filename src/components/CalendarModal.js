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
  isSingleDate = false,
  onApplyClick,
}) => {
  const [dateRange, setDateRange] = useState(null);
  const [date, setDate] = useState(initialStartDate);
  const RANGE = 24;

  const onDayTap = (day) => {
    if (isSingleDate) {
      return setDate((prev) => (prev?.timestamp === day?.timestamp ? null : day));
    }

    if (day.dateString === dateRange?.start?.dateString) {
      return setDateRange((prev) => ({
        ...prev,
        start: null,
      }));
    }

    if (day.dateString === dateRange?.end?.dateString) {
      return setDateRange((prev) => ({
        ...prev,
        end: null,
      }));
    }

    if (!dateRange?.start) {
      return setDateRange((prev) => ({
        ...prev,
        start: day,
      }));
    }

    if (!dateRange?.end) {
      return setDateRange((prev) => ({
        ...prev,
        end: day,
      }));
    }

    if (day.timestamp < dateRange?.start?.timestamp) {
      return setDateRange((prev) => ({
        ...prev,
        start: day,
      }));
    }

    setDateRange((prev) => ({
      ...prev,
      end: day,
    }));
  };

  const getDateRange = useMemo(() => {
    const range = {};
    if (isSingleDate) {
      if (!date) {
        return range;
      }

      const _date = moment(date.timestamp);
      const formatted = JSON.stringify(_date).split('T')[0].replace('"', '');
      range[formatted] = {
        startingDay: true, endingDay: true, color: COLORS.primary[700], textColor: COLORS.shades[0],
      };
      return range;
    }

    if (!dateRange?.start && !dateRange?.end) {
      return;
    }

    let diff = 1;
    if (dateRange.start && dateRange.end) {
      diff = Utils.getDaysDifference(dateRange.start.timestamp / 1000, dateRange.end.timestamp / 1000, true) + 1;
    }

    for (let i = 0; i < diff; i += 1) {
      const _date = moment(dateRange.start ? dateRange.start.timestamp : dateRange.end.timestamp).add(i, 'days');
      const formatted = JSON.stringify(_date).split('T')[0].replace('"', '');
      range[formatted] = {
        startingDay: i === 0, endingDay: i === diff - 1, color: i === diff - 1 ? COLORS.error[700] : COLORS.primary[700], textColor: COLORS.shades[0],
      };
    }

    return range;
  }, [dateRange, date]);

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={() => {
        onRequestClose();
        setDateRange({});
      }}
      title={i18n.t('Choose dates')}
      actionLabel={i18n.t('Apply')}
      isDisabled={!((isSingleDate && date) || (!isSingleDate && dateRange.start && dateRange.end))}
      onPress={() => onApplyClick()}
    >
      <CalendarList
        style={{ paddingTop: 10 }}
        minDate={minDate}
        markingType="period"
        // markingType="period"
        onDayPress={(day) => onDayTap(day)}
        markedDates={getDateRange}
        theme={styles.calendar}
        pastScrollRange={0}
        futureScrollRange={RANGE}
        staticHeader
        showScrollIndicator={false}
        renderHeader={(d) => (
          <Headline
            type={4}
            style={{
              marginBottom: 10, marginTop: 10, fontWeight: '500', width: '100%',
            }}
            text={d.toString('MMMM yyyy')}
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
