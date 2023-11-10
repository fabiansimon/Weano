import {StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, {RADIUS} from '../constants/Theme';
import Label from './typography/Label';
import i18n from '../utils/i18n';

export default function ProUserBubble({style}) {
  return (
    <View style={[styles.container, style]}>
      <Label type={1} color={COLORS.shades[0]} text={i18n.t('Pro Member')} />
      <Icon
        style={{marginLeft: 4}}
        name="star"
        size={10}
        color={COLORS.shades[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    height: 20,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
