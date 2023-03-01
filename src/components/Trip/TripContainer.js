import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import ContextMenu from 'react-native-context-menu-view';
import Utils from '../../utils';
import DefaultImage from '../../../assets/images/default_trip.png';
import Body from '../typography/Body';
import Label from '../typography/Label';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';

export default function TripContainer({
  trip, onLongPress, disabled = true, size, isDense = false, onPress,
}) {
  const {
    location, thumbnailUri: uri, dateRange, type,
  } = trip;

  const height = size || 62;
  const width = size || 62;
  const borderRadius = size < 55 ? 16 : 20;

  const getBorderColor = () => {
    if (type === 'active') {
      return COLORS.error[700];
    }

    if (type === 'soon' || type === 'upcoming') {
      return COLORS.success[700];
    }

    return COLORS.primary[500];
  };

  const borderColor = getBorderColor();

  return (
    <ContextMenu
      previewBackgroundColor={COLORS.neutral[50]}
      actions={[{ title: i18n.t('Visit on Map'), systemIcon: 'map' }]}
      onPress={(e) => onLongPress(e, trip.id)}
      disabled={disabled}
    >
      <Pressable
        style={{ marginRight: 14 }}
        onPress={onPress}
      >
        <View style={[styles.outerTripContainer, { borderColor, borderRadius: borderRadius + 2 }]}>
          <FastImage
            style={[styles.tripContainer, { height, width, borderRadius }]}
            source={uri ? { uri } : DefaultImage}
          />
        </View>
        {!isDense && (
        <>
          <Body
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginTop: 6, marginBottom: -2, textAlign: 'center' }}
            type={2}
            text={location.placeName.split(',')[0]}
          />
          <Label
            style={{ textAlign: 'center' }}
            type={1}
            color={COLORS.neutral[300]}
            text={Utils.getDateFromTimestamp(dateRange.startDate, 'YYYY')}
          />
        </>
        )}
      </Pressable>
    </ContextMenu>
  );
}

const styles = StyleSheet.create({
  outerTripContainer: {
    borderWidth: 1.5,
    backgroundColor: COLORS.neutral[50],
    padding: 1.5,
  },
  tripContainer: {
    backgroundColor: COLORS.shades[0],
  },

});
