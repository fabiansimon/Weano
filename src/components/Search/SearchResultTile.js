import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Body from '../typography/Body';
import Utils from '../../utils';

export default function SearchResultTile({style, data, onPress}) {
  const {title, destinations, dateRange} = data;
  const location = destinations[0];
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={{maxWidth: '84%'}}>
        <Body type={1} text={title} />
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
          <Body
            type={2}
            text={`${location?.placeName} ${
              location.placeName.length < 20
                ? `• ${Utils.getDateFromTimestamp(
                    dateRange.endDate,
                    'MM.YYYY',
                  )}`
                : ''
            }`}
            color={COLORS.neutral[300]}
          />
        </View>
      </View>
      <Icon name="chevron-small-right" size={22} color={COLORS.neutral[300]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.shades[0],
    minHeight: 50,
    borderRadius: 8,
    paddingVertical: 8,
    borderColor: COLORS.neutral[100],
    paddingHorizontal: PADDING.s,
  },
  chevronContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[50],
    height: 25,
    width: 25,
  },
});
