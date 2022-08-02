import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';
import i18n from '../../utils/i18n';

export default function HighlightContainer({ style, description, text }) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={[styles.tile, style]}>
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
      <Headline
        type={1}
        text={text}
        color={COLORS.shades[0]}
        style={{ alignSelf: 'flex-start' }}
      />
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
    borderColor: COLORS.neutral[100],
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    shadowOpacity: 0.05,
  },
});
