import React from 'react';
import {
  StyleSheet, View, Modal, SafeAreaView,
} from 'react-native';
import WebView from 'react-native-webview';
import COLORS, { PADDING } from '../constants/Theme';
import BackButton from './BackButton';
import Headline from './typography/Headline';

const WebViewModal = ({
  isVisible, onRequestClose, url, title,
}) => (
  <Modal
    animationType="slide"
    visible={isVisible}
    collapsable
    transparent
    statusBarTranslucent
    useNativeDriver
    onRequestClose={onRequestClose}
  >
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <BackButton style={{ marginLeft: PADDING.l }} isClear onPress={onRequestClose} />
        <View style={{ position: 'absolute', width: '100%' }}>
          <Headline
            type={4}
            style={{ textAlign: 'center', position: 'absolute', alignSelf: 'center' }}
            text={title}
          />
        </View>
      </SafeAreaView>
      <WebView
        originWhitelist={['*']}
        source={{ uri: url }}
        style={{ height: '100%', width: '100%' }}
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: COLORS.shades[0],
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    paddingBottom: 14,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
});

export default WebViewModal;
