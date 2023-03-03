import {
  FlatList, StyleSheet,
} from 'react-native';
import React from 'react';
import PollView from './PollView';
import Utils from '../../utils';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import EmptyDataContainer from '../EmptyDataContainer';
import ROUTES from '../../constants/Routes';

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
      <EmptyDataContainer
        style={{ marginTop: -6 }}
        title={i18n.t('No polls to show yet!')}
        subtitle={i18n.t('Be the first one to add one.')}
        route={ROUTES.pollScreen}
      />
    )
  );
}

const styles = StyleSheet.create({
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
