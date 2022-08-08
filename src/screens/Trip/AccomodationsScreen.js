import { View, StyleSheet, FlatList } from 'react-native';
import React, { useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import AccomodationCard from '../../components/Trip/AccomodationCard';
import FilterOption from '../../components/FilterOption';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';

export default function AccomodationsScreen({ route }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { data } = route.params;

  const options = [
    {
      title: 'Price',
      options: [
        {
          name: 'Low-to-High',
          value: 'lowToHigh',
        },
        {
          name: 'High-to-Low',
          value: 'HighToLow',
        },
      ],
    },
    {
      title: 'Price',
      options: [
        {
          name: 'Low-to-High',
          value: 'lowToHigh',
        },
        {
          name: 'High-to-Low',
          value: 'HighToLow',
        },
      ],
    },
    {
      title: 'Price',
      options: [
        {
          name: 'Low-to-High',
          value: 'lowToHigh',
        },
        {
          name: 'High-to-Low',
          value: 'HighToLow',
        },
      ],
    },
  ];

  const getCard = ({ item }) => (
    <AccomodationCard data={item} />
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find Accomodation')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
        content={(
          <ScrollView horizontal style={styles.filterCarousel}>
            {options.map((option) => (
              <FilterOption
                data={option}
                style={{ marginRight: 8 }}
              />
            ))}
          </ScrollView>
      )}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 20, paddingBottom: 50, marginHorizontal: 15 }}
          contentContainerStyle={{ paddingBottom: 60 }}
          data={data}
          renderItem={(item) => getCard(item)}
        // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        />
      </HybridHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  footer: {
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 10,
    width: '100%',
  },
  filterCarousel: {
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
