import {StyleSheet, TouchableHighlight} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';

export default function TrailContainer({style, text, icon, onPress}) {
  const getIcon = () =>
    typeof icon.type === 'function' ? (
      React.cloneElement(icon, {fill: COLORS.shades[100]})
    ) : (
      <Icon name={icon} color={COLORS.shades[100]} size={16} />
    );

  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={COLORS.neutral[300]}
      style={[styles.container, style]}>
      <>
        <Body type={1} text={text} style={{marginRight: icon && 4}} />
        {icon && getIcon()}
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
});
