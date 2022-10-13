import {
  Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

export default function KeyboardView({
  style,
  children,
  ignoreTouch = false,
  paddingBottom = 0,
}) {
  if (ignoreTouch) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[style, { flex: 1 }]}
        keyboardVerticalOffset={Platform.select({ ios: paddingBottom, android: 500 })}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <TouchableWithoutFeedback
      style={[style, { flex: 1 }]}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[style, { flex: 1 }]}
        keyboardVerticalOffset={Platform.select({ ios: paddingBottom, android: 500 })}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
