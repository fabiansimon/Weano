import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {RADIUS} from '../constants/Theme';
import Body from './typography/Body';
import Headline from './typography/Headline';
import Utils from '../utils';

export default function CategoryChip({
  style,
  onPress,
  string,
  color,
  disabled,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        style,
        {backgroundColor: Utils.addAlpha(color, 0.2)},
      ]}>
      <Body
        type={2}
        style={{fontWeight: '600', marginLeft: 6, marginRight: 4}}
        text={'#'}
        color={color}
      />
      <Body
        type={2}
        style={{marginRight: 6, fontWeight: '500'}}
        color={color}
        text={string}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: RADIUS.xl,
    height: 35,
  },
});
