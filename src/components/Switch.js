import {
  View, StyleSheet, TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/Theme';

export default function Switch({ bool, onPress, color }) {
  const colorTheme = color || COLORS.shades[100];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { borderColor: colorTheme }]}
    >
      <View style={[styles.innerContainer, { backgroundColor: bool ? colorTheme : 'transparent' }]}>
        <Icon
          name="person"
          size={14}
          color={bool ? COLORS.shades[0] : colorTheme}
        />
      </View>
      <View style={[styles.innerContainer, { backgroundColor: !bool ? colorTheme : 'transparent' }]}>
        <Icon
          name="people"
          size={16}
          color={!bool ? COLORS.shades[0] : colorTheme}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 70,
    height: 30,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    borderRadius: 100,
  },
});