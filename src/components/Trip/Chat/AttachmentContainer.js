import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS, { RADIUS } from '../../../constants/Theme';
import Subtitle from '../../typography/Subtitle';

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
      <View style={styles.iconBubble}>
        {icon}
      </View>
      <View style={{ width: 60 }}>
        <Subtitle
          style={{ marginTop: 6, textAlign: 'center' }}
          type={1}
          text={data.string}
          color={COLORS.shades[0]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconBubble: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
