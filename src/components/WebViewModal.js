import {MenuView} from '@react-native-menu/menu';
import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  Platform,
  Linking,
  StatusBar,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import i18n from '../utils/i18n';
import BackButton from './BackButton';
import Headline from './typography/Headline';

export default function WebViewModal({isVisible, onRequestClose, url, title}) {
  // STATE && MISC
  const [loadingProgress, setLoadingProgress] = useState(0);
  const webRef = useRef();

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
      useNativeDriver
      onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.header}>
          <BackButton
            closeIcon
            style={{
              marginLeft: PADDING.l,
              marginBottom: Platform.OS === 'android' ? 0 : 10,
            }}
            isClear
            onPress={onRequestClose}
          />
          <View style={{position: 'absolute', width: '100%'}}>
            <Headline
              type={4}
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                marginBottom: 14,
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
          ref={webRef}
          BackButton
          enableApplePay
          allowsLinkPreview
          allowFileAccess
          originWhitelist={['*']}
          source={{uri: url}}
          style={{height: '100%', width: '100%'}}
        />
        <View style={styles.fabButtons}>
          <TouchableHighlight
            underlayColor={COLORS.neutral[100]}
            onPress={() => webRef.current?.goBack()}
            style={styles.arrowContainer}>
            <Icon name="arrow-left" color={COLORS.shades[100]} size={22} />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={COLORS.neutral[100]}
            onPress={() => webRef.current?.goForward()}
            style={styles.arrowContainer}>
            <Icon name="arrow-right" color={COLORS.shades[100]} size={22} />
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 0 : 20,
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
    marginBottom: Platform.OS === 'android' ? 0 : 10,
    width: 40,
  },
  arrowContainer: {
    borderRadius: RADIUS.xl,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButtons: {
    position: 'absolute',
    bottom: 50,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.shades[0],
    padding: 4,
    marginHorizontal: PADDING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: COLORS.neutral[900],
    borderWidth: 2,
    borderColor: COLORS.neutral[100],
    shadowOffset: {},
    shadowRadius: 20,
    shadowOpacity: 0.25,
    elevation: 10,
  },
});
