import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';
import i18n from '../../utils/i18n';
import Button from '../Button';

export default function HighlightContainer({
  style, description, text, onPress, onButtonPress, buttonText, buttonIcon,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.tile, style]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Headline
          type={3}
          text={description}
          color={COLORS.shades[0]}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Body
            type={2}
            text={i18n.t('set by')}
            color={COLORS.shades[0]}
          />
          <RoleChip isHost style={{ marginLeft: 6 }} />
        </View>
      </View>
      {text ? (
        <Headline
          type={1}
          text={text}
          color={COLORS.shades[0]}
          style={{ alignSelf: 'flex-start' }}
        />
      ) : (
        <Button
          onPress={onButtonPress}
          text={buttonText}
          fullWidth={false}
          icon={(
            <AntIcon
              name={buttonIcon}
              size={22}
              color={COLORS.shades[0]}
            />
            )}
          textColor={COLORS.shades[0]}
          style={styles.addButton}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.primary[700],
    justifyContent: 'space-between',
    borderRadius: 14,
    alignItems: 'center',
  },
  addButton: {
    borderColor: COLORS.shades[0],
    borderWidth: 1,
    height: 40,
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
  },
});
