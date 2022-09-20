import {
  FlatList,
  StyleSheet, View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopUpModal from '../PopUpModal';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import TextField from '../TextField';
import SearchResultTile from './SearchResultTile';
import Subtitle from '../typography/Subtitle';

export default function SearchModal({ isVisible, onRequestClose }) {
  const [searchTerm, setSearchTerm] = useState();

  const mockResults = [
    {
      title: 'Maturareise VBS Gang 🐕',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      latlon: [48.864716, 2.349014],
    },
    {
      title: 'Maturareise VBS Gang 🐕',
      dateRange: {
        startDate: 1690571802,
        endDate: 1658074980,
      },
      latlon: [48.864716, 2.349014],
    },
    {
      title: 'Maturareise VBS Gang 🐕',
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
      latlon: [48.864716, 2.349014],
    },
  ];

  const getResultTile = ({ item }) => (
    <SearchResultTile data={item} />
  );

  return (
    <PopUpModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      style={{ paddingHorizontal: 0, paddingVertical: 0 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Headline
            type={2}
            text={i18n.t('Search')}
          />
          <Icon
            name="close"
            onPress={onRequestClose}
            suppressHighlighting
            color={COLORS.neutral[300]}
            size={22}
          />
        </View>
        <Divider />
        <View style={styles.innerContainer}>
          <TextField
            placeholder={i18n.t('Filter trip')}
            style={{ backgroundColor: COLORS.neutral[50], borderWidth: 0 }}
          />
          <FlatList
            style={{ paddingTop: 20, marginHorizontal: 10 }}
            contentContainerStyle={{ paddingBottom: 60 }}
            data={mockResults}
            renderItem={(item) => getResultTile(item)}
            // eslint-disable-next-line react/no-unstable-nested-components
            ItemSeparatorComponent={() => (
              <Divider
                color={COLORS.neutral[50]}
                vertical={14}
              />
            )}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MatIcon
              color={COLORS.primary[900]}
              style={{ marginLeft: 6, marginRight: 4 }}
              name="clock-time-eight-outline"
              size={16}
            />
            <Subtitle
              type={3}
              color={COLORS.primary[900]}
              text={i18n.t('Last search')}
            />
          </View>
          <Divider
            color={COLORS.neutral[50]}
            vertical={0}
          />
          <SearchResultTile
            style={{ marginHorizontal: 10, marginTop: 5 }}
            data={mockResults[0]}
          />
        </View>
      </View>
    </PopUpModal>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});
