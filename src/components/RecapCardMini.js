import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Body from './typography/Body';
import Utils from '../utils';
import i18n from '../utils/i18n';
import Avatar from './Avatar';
import Subtitle from './typography/Subtitle';

export default function RecapCardMini({ data, style, onPress }) {
  const {
    location, dateRange, title, activeMembers,
  // eslint-disable-next-line react/destructuring-assignment
  } = data;

  const getDayDifference = (dates) => {
    if (!dates) {
      return;
    }

    const toDate = moment(Utils.getDateFromTimestamp(dates.startDate));
    const fromDate = moment().startOf('day');

    const difference = Math.round(moment.duration(toDate.diff(fromDate)).asDays());
    return difference;
  };
  const daysDifference = getDayDifference(dateRange);
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View>
        <Body
          type={1}
          text={title}
          numberOfLines={1}
        />
        <Body
          type={2}
          numberOfLines={1}
          text={location.placeName}
          color={COLORS.neutral[300]}
          isDense
        />
        <View style={styles.dateContainer}>
          <Body
            type={2}
            text={`${Utils.getDateFromTimestamp(dateRange.startDate, 'Do MMM')} - ${Utils.getDateFromTimestamp(dateRange.endDate, 'Do MMM YYYY')}`}
            color={COLORS.neutral[500]}
          />
        </View>
      </View>
      <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={styles.daysContainer}>
          <Subtitle
            type={1}
            text={`${i18n.t('in')} ${daysDifference} ${i18n.t('days')}`}
            color={COLORS.success[700]}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          {activeMembers && activeMembers.map((member) => (
            <Avatar
              data={member}
              size={24}
              style={{ marginLeft: -8 }}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.shades[0],
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    padding: PADDING.s,
  },
  dateContainer: {
    marginTop: 10,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  daysContainer: {
    borderRadius: RADIUS.xl,
    backgroundColor: Utils.addAlpha(COLORS.success[700], 0.15),
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
});
