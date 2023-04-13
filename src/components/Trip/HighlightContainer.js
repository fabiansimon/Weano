import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';
import i18n from '../../utils/i18n';

export default function HighlightContainer({
  style,
  description,
  text,
  onPress,
  onBottom = true,
}) {
  if (onBottom) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={styles.bottomContainer}>
        <SafeAreaView edges={['bottom']}>
          <View style={[styles.tile, style]}>
            <View>
              <Body type={1} text={description} color={COLORS.shades[0]} />
              <Headline
                type={3}
                text={text}
                color={COLORS.shades[0]}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{alignSelf: 'flex-start'}}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Body type={2} text={i18n.t('set by')} color={COLORS.shades[0]} />
              <RoleChip isHost style={{marginLeft: 6}} />
            </View>
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.tile, style]}>
      <View>
        <Headline type={4} text={description} color={COLORS.shades[0]} />
        <Headline
          type={2}
          text={text}
          color={COLORS.shades[0]}
          style={{alignSelf: 'flex-start'}}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Body type={2} text={i18n.t('set by')} color={COLORS.shades[0]} />
        <RoleChip isHost style={{marginLeft: 6}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: RADIUS.m,
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
  bottomContainer: {
    borderRadius: RADIUS.m,
    paddingTop: 6,
    width: '100%',
    paddingHorizontal: PADDING.m,
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.primary[700],
  },
});
