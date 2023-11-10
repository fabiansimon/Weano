import {View, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import moment from 'moment';
import ContextMenu from 'react-native-context-menu-view';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Body from './typography/Body';
import Utils from '../utils';
import i18n from '../utils/i18n';
import Avatar from './Avatar';
import Subtitle from './typography/Subtitle';

export default function RecapCardMini({data, style, onPress, onLongPress}) {
  const {destinations, dateRange, title, activeMembers, type} = data;
  const MAX_AVATARS = 4;

  const getDayDifference = dates => {
    if (!dates) {
      return;
    }

    const toDate = moment(Utils.getDateFromTimestamp(dates.startDate / 1000));

    const difference = Utils.getDaysDifference(toDate);
    return difference;
  };

  const daysDifference = getDayDifference(dateRange);
  const isRecent = type === 'recent';
  const isActive = type === 'active';

  const color = isRecent
    ? COLORS.primary
    : isActive
    ? COLORS.error
    : COLORS.success;

  const getDayString = () => {
    if (isActive) {
      return i18n.t('Active');
    }

    if (isRecent) {
      return `${Math.abs(daysDifference)} ${i18n.t('days ago')}`;
    }
    return `${i18n.t('in')} ${daysDifference} ${
      daysDifference === 1 ? i18n.t('day') : i18n.t('days')
    }`;
  };

  const getActions = () => {
    const memories = {
      title: i18n.t('See memories'),
      subtitle: i18n.t('Check out the memories'),
      systemIcon: 'photo',
    };
    const invite = {
      title: i18n.t('Invite Friends'),
      subtitle: i18n.t('Share link to join'),
      systemIcon: 'square.and.arrow.up',
    };
    const map = {title: i18n.t('Visit on Map'), systemIcon: 'map'};
    if (isRecent) {
      return [memories, map];
    }
    return [invite, map];
  };
  const actions = getActions();

  return (
    <ContextMenu
      previewBackgroundColor={COLORS.neutral[50]}
      actions={actions}
      disabled={!onLongPress}
      onPress={e => onLongPress(e)}>
      <Pressable style={[styles.container, style]} onPress={onPress}>
        <View>
          <Body type={1} text={title} numberOfLines={1} />
          <Body
            type={2}
            numberOfLines={1}
            text={destinations[0]?.placeName?.split(',')[0]}
            color={COLORS.neutral[300]}
            isDense
          />
          <View style={styles.dateContainer}>
            <Body
              type={2}
              text={`${Utils.getDateFromTimestamp(
                dateRange.startDate,
                'Do MMM',
              )} - ${Utils.getDateFromTimestamp(
                dateRange.endDate,
                'Do MMM YYYY',
              )}`}
              color={COLORS.neutral[500]}
            />
          </View>
        </View>
        <View style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <View
            style={[
              styles.daysContainer,
              {
                backgroundColor: Utils.addAlpha(color[700], 0.2),
              },
            ]}>
            <Subtitle
              type={1}
              text={getDayString()}
              color={color[isRecent ? 700 : 900]}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            {activeMembers &&
              activeMembers.map((member, index) => {
                if (index > MAX_AVATARS) {
                  return;
                }
                if (index === MAX_AVATARS) {
                  return (
                    <Avatar
                      disabled
                      size={24}
                      string={`+${activeMembers.length - MAX_AVATARS}`}
                      style={{marginLeft: -8}}
                    />
                  );
                }

                return (
                  <Avatar
                    disabled
                    key={member.id}
                    data={member}
                    size={24}
                    style={{marginLeft: -8}}
                  />
                );
              })}
          </View>
        </View>
      </Pressable>
    </ContextMenu>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderWidth: 0.5,
    padding: PADDING.s,
  },
  dateContainer: {
    marginTop: 10,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[50],
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  daysContainer: {
    borderRadius: RADIUS.xl,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
});
