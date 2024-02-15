import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import COLORS, {RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';

import Body from '../typography/Body';
import Utils from '../../utils';
import i18n from '../../utils/i18n';
import SwipeView from '../SwipeView';

export default function ExpenseTile({
  style,
  data,
  user,
  onPress,
  currency,
  isSelf,
  onDelete,
  onIncreaseAmount,
}) {
  const getFullName = () => {
    if (user?.firstName) {
      return `${user?.firstName} ${user?.lastName}`;
    }

    return i18n.t('Deleted user');
  };
  return (
    <SwipeView
      multipleOptions={[
        {
          backgroundColor: COLORS.success[700],
          string: i18n.t('Increase'),
          onPress: () => onIncreaseAmount(),
          isDisabled: onIncreaseAmount == null,
        },
        {
          backgroundColor: COLORS.error[900],
          string: i18n.t('Delete'),
          onPress: () => onDelete(),
          isDisabled: onDelete == null,
        },
      ]}>
      <Pressable onPress={onPress} style={[styles.container, style]}>
        <View
          style={[
            styles.initalContainer,
            {
              backgroundColor: isSelf
                ? COLORS.primary[500]
                : COLORS.neutral[100],
            },
          ]}>
          <Headline
            type={4}
            color={isSelf ? COLORS.shades[0] : COLORS.neutral[300]}
            text={user?.firstName[0] || '?'}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginLeft: 15,
          }}>
          <View style={{flex: 1}}>
            <Body
              type={1}
              numberOfLines={1}
              ellipsizeMode="tail"
              text={data.title}
            />
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={`${getFullName()}`}
            />
          </View>
          <View>
            <Headline
              type={4}
              style={{textAlign: 'right'}}
              text={`${currency?.symbol}${data.amount}`}
            />
            <Body
              type={2}
              style={{textAlign: 'right'}}
              color={COLORS.neutral[300]}
              text={Utils.getDateFromTimestamp(
                data.createdAt / 1000,
                'DD.MM.YYYY • HH:mm',
              )}
            />
          </View>
        </View>
      </Pressable>
    </SwipeView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
    flexDirection: 'row',
  },
  initalContainer: {
    marginTop: 4,
    height: 35,
    width: 35,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
