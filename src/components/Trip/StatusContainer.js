import {
  Image, StyleSheet, View,
} from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import StatusDoneIcon from '../../../assets/icons/status_check.png';
import StatusNotDoneIcon from '../../../assets/icons/status_check_false.png';
import Headline from '../typography/Headline';

export default function StatusContainer({ style, data }) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={data.isDone ? StatusDoneIcon : StatusNotDoneIcon}
        style={{
          height: 30, width: 30, marginBottom: 10, marginTop: 6,
        }}
      />
      <Headline
        type={4}
        color={data.isDone ? COLORS.primary[700] : COLORS.neutral[300]}
        style={{ fontWeight: '500', fontSize: 16 }}
        text={data.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: 90,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
