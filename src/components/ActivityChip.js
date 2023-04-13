import {StyleSheet} from 'react-native';
import React from 'react';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {View} from 'react-native-animatable';

import Body from './typography/Body';
import Utils from '../utils';
import {RADIUS} from '../constants/Theme';

export default function ActivityChip({style, data, onPress}) {
  const {color, title, icon} = data;

  if (!data) {
    return <View />;
  }

  return (
    <Pressable
      style={[
        styles.affContainer,
        style,
        {backgroundColor: Utils.addAlpha(color, 0.15)},
      ]}
      onPress={() => {
        if (!onPress) {
          return;
        }
        onPress();
        // ReactNativeHapticFeedback.trigger('impactLight');
      }}>
      {icon}
      <Body
        type={1}
        text={title}
        color={color}
        style={{fontWeight: '500', marginLeft: 4, fontSize: 15}}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  affContainer: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
  },
});
