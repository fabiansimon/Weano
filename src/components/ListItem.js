import { View } from 'react-native';
import React from 'react';
import Headline from './typography/Headline';

export default function ListItem({
  style, title, trailing, children, omitPadding,
}) {
  return (
    <>
      <View style={[style, { paddingVertical: 12, paddingHorizontal: !omitPadding && 20, marginBottom: 50 }]}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: omitPadding && 20,
        }}
        >
          <Headline
            type={3}
            text={title}
          />
          {trailing}
        </View>
        {children}
      </View>
      {/* <Divider /> */}
      {/* <View style={{ backgroundColor: COLORS.neutral[50], height: 20 }} /> */}
    </>
  );
}
