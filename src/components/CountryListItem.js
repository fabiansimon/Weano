import { View, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';

export default function CountryListItem({
  country,
  index,
  onPress,
  isSelected,
  countryData,
  searchActive,
  showPrefix,
}) {
  const showDivider = searchActive
    ? false
    : country.isPref
      && countryData[index + 1] != null
      && !countryData[index + 1].isPref;

  const { dialCode, name, flag } = country;
  return (
    <>
      <Pressable onPress={onPress} style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 75, flexDirection: 'row', alignItems: 'center' }}>
            <Headline text={flag} style={{ fontSize: 16, marginRight: 10 }} />
            {showPrefix && (
            <Body type={1} color={COLORS.neutral[300]} text={dialCode} />
            )}
          </View>
          <Body type={1} text={name} />
        </View>
        {isSelected && (
        <View style={{
          borderRadius: RADIUS.xl,
          backgroundColor: COLORS.primary[700],
          padding: 4,
        }}
        >
          <Icon name="check" color={COLORS.shades[0]} size={12} />
        </View>
        )}
      </Pressable>
      <View
        style={[styles.divider, { borderBottomWidth: showDivider ? 1 : 0 }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    marginHorizontal: PADDING.s,
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
  },
  divider: {
    borderColor: COLORS.neutral[100],
  },
});
