import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Foundation';
import COLORS, { RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function RewindTile({ style, onPress }) {
  const location = 'Pula, Croatia';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, style]}
    >
      <Icon
        name="rewind"
        size={26}
        color={COLORS.shades[0]}
        style={{ marginRight: 16 }}
      />
      <Body
        type={1}
        text={`${1} ${i18n.t('year ago')} `}
        style={{ fontWeight: '500' }}
        color={COLORS.shades[0]}
      />
      <Body
        type={1}
        text={i18n.t('you were in')}
        color={COLORS.shades[0]}
      />
      <Body
        type={1}
        text={` ${location}`}
        style={{ fontWeight: '500' }}
        color={COLORS.shades[0]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.primary[700],
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
