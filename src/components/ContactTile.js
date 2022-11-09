import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Body from './typography/Body';
import COLORS from '../constants/Theme';

export default function ContactTile({ contact, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState();

  useEffect(() => {
    console.log(selectedNumber);
  }, [selectedNumber]);

  const handleTap = () => {
    if (contact.phoneNumbers.length > 1) {
      setIsExpanded(!isExpanded);
      return;
    }
    setSelectedNumber(selectedNumber ? null : contact.phoneNumbers);
  };

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const getNumberTile = (number) => (
    <TouchableOpacity
      onPress={() => setSelectedNumber(selectedNumber ? null : number.number)}
      style={styles.numberContainer}
    >
      <View>
        <Body text={capitalize(number.label)} type={3} />
        <Body text={number.number} type={3} color={COLORS.neutral[700]} />
      </View>
      {selectedNumber === number.number && (
      <Icon
        name="check"
        size={22}
      />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, { borderTopWidth: index !== 0 && 1 }]}
        onPress={handleTap}
      >
        <Body
          type={3}
          text={`${contact.givenName} ${contact.familyName} ${!contact.givenName && !contact.familyName ? contact.number : ''}`}
          color={selectedNumber ? COLORS.shades[100] : COLORS.neutral[700]}
        />
        {contact.phoneNumbers.length > 1
          ? (
            <Icon
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={COLORS.neutral[300]}
            />
          ) : selectedNumber
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
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 24,
  },
});
