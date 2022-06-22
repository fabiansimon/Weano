import { ScrollView, View } from 'react-native';
import React from 'react';
import TabIndicator from '../TabIndicator';

export default function TabBar({
  style, items, onPress, currentTab,
}) {
  return (
    <View style={style}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <TabIndicator
            style={{ marginLeft: index === 0 ? 10 : 14 }}
            key={item.name}
            text={item.title}
            onPress={() => onPress(index)}
            isActive={currentTab === index}
          />
        ))}
      </ScrollView>
    </View>
  );
}
