import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import COLORS from './Theme';

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: COLORS.success[700] }}
      text1Style={{
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        letterSpacing: -0.5,
        fontWeight: '600',
        color: COLORS.neutral[900],
      }}
      text2Style={{
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        letterSpacing: -0.5,
        fontWeight: '400',
        color: COLORS.neutral[300],
      }}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: COLORS.warning[700] }}
      text1Style={{
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        letterSpacing: -0.5,
        fontWeight: '600',
        color: COLORS.neutral[900],
      }}
      text2Style={{
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        letterSpacing: -0.5,
        fontWeight: '400',
        color: COLORS.neutral[300],
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: COLORS.error[900] }}
      text1Style={{
        fontFamily: 'WorkSans-Regular',
        fontSize: 18,
        letterSpacing: -0.5,
        fontWeight: '600',
        color: COLORS.neutral[900],
      }}
      text2Style={{
        fontFamily: 'WorkSans-Regular',
        fontSize: 14,
        letterSpacing: -0.5,
        fontWeight: '400',
        color: COLORS.neutral[300],
      }}
    />
  ),
};

export default toastConfig;
