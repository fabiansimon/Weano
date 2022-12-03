import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import Headline from '../typography/Headline';
import COLORS, { RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';

export default function ExpenseIndividualCard({ style, data, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.individualCard, style]}
    >
      <Avatar
        disabled
        size={35}
        style={{ alignSelf: 'center' }}
      />
      <View>
        <Body
          type={2}
          text={`${data.user.firstName} ${i18n.t('spent')}`}
          color={COLORS.neutral[300]}
        />
        <Headline
          type={3}
          text={`$${data.amount}`}
          color={COLORS.neutral[900]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  individualCard: {
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[50],
    width: 130,
    height: 130,
  },
});
