import {
  View, StyleSheet, Modal, SafeAreaView, Pressable, SectionList, ScrollView, FlatList,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../typography/Headline';
import TextField from '../TextField';
import KeyboardView from '../KeyboardView';
import tripsStore from '../../stores/TripsStore';
import SearchResultTile from './SearchResultTile';
import Body from '../typography/Body';
import REGEX from '../../constants/Regex';

export default function LocationScreen({ isVisible, onRequestClose, onPress }) {
  const [term, setTerm] = useState('');
  const trips = tripsStore((state) => state.trips);
  const [searchResult, setSearchResult] = useState([]);

  const now = Date.now() / 1000;

  const data = [
    {
      title: i18n.t('Successful trips'),
      data: trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate < now),
    },
    {
      title: i18n.t('Upcoming trips'),
      data: trips.filter((trip) => trip.dateRange.startDate > now && trip.dateRange.endDate > now),
    },
  ];

  const handleSearchTerm = (val) => {
    setTerm(val);
    const formattedTerm = val.replace(REGEX.rawLetters, '').toLowerCase();

    if (formattedTerm.length <= 0) {
      return;
    }

    let results = [];
    results = trips.filter((trip) => {
      const formattedTrip = {
        title: trip.title.replace(REGEX.rawLetters, '').toLowerCase(),
        description: trip.description.replace(REGEX.rawLetters, '').toLowerCase(),
        placeName: trip.location.placeName.replace(REGEX.rawLetters, '').toLowerCase(),
      };

      if (formattedTrip.title.includes(formattedTerm) || formattedTrip.description.includes(formattedTerm) || formattedTrip.placeName.includes(formattedTerm)) {
        return trip;
      }

      return null;
    });

    setSearchResult(results);
  };

  const handleNavigation = (id) => {
    onRequestClose();
    onPress(id);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}
    >
      <KeyboardView>
        <View style={styles.container}>
          <SafeAreaView style={styles.header}>
            <Pressable
              onPress={() => {
                setSearchResult([]);
                setTerm('');
                onRequestClose();
              }}
              style={{
                width: 50, height: 50, justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Icon
                name="close"
                size={22}
              />
            </Pressable>
            <Headline type={3} text={i18n.t('Search')} />
            <View style={{ width: 50 }} />
          </SafeAreaView>
          <ScrollView style={{ marginHorizontal: PADDING.m }}>
            <TextField
              style={{ marginVertical: 10 }}
              value={term || null}
              onChangeText={(val) => handleSearchTerm(val)}
              onDelete={() => handleSearchTerm('')}
              placeholder={i18n.t('Filter Trip')}
            />
            {term.length < 1 && (
            <SectionList
              scrollEnabled={false}
              sections={data}
              renderSectionHeader={({ section: { title, data: sectionData } }) => (
                sectionData.length >= 1 && (
                <Body
                  type={2}
                  color={COLORS.neutral[300]}
                  text={title}
                  style={{ marginVertical: 10, marginLeft: 4 }}
                />
                )
              )}
              renderItem={({ item }) => (
                <SearchResultTile
                  onPress={() => handleNavigation(item.id)}
                  data={item}
                  style={{ marginBottom: 10 }}
                />
              )}
            />
            )}
            {term.length >= 1 && (
            <FlatList
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <Body
                  type={1}
                  color={COLORS.neutral[300]}
                  text={i18n.t('Sorry, there are no results')}
                  style={{ textAlign: 'center', marginTop: 10 }}
                />
              )}
              data={searchResult}
              renderSectionHeader={({ section: { title } }) => (
                <Body
                  type={2}
                  color={COLORS.neutral[300]}
                  text={title}
                  style={{ marginVertical: 10, marginLeft: 4 }}
                />
              )}
              renderItem={({ item }) => (
                <SearchResultTile
                  onPress={() => handleNavigation(item.id)}
                  data={item}
                  style={{ marginBottom: 10 }}
                />
              )}
            />
            )}
          </ScrollView>
        </View>
      </KeyboardView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: PADDING.s,
    paddingTop: 15,
    paddingBottom: 36,
  },
  header: {
    paddingHorizontal: PADDING.s,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
