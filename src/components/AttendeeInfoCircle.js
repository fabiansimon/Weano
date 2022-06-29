import { StyleSheet, View } from 'react-native';
import React from 'react';
// import Icon from 'react-native-vector-icons/AntDesign';
// import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function AttendeeInfoCircle({ status }) {
//   const name = status === 2 ? 'close' : status === 1 ? 'check' : 'question';
//   const backgroundColor = status === 2 ? COLORS.error[100] : status === 1 ? COLORS.success[100] : COLORS.warning[100];
//   const color = status === 2 ? COLORS.error[700] : status === 1 ? COLORS.success[700] : COLORS.warning[700];
  const item = status === 2 ? '👎' : status === 1 ? '👍' : '💭';

  return (
    <View style={[styles.container]}>
      {/* <Icon name={name} color={color} size={22} /> */}
      <Headline type={2} text={item} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
