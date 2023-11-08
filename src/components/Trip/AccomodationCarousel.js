import { View } from 'react-native';
import React from 'react';
import PagerView from 'react-native-pager-view';
import PollView from '../Polls/PollView';
import Utils from '../../utils';

export default function AccomodationCarousel({ data, onLayout }) {
  return (
    <View onLayout={onLayout}>
      <PagerView style={{ flex: 1 }}>
        {data.map((poll) => (
          <View>
            <PollView
              data={poll}
              title={poll.title}
              subtitle={Utils.getDateFromTimestamp(poll.createdAt / 1000, 'DD.MM.YYYY • HH:mm')}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}