/* eslint-disable react/jsx-curly-brace-presence */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from './src/constants/Theme';
import Headline from './src/components/typography/Headline';
import Divider from './src/components/Divider';
import Label from './src/components/typography/Label';
import i18n from './src/utils/i18n';

export default function CalendarAvailabilityContainer({ style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon name="arrowleft" size={22} />
        <Headline type={3} text={'July'} />
        <Icon name="arrowright" size={22} />
      </View>
      <Divider vertical={2} />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            height: 8, width: 8, borderRadius: 100, marginTop: 2, marginRight: 6, backgroundColor: COLORS.primary[700],
          }}
          />
          <Label
            type={1}
            color={COLORS.primary[700]}
            text={i18n.t('available')}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <View style={{
            height: 8, width: 8, borderRadius: 100, marginTop: 2, marginRight: 6, borderWidth: 1, borderColor: COLORS.neutral[300],
          }}
          />
          <Label
            type={1}
            color={COLORS.neutral[500]}
            text={i18n.t('unavailable')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
