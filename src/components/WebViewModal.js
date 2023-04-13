import {MenuView} from '@react-native-menu/menu';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  Platform,
  Linking,
  StatusBar,
} from 'react-native';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import COLORS, {PADDING} from '../constants/Theme';
import i18n from '../utils/i18n';
import BackButton from './BackButton';
import Headline from './typography/Headline';

export default function WebViewModal({isVisible, onRequestClose, url, title}) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleMenuOption = ({event}) => {
    if (event === 'browser') {
      return Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
    if (event === 'copy') {
      return Clipboard.setString(url);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      collapsable
      transparent
      statusBarTranslucent
      useNativeDriver
      onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.header}>
          <BackButton
            closeIcon
            style={{marginLeft: PADDING.l}}
            isClear
            onPress={onRequestClose}
          />
          <View style={{position: 'absolute', width: '100%'}}>
            <Headline
              type={4}
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                marginBottom: 10,
              }}
              text={title}
            />
          </View>
          <MenuView
            style={styles.moreIcon}
            onPressAction={({nativeEvent}) => handleMenuOption(nativeEvent)}
            actions={[
              {
                id: 'browser',
                title: i18n.t('Open in system browser'),
                image: Platform.select({
                  ios: 'safari',
                  android: 'browser',
                }),
              },
              {
                id: 'copy',
                title: i18n.t('Copy link'),
              },
            ]}>
            <Icon name="more-horizontal" size={22} color={COLORS.shades[100]} />
          </MenuView>
        </SafeAreaView>
        {loadingProgress < 1 && (
          <View
            style={{
              height: 3,
              backgroundColor: COLORS.primary[700],
              width: `${loadingProgress * 100}%`,
            }}
          />
        )}
        <WebView
          onLoadProgress={({nativeEvent}) => {
            setLoadingProgress(nativeEvent.progress);
          }}
          enableApplePay
          allowsLinkPreview
          allowFileAccess
          originWhitelist={['*']}
          source={{uri: url}}
          style={{height: '100%', width: '100%'}}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: COLORS.shades[0],
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 70,
    paddingBottom: 14,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
  moreIcon: {
    width: 40,
  },
});
