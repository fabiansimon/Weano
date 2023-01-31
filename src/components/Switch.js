import {
  View, StyleSheet, Pressable,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/Theme';

export default function Switch({ bool, onPress, color }) {
  const colorTheme = color || COLORS.neutral[300];

  return (
    <Pressable
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 65,
    height: 28,
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
