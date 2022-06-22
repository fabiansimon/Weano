import { View } from 'react-native';
import React from 'react';
import Headline from './typography/Headline';

export default function ListItem({
  style, title, trailing, children,
}) {
  return (
    <View style={style}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Headline type={3} text={title} />
        {trailing}
      </View>
      <View style={{ marginTop: 18, marginBottom: 50 }}>
        {children}
      </View>
    </View>
  );
}
