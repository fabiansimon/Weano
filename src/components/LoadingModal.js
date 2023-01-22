import {
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import React, { } from 'react';

export default function LoadingModal({
  isLoading,
}) {
  return (
    <Modal
      animationType="none"
      presentationStyle="overFullScreen"
      visible={isLoading}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
    >
      <View style={styles.container} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
