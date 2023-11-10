import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import COLORS, {RADIUS} from '../constants/Theme';
import Headline from './typography/Headline';
import toastConfig from '../constants/ToastConfig';

export default function TitleModal({
  isVisible,
  onRequestClose,
  title,
  children,
  actionLabel,
  onPress,
  isLoading,
  isDisabled,
}) {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={onRequestClose}
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View
            style={{
              position: 'absolute',
              width: Dimensions.get('window').width,
            }}>
            <Headline type={4} text={title} style={{alignSelf: 'center'}} />
          </View>
          <TouchableOpacity hitSlop={20} onPress={onRequestClose}>
            <Icon name="close" color={COLORS.shades[100]} size={20} />
          </TouchableOpacity>
          {actionLabel && (
            <TouchableOpacity disabled={isDisabled} onPress={onPress}>
              {isLoading ? (
                <ActivityIndicator
                  color={COLORS.neutral[300]}
                  style={{marginRight: 5}}
                />
              ) : (
                <Headline
                  type={4}
                  style={{fontWeight: '500'}}
                  color={
                    isLoading || isDisabled
                      ? COLORS.neutral[300]
                      : COLORS.primary[500]
                  }
                  text={actionLabel}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        {children}
      </View>
      <Toast config={toastConfig} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 60,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
