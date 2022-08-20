import { StyleSheet, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';

export default function Chip({ style, text, onDelete }) {
  return (
    <View style={[styles.container, style]}>
      <Headline
        type={4}
        text={text}
      />
      {onDelete
        && (
        <Icon
          onPress={onDelete}
          suppressHighlighting
          style={{ marginLeft: 8 }}
          name="closecircle"
          size={14}
          color={COLORS.neutral[300]}
        />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    padding: PADDING.s,
  },
});
