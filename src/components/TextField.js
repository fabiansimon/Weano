/* eslint-disable react/jsx-props-no-spreading */
import {
  TextInput, StyleSheet, TouchableOpacity, View, FlatList, Pressable, ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import EntIcon from 'react-native-vector-icons/Entypo';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import Divider from './Divider';
import Body from './typography/Body';
import i18n from '../utils/i18n';

export default function TextField({
  value,
  onChangeText,
  style,
  prefix,
  onPrefixPress,
  onDelete,
  placeholder,
  keyboardType,
  focusable = true,
  showTrailingIcon = true,
  icon,
  onPress,
  iconColor,
  disabled,
  ref,
  suggestions,
  onSuggestionPress,
  suggestionLoading,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);

  useEffect(() => {
    setSuggestionData(suggestions);
  }, [suggestions]);

  const getIcon = () => (icon && typeof icon.type === 'function' ? (
    React.cloneElement(icon, { fill: iconColor })
  ) : (
    <Icon name={icon} color={iconColor || COLORS.neutral[700]} size={20} />
  ));

  const SuggestionTile = ({ item }) => (
    <Pressable
      onPress={() => onSuggestionPress(item)}
      style={styles.suggestionTile}
    >
      <EntIcon
        name="location-pin"
        color={COLORS.neutral[300]}
        size={20}
        style={{ marginRight: 6 }}
      />
      <Body
        type={1}
        color={COLORS.neutral[700]}
        text={item.string}
      />
    </Pressable>
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.container, focused ? styles.activeContainer : styles.inactiveContainer, style]}
        onPress={onPress}
        disabled={!onPress}
      >
        {prefix && (
        <TouchableOpacity
          onPress={onPrefixPress}
          style={styles.prefixContainer}
        >
          <Headline
            type={4}
            text={`+ ${prefix}`}
            color={COLORS.neutral[700]}
          />
        </TouchableOpacity>
        )}
        <TextInput
          {...rest}
          ref={ref}
          onPressIn={onPress || null}
          editable={!disabled}
          keyboardType={keyboardType}
          onFocus={() => focusable && setFocused(true)}
          style={styles.textInput}
          value={value || null}
          onChangeText={(val) => onChangeText(val)}
          placeholder={prefix ? `+${prefix} ${placeholder}` : placeholder}
          placeholderTextColor={COLORS.neutral[300]}
        />
        {icon && (
        <TouchableOpacity
          onPress={onPrefixPress}
          style={styles.trailingContainer}
        >
          {getIcon()}
        </TouchableOpacity>
        )}
        {value && !disabled && showTrailingIcon && (
        <Icon
          name="closecircle"
          suppressHighlighting
          onPress={onDelete}
          size={18}
          color={COLORS.neutral[500]}
          style={styles.deleteIcon}
        />
        )}
      </TouchableOpacity>
      {(suggestions || suggestionLoading) && (
      <View style={styles.suggestionsContainer}>
        {suggestionLoading ? (
          <ActivityIndicator
            style={{ marginVertical: 16 }}
            color={COLORS.neutral[300]}
          />
        )
          : (
            <FlatList
              ListEmptyComponent={() => (
                <Body
                  style={{ textAlign: 'center', marginVertical: 16 }}
                  text={i18n.t('No results')}
                  color={COLORS.neutral[300]}
                />
              )}
              data={suggestionData}
              ItemSeparatorComponent={() => (
                <Divider
                  omitPadding
                  color={COLORS.neutral[50]}
                />
              )}
              renderItem={({ item }) => <SuggestionTile item={item} />}
            />
          )}
      </View>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.m,
    shadowColor: COLORS.shades[100],
    borderWidth: 1,
  },
  inactiveContainer: {
    borderColor: COLORS.neutral[100],
  },
  activeContainer: {
    borderColor: COLORS.neutral[700],
  },
  deleteIcon: {
    position: 'absolute',
    right: 15,
  },
  prefixContainer: {
    paddingHorizontal: 15,
    borderRightColor: COLORS.neutral[100],
    borderRightWidth: 1,
    height: '100%',
    justifyContent: 'center',
  },
  trailingContainer: {
    paddingHorizontal: 25,
    borderLeftColor: COLORS.neutral[100],
    borderLeftWidth: 1,
    height: '100%',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -1.0,
    paddingHorizontal: 12,
  },
  suggestionsContainer: {
    top: -10,
    backgroundColor: COLORS.shades[0],
    shadowColor: COLORS.neutral[500],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    shadowOpacity: 0.05,
    shadowOffset: {
      y: 0,
      x: 0,
    },
  },
  suggestionTile: {
    height: 55,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: PADDING.m,
  },
});
