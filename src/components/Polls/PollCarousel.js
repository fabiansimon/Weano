import {
  FlatList, StyleSheet, View,
} from 'react-native';
import React from 'react';
import PollView from './PollView';
import Utils from '../../utils';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function PollCarousel({
  data, onPress,
}) {
  const isEmpty = data.length <= 0;
  return (
    !isEmpty ? (
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        renderItem={({ item }) => (
          <PollView
            onNavigation={onPress}
            isMinimized
            style={styles.view}
            data={item}
            title={item.title}
            subtitle={Utils.getDateFromTimestamp(item.createdAt / 1000, 'DD.MM.YYYY • HH:mm')}
          />
        )}
      />
    ) : (
      <View style={styles.emptyContainer}>
        <Body
          type={2}
          text={i18n.t('No polls to show ')}
          color={COLORS.neutral[300]}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    marginHorizontal: PADDING.l,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 10,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
  view: {
    width: 300,
    marginLeft: PADDING.l,
    maxHeight: 250,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.m,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
