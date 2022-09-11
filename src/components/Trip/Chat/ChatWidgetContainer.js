import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../../../constants/Theme';

export default function ChatWidgetContainer({ style, content, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, style]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.neutral[900],
    shadowRadius: 10,
    shadowOpacity: 0.05,
  },
});
