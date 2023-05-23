import {
  View,
  TouchableHighlight,
  StyleSheet,
  Pressable,
  Animated,
  LayoutAnimation,
} from 'react-native';
import React, {useState} from 'react';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import EntIcon from 'react-native-vector-icons/Entypo';
import Body from '../typography/Body';
import Avatar from '../Avatar';
import i18n from '../../utils/i18n';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';

const AnimatedTouchableHighlight =
  Animated.createAnimatedComponent(TouchableHighlight);

export default function SplitExpenseContainer({
  style,
  expense,
  onPress,
  activeMembers,
  currency,
}) {
  // STATE && MISC
  const [isExpanded, setIsExpanded] = useState(false);
  const {amount, splitBy} = expense;
  const duration = 300;

  const getPersonTile = (user, isIncluded) => {
    const {avatarUri, firstName} = user;
    return (
      <View style={styles.splitByContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar size={20} avatarUri={avatarUri} />
          <Body type={1} style={{marginLeft: 6}} text={firstName} />
        </View>
        <View
          style={[
            styles.checkbox,
            {
              borderWidth: isIncluded ? 0 : 1,
              backgroundColor: isIncluded ? COLORS.success[500] : 'transparent',
            },
          ]}>
          <EntIcon name="check" color={COLORS.shades[0]} size={16} />
        </View>
      </View>
    );
  };
  return (
    <AnimatedTouchableHighlight
      onPress={() => {
        onPress && onPress();
        RNReactNativeHapticFeedback.trigger('impactLight');
      }}
      underlayColor={COLORS.neutral[50]}
      style={[styles.sharedByContainer, style]}>
      <>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext({
              duration,
              create: {type: 'linear', property: 'opacity'},
              update: {type: 'spring', springDamping: 0.9},
            });
            setIsExpanded(prev => !prev);
          }}
          style={styles.header}>
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <Body
              type={2}
              text={'Shared equally between'}
              color={COLORS.neutral[300]}
            />
            <Body
              type={2}
              text={`${expense?.splitBy?.length} ${
                expense?.splitBy?.length === 1
                  ? i18n.t('traveler')
                  : i18n.t('travelers')
              }`}
              color={
                expense?.splitBy?.length <= 0
                  ? COLORS.error[900]
                  : COLORS.shades[100]
              }
              style={{fontWeight: '500', marginLeft: 2}}
            />
          </View>
          <EntIcon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={COLORS.neutral[300]}
            style={{marginTop: 4, marginRight: 4}}
          />
        </Pressable>
        {isExpanded &&
          activeMembers?.map(member =>
            getPersonTile(member, expense.splitBy.includes(member.id)),
          )}

        {isExpanded && (
          <View style={styles.bottomSummaryContainer}>
            <Body
              type={2}
              text={'Amount per person'}
              color={COLORS.neutral[300]}
              style={{marginTop: 2}}
            />
            <Body
              type={2}
              text={`${currency.symbol}${
                splitBy.length <= 0 ? 0 : (amount / splitBy.length).toFixed(2)
              }`}
              color={COLORS.shades[100]}
              style={{marginTop: 2, fontWeight: '500'}}
            />
          </View>
        )}
      </>
    </AnimatedTouchableHighlight>
  );
}

const styles = StyleSheet.create({
  splitByContainer: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSummaryContainer: {
    marginHorizontal: -PADDING.s,
    paddingHorizontal: 10,
    height: 37.5,
    alignItems: 'center',
    borderTopColor: COLORS.neutral[100],
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkbox: {
    borderColor: COLORS.neutral[300],
    borderRadius: 8,
    borderWidth: 1,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sharedByContainer: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.s,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingTop: 4,
    overflow: 'hidden',
  },
  header: {
    marginTop: -4,
    paddingTop: 4,
    marginHorizontal: -10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
});
