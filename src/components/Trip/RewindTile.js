import { StyleSheet, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Foundation';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function RewindTile({ style }) {
  const location = 'Pula, Croatia';
  return (
    <View style={[styles.container, style]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary[700],
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
