import {Pressable, View} from 'react-native';
import React from 'react';
import Headline from './typography/Headline';

export default function ListItem({
  style,
  title,
  trailing,
  children,
  omitPadding,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        style,
        {
          paddingVertical: 12,
          paddingHorizontal: !omitPadding ? 20 : 0,
          marginBottom: 50,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingHorizontal: omitPadding ? 20 : 0,
        }}>
        <Headline style={{fontWeight: '500'}} type={4} text={title} />
        {trailing}
      </View>
      {children}
    </Pressable>
  );
}
