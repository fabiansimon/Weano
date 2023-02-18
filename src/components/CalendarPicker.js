/* eslint-disable no-param-reassign */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, View, Pressable, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import months from '../constants/Months';
import COLORS, { RADIUS } from '../constants/Theme';
import Body from './typography/Body';
import Headline from './typography/Headline';

const CalendarPicker = ({
  minDate,
  startDate,
  endDate,
  startEndDateChange,
}) => {
  // STATE & MISC
  const [dateList, setDateList] = useState([]);
  const currentMonthDate = useRef(new Date()).current;
  const minimumDate = useRef(minDate).current;
  const maximumDate = useRef(null).current;

  const setListOfDate = useCallback((monthDate) => {
    const dates = [];
    const newDate = new Date();
    newDate.setFullYear(monthDate.getFullYear(), monthDate.getMonth(), 0);
    const prevMonthDate = newDate.getDate();
    let previousMothDay = 0;

    if (newDate.getDay() !== 0) {
      previousMothDay = newDate.getDay() === 0 ? 7 : newDate.getDay();
      for (let i = 1; i <= previousMothDay; i += 1) {
        const date = new Date(newDate);
        date.setDate(prevMonthDate - (previousMothDay - i));

        dates.push(date);
      }
    }
    for (let i = 0; i < 42 - previousMothDay; i += 1) {
      const date = new Date(newDate);
      date.setDate(prevMonthDate + (i + 1));
      dates.push(date);
    }
    // console.log(dates);
    setDateList(dates);
  }, []);

  useEffect(() => {
    setListOfDate(new Date());
  }, [setListOfDate]);

  const getIsInRange = (date) => {
    if (startDate != null && endDate != null) {
      if (date > startDate && date < endDate) {
        return true;
      }
      return false;
    }
    return false;
  };

  const getIsItStartAndEndDate = (date) => {
    if (startDate != null && startDate.toDateString() === date.toDateString()) {
      return true;
    } if (
      endDate != null
      && endDate.toDateString() === date.toDateString()
    ) {
      return true;
    }
    return false;
  };

  const isStartDateRadius = (date) => {
    if (startDate != null && startDate.toDateString() === date.toDateString()) {
      return true;
    } if (date.getDay() === 1) {
      return true;
    }
    return false;
  };

  const isEndDateRadius = (date) => {
    if (endDate != null && endDate.toDateString() === date.toDateString()) {
      return true;
    } if (date.getDay() === 0) {
      return true;
    }
    return false;
  };

  const onDateClick = (date) => {
    if (startDate == null) {
      startDate = date;
    } else if (
      startDate.toDateString() !== date.toDateString()
      && endDate == null
    ) {
      endDate = date;
    } else if (startDate.toDateString() === date.toDateString()) {
      startDate = null;
    } else if (endDate?.toDateString() === date.toDateString()) {
      endDate = null;
    }
    if (startDate == null && endDate != null) {
      startDate = endDate;
      endDate = null;
    }
    if (startDate != null && endDate != null) {
      if (endDate <= startDate) {
        const d = startDate;
        startDate = endDate;
        endDate = d;
      }
      if (date < startDate) {
        startDate = date;
      }
      if (date > endDate) {
        endDate = date;
      }
    }

    startEndDateChange(startDate, endDate);
  };

  const getDaysNameUI = () => {
    if (dateList.length === 0) {
      return;
    }

    const listUI = [];
    for (let i = 0; i < 7; i += 1) {
      listUI.push(
        <View key={i.toString()} style={{ flex: 1, alignItems: 'center' }}>
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
              dateList[i].getDay()
            ]}`}
          />
        </View>,
      );
    }
    return listUI;
  };

  const getDaysNoUI = () => {
    const noList = [];
    let count = 0;
    for (let i = 0; i < dateList.length / 7; i += 1) {
      const listUI = [];
      for (let j = 0; j < 7; j += 1) {
        const date = dateList[count];
        listUI.push(
          <View key={count.toString()} style={{ flex: 1, aspectRatio: 1.0 }}>
            <View
              style={{
                flex: 1,
                marginVertical: 3,
                // paddingVertical: 2,
                paddingLeft: isStartDateRadius(date) ? 4 : 0,
                paddingRight: isEndDateRadius(date) ? 4 : 0,
                backgroundColor:
                  startDate != null && endDate != null
                    ? getIsItStartAndEndDate(date) || getIsInRange(date)
                      ? COLORS.primary[50]
                      : 'transparent'
                    : 'transparent',
                borderBottomLeftRadius: isStartDateRadius(date) ? RADIUS.l : 0,
                borderTopLeftRadius: isStartDateRadius(date) ? RADIUS.l : 0,
                borderTopRightRadius: isEndDateRadius(date) ? RADIUS.l : 0,
                borderBottomRightRadius: isEndDateRadius(date) ? RADIUS.l : 0,
              }}
            />
            <View
              style={[
                {
                  ...StyleSheet.absoluteFillObject,
                  padding: 2,
                  borderRadius: 32,
                  backgroundColor: getIsItStartAndEndDate(date)
                    ? COLORS.primary[500]
                    : 'transparent',
                },
                getIsItStartAndEndDate(date) && {
                  ...Platform.select({
                    ios: {
                      shadowColor: COLORS.shades[100],
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2.63,
                    },
                    android: { elevation: 4 },
                  }),
                },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: Platform.OS === 'android' && pressed ? 0.4 : 1,
                  },
                ]}
                android_ripple={{ borderless: true }}
                onPress={() => {
                  if (currentMonthDate.getMonth() === date.getMonth()) {
                    if (minimumDate != null && maximumDate != null) {
                      const newMinimumDate = new Date(minimumDate);
                      newMinimumDate.setDate(minimumDate.getDate() - 1);
                      const newMaximumDate = new Date(maximumDate);
                      newMaximumDate.setDate(maximumDate.getDate() + 1);
                      if (date > newMinimumDate && date < newMaximumDate) {
                        onDateClick(date);
                      }
                    } else if (minimumDate != null) {
                      const newMinimumDate = new Date(minimumDate);

                      if (date >= newMinimumDate) {
                        onDateClick(date);
                      }
                    } else if (maximumDate != null) {
                      const newMaximumDate = new Date(maximumDate);
                      newMaximumDate.setDate(maximumDate.getDate() + 1);
                      if (date < newMaximumDate) {
                        onDateClick(date);
                      }
                    } else {
                      onDateClick(date);
                    }
                  }
                }}
              >
                <Body
                  text={date.getDate()}
                  color={getIsItStartAndEndDate(date)
                    ? COLORS.shades[0]
                    : currentMonthDate.getMonth() === date.getMonth()
                      ? COLORS.shades[100]
                      : COLORS.neutral[100]}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 6,
                    width: 6,
                    borderRadius: 3,
                    backgroundColor:
                      new Date().toDateString() === date.toDateString()
                        ? getIsInRange(date)
                          ? COLORS.shades[0]
                          : COLORS.primary[700]
                        : 'transparent',
                  }}
                />
              </Pressable>
            </View>
          </View>,
        );
        count += 1;
      }
      noList.push(
        <View
          key={i.toString()}
          style={{ flexDirection: 'row', marginVertical: 1 }}
        >
          {listUI}
        </View>,
      );
    }
    return noList;
  };

  return (
    <View style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
      <View style={{ flexDirection: 'row', padding: 8 }}>
        <View style={styles.arrowContainerStyle}>
          <Pressable
            style={({ pressed }) => [
              styles.arrowBtnStyle,
              { opacity: Platform.OS === 'android' && pressed ? 0.6 : 1 },
            ]}
            android_ripple={{ color: 'lighgrey' }}
            onPress={() => {
              // currentMonthDate = new Date();
              currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
              setListOfDate(currentMonthDate);
            }}
          >
            <Icon name="keyboard-arrow-left" size={22} color={COLORS.neutral[500]} />
          </Pressable>
        </View>
        <Headline
          type={4}
          style={styles.monthHeaderStyle}
          text={`${months[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`}
        />
        <View style={styles.arrowContainerStyle}>
          <Pressable
            style={({ pressed }) => [
              styles.arrowBtnStyle,
              { opacity: Platform.OS === 'android' && pressed ? 0.6 : 1 },
            ]}
            android_ripple={{ color: 'lighgrey' }}
            onPress={() => {
              // currentMonthDate = new Date();
              currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
              setListOfDate(currentMonthDate);
            }}
          >
            <Icon name="keyboard-arrow-right" size={22} color={COLORS.neutral[500]} />
          </Pressable>
        </View>
      </View>
      <View
        style={{ flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 8 }}
      >
        {getDaysNameUI()}
      </View>
      <View style={{ paddingHorizontal: 8 }}>{getDaysNoUI()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainerStyle: {
    borderRadius: 24,
    borderWidth: 0.6,
    borderColor: COLORS.neutral[100],
    overflow: 'hidden',
  },
  arrowBtnStyle: {
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthHeaderStyle: {
    flex: 1,
    textAlign: 'center',
  },
});

export default CalendarPicker;
