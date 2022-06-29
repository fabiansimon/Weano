import { View } from 'react-native';
import React from 'react';
import PagerView from 'react-native-pager-view';
import AccomodationCard from './AccomodationCard';

export default function AccomodationCarousel({ data }) {
  return (
    <View style={{ height: 350 }}>
      <PagerView style={{ flex: 1 }}>
        {data.map((accom) => (
          <View>
            <AccomodationCard data={accom} />
          </View>
        ))}
      </PagerView>
    </View>
  );
}
