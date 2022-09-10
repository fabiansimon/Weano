import { View } from 'react-native';
import React from 'react';
import PagerView from 'react-native-pager-view';
import AccomodationCard from './AccomodationCard';

export default function AccomodationCarousel({ data, onLayout }) {
  return (
    <View style={{ height: 350 }} onLayout={onLayout}>
      <PagerView style={{ flex: 1 }}>
        {data.map((accom) => (
          <View>
            <AccomodationCard
              data={accom}
              style={{ marginHorizontal: 15 }}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}
