import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import Utils from '../utils';
import COLORS from '../constants/Theme';

export default function LoadingModal({isLoading}) {
  return (
    <Modal
      animationType="none"
      presentationStyle="overFullScreen"
      visible={isLoading}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent>
      <View style={styles.container}>
        <ActivityIndicator color={COLORS.shades[0]} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Utils.addAlpha(COLORS.neutral[900], 0.5),
  },
});
