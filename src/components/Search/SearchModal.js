import {
  Modal, StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import BasicHeader from '../BasicHeader';
import i18n from '../../utils/i18n';
import TextField from '../TextField';
import Divider from '../Divider';
import COLORS from '../../constants/Theme';
import SearchResultTile from './SearchResultTile';

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
    <Modal
      animationType="slide"
      visible={isVisible}
      useNativeDriver
    >
      <BasicHeader
        title={i18n.t('Search')}
        onPressBack={onRequestClose}
        style={{ marginTop: 80 }}
      >
        <TextField
          style={styles.textField}
          focusable={false}
          placeholder={i18n.t('Barcelona 2021 🇪🇸')}
          value={searchTerm || null}
          onChangeText={(val) => setSearchTerm(val)}
          onDelete={() => setSearchTerm('')}
        />
      </BasicHeader>
      <FlatList
        style={{ paddingTop: 15, paddingBottom: 50, marginHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        data={mockResults}
        renderItem={(item) => getResultTile(item)}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <Divider color={COLORS.neutral[50]} vertical={15} />}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  textField: {
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOpacity: 0,
    backgroundColor: COLORS.neutral[50],
  },
});
