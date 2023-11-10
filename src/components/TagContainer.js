import {StyleSheet, View} from 'react-native';
import React from 'react';
import Subtitle from './typography/Subtitle';

export default function TagContainer({text, backgroundColor, textColor}) {
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Subtitle type={1} text={text} color={textColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
});
