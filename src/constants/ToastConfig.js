import React from 'react';
import {BaseToast, ErrorToast} from 'react-native-toast-message';
import COLORS, {RADIUS} from './Theme';
import {Platform, StyleSheet} from 'react-native';
import Utils from '../utils';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={[
        styles.container,
        {
          borderColor: COLORS.success[500],
          borderLeftColor: COLORS.success[500],
          backgroundColor: COLORS.success[700],
        },
      ]}
      text1Style={styles.textOne}
      text2Style={styles.textTwo}
      text2NumberOfLines={2}
    />
  ),
  warning: props => (
    <BaseToast
      {...props}
      style={[
        styles.container,
        {
          borderColor: COLORS.warning[500],
          borderLeftColor: COLORS.warning[500],
          backgroundColor: COLORS.warning[700],
        },
      ]}
      text1Style={styles.textOne}
      text2Style={styles.textTwo}
      text2NumberOfLines={2}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={[
        styles.container,
        {
          borderColor: COLORS.error[500],
          borderLeftColor: COLORS.error[500],
          backgroundColor: COLORS.error[700],
        },
      ]}
      text1Style={styles.textOne}
      text2Style={styles.textTwo}
      text2NumberOfLines={2}
    />
  ),
};

const styles = StyleSheet.create({
  textOne: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: Platform.OS === 'android' ? '700' : '600',
    color: COLORS.shades[0],
  },
  textTwo: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    letterSpacing: -0.5,
    fontWeight: '400',
    color: COLORS.shades[0],
  },
  container: {
    minHeight: 70,
    borderRadius: RADIUS.s,
    borderLeftWidth: 2,
    borderWidth: 2,
  },
});

export default toastConfig;
