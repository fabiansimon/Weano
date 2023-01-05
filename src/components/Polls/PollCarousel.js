import { StyleSheet, View } from 'react-native';
import React from 'react';
import PagerView from 'react-native-pager-view';
import PollView from './PollView';
import Utils from '../../utils';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function PollCarousel({
  data, style, onLayout,
}) {
  const isEmpty = data.length <= 0;
  return (
    <View style={{ height: isEmpty ? 70 : 250 }} onLayout={onLayout}>
      {!isEmpty ? (
        <PagerView style={{ flex: 1 }}>
          {data.map((poll) => (
            <View>
              <PollView
                style={style}
                data={poll}
                title={poll.title}
                subtitle={Utils.getDateFromTimestamp(poll.createdAt / 1000, 'DD.MM.YYYY • HH:mm')}
              />
            </View>
          ))}
        </PagerView>
      ) : (
        <View style={styles.emptyContainer}>
          <Body
            type={1}
            text={i18n.t('Be the first one to add a poll 📊')}
            color={COLORS.neutral[300]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    marginHorizontal: PADDING.l,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
});
