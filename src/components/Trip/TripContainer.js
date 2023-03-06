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
import AccentBubble from './AccentBubble';

export default function TripContainer({
  trip, onLongPress, disabled = true, size, isDense = false, onPress, index,
}) {
  const {
    location, thumbnailUri: uri, dateRange, type, userFreeImages,
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

  const getActions = () => {
    const map = { title: i18n.t('Visit on Map'), systemIcon: 'map' };
    const camera = { title: i18n.t('Capture a memory'), systemIcon: 'camera' };

    return [map, camera];
  };

  const borderColor = getBorderColor();
  const actions = getActions();

  return (
    <ContextMenu
      previewBackgroundColor={COLORS.neutral[50]}
      actions={actions}
      onPress={(e) => onLongPress(e, trip.id)}
      disabled={disabled}
    >
      <Pressable
        style={{ marginRight: 14, maxWidth: width + 6 }}
        onPress={onPress}
      >

        <View style={[styles.outerTripContainer, {
          borderColor, borderRadius: borderRadius + 2, height: height + 6, width: width + 6,
        }]}
        >
          <FastImage
            style={[styles.tripContainer, { height, width, borderRadius }]}
            source={uri ? { uri } : DefaultImage}
          />
          {userFreeImages > 0 && (
          <AccentBubble
            style={{ position: 'absolute', right: 0, bottom: 0 }}
            text={userFreeImages}
          />
          )}
        </View>
        {!isDense && (
        <>
          <Body
            numberOfLines={2}
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
