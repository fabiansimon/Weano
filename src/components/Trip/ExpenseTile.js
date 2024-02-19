import {Platform, Pressable, StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import COLORS, {RADIUS} from '../../constants/Theme';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import Utils from '../../utils';
import i18n from '../../utils/i18n';
import SwipeView from '../SwipeView';
import Checkbox from '../Checkbox';

export default function ExpenseTile({
  style,
  data,
  user,
  onPress,
  currency,
  isSelf,
  onDelete,
  onIncreaseAmount,
  onLongPress,
  isSelected = -1,
  isSolo,
}) {
  const fullName = useMemo(() => {
    if (user?.firstName) {
      return `${user?.firstName} ${user?.lastName}`;
    }

    return i18n.t('Deleted user');
  }, [user]);

  return (
    <SwipeView
      enabled={isSelected === -1}
      multipleOptions={[
        {
          backgroundColor: COLORS.success[700],
          string: i18n.t('Increase'),
          onPress: () => onIncreaseAmount(),
          isDisabled: onIncreaseAmount == null || Platform.OS !== 'ios',
        },
        {
          backgroundColor: COLORS.error[900],
          string: i18n.t('Delete'),
          onPress: () => onDelete(),
          isDisabled: onDelete == null,
        },
      ]}>
      <Pressable
        onLongPress={() => {
          onLongPress();
          RNReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
          });
        }}
        onPress={onPress}
        style={[styles.container, style]}>
        {isSelected === -1 ? (
          <View
            style={[
              styles.initalContainer,
              {
                backgroundColor:
                  !isSolo && isSelf ? COLORS.primary[500] : COLORS.neutral[100],
              },
            ]}>
            <Headline
              type={4}
              color={!isSolo && isSelf ? COLORS.shades[0] : COLORS.neutral[300]}
              text={user?.firstName[0] || '?'}
            />
          </View>
        ) : (
          <Checkbox
            style={{marginTop: 4, marginHorizontal: 5}}
            isChecked={isSelected === 1 ? true : false}
          />
        )}
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
            <Body type={2} color={COLORS.neutral[300]} text={fullName} />
          </View>
          <View>
            <Headline
              type={4}
              style={{textAlign: 'right'}}
              text={`${currency?.symbol}${data.amount.toFixed(2)}`}
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
