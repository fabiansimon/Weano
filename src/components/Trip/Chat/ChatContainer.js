import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import COLORS from '../../../constants/Theme';

export default function ChatContainer() {
  return (
    <View style={styles.container}>
      <Text>ChatContainer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
});
