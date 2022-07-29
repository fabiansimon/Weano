import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import COLORS from '../../constants/Theme';
import BasicHeader from '../../components/BasicHeader';
import i18n from '../../utils/i18n';
import AccomodationCard from '../../components/Trip/AccomodationCard';
import FilterOption from '../../components/FilterOption';

export default function AccomodationsScreen({ route }) {
  const { data } = route.params;

  const options = [
    {
      title: 'Price',
      options: ['Low-to-High', 'High-to-Low'],
    },
    {
      title: 'Platform',
      options: ['Low-to-High', 'High-to-Low'],
    },
    {
      title: 'Popularity',
      options: ['Low-to-High', 'High-to-Low'],
    },
  ];

  const getCard = ({ item }) => (
    <AccomodationCard data={item} />
  );

  return (
    <View style={styles.container}>
      <BasicHeader title={i18n.t('Accomodations 🏠')}>
        <ScrollView horizontal style={styles.filterCarousel}>
          {options.map((option) => <FilterOption data={option} style={{ marginRight: 8 }} />)}
        </ScrollView>
      </BasicHeader>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20, paddingBottom: 50 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        data={data}
        renderItem={(item) => getCard(item)}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
      />
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
