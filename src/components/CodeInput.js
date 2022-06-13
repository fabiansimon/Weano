import { StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
import {
  CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import COLORS from '../constants/Theme';

export default function CodeInput({ cellCount }) {
  const CELL_COUNT = cellCount || 4;

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <CodeField
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 55,
    paddingTop: 8,
    height: 60,
    borderRadius: 10,
    fontSize: 34,
    borderWidth: 1,
    borderColor: COLORS.neutral[300],
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.neutral[900],
    fontFamily: 'WorkSans-Regular',
  },
  focusCell: {
    borderColor: COLORS.neutral[900],
    borderWidth: 1,
  },
});
