import { View, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';

export default function BasicHeader({
  style, title, trailing, children,
}) {
  return (
    <View style={[styles.container, style, { paddingBottom: children ? 8 : 0 }]}>
      <SafeAreaView />
      <View style={styles.heading}>
        <BackButton isClear />
        <Headline type={3} text={title} />
        {trailing || <View width={55} />}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.shades[0],
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[50],
  },
  heading: {
    marginTop: -30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
