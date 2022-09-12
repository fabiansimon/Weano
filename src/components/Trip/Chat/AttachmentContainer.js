import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS, { RADIUS } from '../../../constants/Theme';
import Body from '../../typography/Body';

export default function AttachmentContainer({ style, data, onPress }) {
  const icon = React.cloneElement(data.icon, {
    color: COLORS.shades[0],
    size: 20,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[style, styles.container]}
    >
      {icon}
      <Body
        style={{ marginLeft: 8, lineHeight: 0 }}
        type={1}
        text={data.string}
        color={COLORS.shades[0]}
      />

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
