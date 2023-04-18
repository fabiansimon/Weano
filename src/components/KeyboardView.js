import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

export default function KeyboardView({
  style,
  children,
  ignoreTouch = false,
  paddingBottom = 20,
  behavior = 'height',
}) {
  if (ignoreTouch) {
    return (
      <KeyboardAvoidingView
        behavior={behavior}
        style={[style, {flex: 1, backgroundColor: 'transparent'}]}
        keyboardVerticalOffset={Platform.select({
          ios: paddingBottom,
          android: paddingBottom,
        })}>
        {children}
      </KeyboardAvoidingView>
    );
  }

  console.log('caleld');
  return (
    <TouchableWithoutFeedback
      style={[style, {flex: 1}]}
      onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={behavior}
        style={[{flex: 1, backgroundColor: 'transparent'}]}
        keyboardVerticalOffset={Platform.select({
          ios: paddingBottom,
          android: paddingBottom,
        })}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
