import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Body from './typography/Body';
import COLORS from '../constants/Theme';

export default function ContactTile({ contact }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleTap = () => {
    if (contact.phoneNumbers.length > 1) setIsExpanded(!isExpanded);
    setIsSelected(!isSelected);
  };

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const getNumberTile = (number) => (
    <TouchableOpacity style={styles.numberContainer}>
      <Body text={capitalize(number.label)} type={3} />
      <Body text={number.number} type={3} color={COLORS.neutral[700]} />
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handleTap}>
        <Body
          type={3}
          text={`${contact.givenName} ${contact.familyName}`}
          color={isSelected ? COLORS.shades[100] : COLORS.neutral[700]}
        />
        {contact.phoneNumbers.length > 1
          ? (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.neutral[300]}
            />
          ) : isSelected
          && <Icon name="check" size={22} />}
      </TouchableOpacity>
      {isExpanded && (
        <View>
          {contact.phoneNumbers.map((n) => getNumberTile(n))}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopColor: COLORS.neutral[100],
    borderTopWidth: 1,
  },
  numberContainer: {
    paddingHorizontal: 30,
    marginBottom: 18,
  },
});
