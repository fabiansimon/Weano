import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {CalendarList} from 'react-native-calendars';
import COLORS from '../constants/Theme';
import Utils from '../utils';
import i18n from '../utils/i18n';
import TitleModal from './TitleModal';
import Headline from './typography/Headline';

const CalendarModal = ({
  isVisible,
  onRequestClose,
  minDate = true,
  initialStartDate,
  initialEndDate,
  isSingleDate = false,
  onApplyClick,
}) => {
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
  const [date, setDate] = useState();
  const RANGE = 24;

  useEffect(() => {
    if (isSingleDate && initialStartDate) {
      const _start = JSON.stringify(
        Utils.getDateFromTimestamp(initialStartDate),
      )
        .split('T')[0]
        .replace('"', '');
      return setDate({
        dateString: _start,
        day: _start.split('-')[2],
        month: _start.split('-')[1],
        timestamp: new Date(_start).getTime(),
        year: _start.split('-')[0],
      });
    }

    if (initialStartDate && initialEndDate) {
      const _start = JSON.stringify(
        Utils.getDateFromTimestamp(initialStartDate),
      )
        .split('T')[0]
        .replace('"', '');
      const _end = JSON.stringify(Utils.getDateFromTimestamp(initialEndDate))
        .split('T')[0]
        .replace('"', '');

      return setDateRange({
        start: {
          dateString: _start,
          day: _start.split('-')[2],
          month: _start.split('-')[1],
          timestamp: new Date(_start).getTime(),
          year: _start.split('-')[0],
        },
        end: {
          dateString: _end,
          day: _end.split('-')[2],
          month: _end.split('-')[1],
          timestamp: new Date(_end).getTime(),
          year: _end.split('-')[0],
        },
      });
    }
  }, [isVisible, initialStartDate, initialStartDate]);

  const onDayTap = day => {
    if (isSingleDate) {
      return setDate(prev => (prev?.timestamp === day?.timestamp ? null : day));
    }

    if (day.dateString === dateRange?.start?.dateString) {
      return setDateRange(prev => ({
        ...prev,
        start: null,
      }));
    }

    if (day.dateString === dateRange?.end?.dateString) {
      return setDateRange(prev => ({
        ...prev,
        end: null,
      }));
    }

    if (!dateRange?.start) {
      return setDateRange(prev => ({
        ...prev,
        start: day,
      }));
    }

    if (!dateRange?.end) {
      return setDateRange(prev => ({
        ...prev,
        end: day,
      }));
    }

    if (day.timestamp < dateRange?.start?.timestamp) {
      return setDateRange(prev => ({
        ...prev,
        start: day,
      }));
    }

    return setDateRange(prev => ({
      ...prev,
      end: day,
    }));
  };

  const handleApply = () => {
    if (
      !isSingleDate &&
      dateRange?.end.timestamp < dateRange?.start.timestamp
    ) {
      const dates = dateRange;
      setDateRange({
        start: dates.end,
        end: dates.start,
      });
    }

    onApplyClick(isSingleDate ? date : dateRange);
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
        startingDay: true,
        endingDay: true,
        color: COLORS.primary[700],
        textColor: COLORS.shades[0],
      };
      return range;
    }

    if (!dateRange?.start && !dateRange?.end) {
      return;
    }

    let diff = 1;
    if (dateRange.start && dateRange.end) {
      diff =
        Utils.getDaysDifference(
          dateRange.start.timestamp / 1000,
          dateRange.end.timestamp / 1000,
          true,
        ) + 1;
    }

    for (let i = 0; i < diff; i += 1) {
      const _date = moment(
        dateRange.start ? dateRange.start.timestamp : dateRange.end.timestamp,
      ).add(i, 'days');
      const formatted = JSON.stringify(_date).split('T')[0].replace('"', '');
      range[formatted] = {
        startingDay: i === 0,
        endingDay: i === diff - 1,
        color: i === diff - 1 ? COLORS.primary[700] : COLORS.primary[700],
        textColor: COLORS.shades[0],
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
      title={isSingleDate ? i18n.t('Choose date') : i18n.t('Choose dates')}
      actionLabel={i18n.t('Apply')}
      isDisabled={
        !(
          (isSingleDate && date) ||
          (!isSingleDate && dateRange?.start && dateRange?.end)
        )
      }
      onPress={handleApply}>
      <CalendarList
        style={{paddingTop: 10}}
        minDate={minDate ? new Date() : null}
        markingType="period"
        onDayPress={day => onDayTap(day)}
        markedDates={getDateRange}
        theme={styles.calendar}
        futureScrollRange={RANGE}
        pastScrollRange={2}
        staticHeader
        showScrollIndicator={false}
        renderHeader={d => (
          <Headline
            type={4}
            style={{
              marginBottom: 10,
              marginTop: 10,
              fontWeight: '500',
              width: '100%',
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
