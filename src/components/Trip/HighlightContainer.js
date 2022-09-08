import { StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';
import i18n from '../../utils/i18n';

export default function HighlightContainer({
  style, description, text,
}) {
  return (
    <View
      style={[styles.tile, style]}
    >
      <View>
        <Headline
          type={4}
          text={description}
          color={COLORS.shades[0]}
        />
        <Headline
          type={2}
          text={text}
          color={COLORS.shades[0]}
          style={{ alignSelf: 'flex-start' }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Body
          type={2}
          text={i18n.t('set by')}
          color={COLORS.shades[0]}
        />
        <RoleChip isHost style={{ marginLeft: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 14,
    paddingBottom: 12,
    borderRadius: 14,
    height: 86,
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
