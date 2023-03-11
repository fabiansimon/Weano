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
import Utils from '../../utils';

export default function LocationScreen({ isVisible, onRequestClose, onPress }) {
  // STORES
  const trips = tripsStore((state) => state.trips);

  // STATE & MISC
  const [term, setTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const now = Date.now() / 1000;

  const data = [
    {
      title: i18n.t('Active trips'),
      data: trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate > now),
      type: 'active',
    },
    {
      title: i18n.t('Recent trips'),
      data: trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate < now),
      type: 'recent',
    },
    {
      title: i18n.t('Upcoming trips'),
      data: trips.filter((trip) => trip.dateRange.startDate > now && trip.dateRange.endDate > now),
      type: 'upcoming',
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
        placeName: trip.destinations[0].placeName.replace(REGEX.rawLetters, '').toLowerCase(),
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
      <KeyboardView paddingBottom={0}>
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
                color={COLORS.shades[100]}
                name="close"
                size={22}
              />
            </Pressable>
            <Headline type={3} text={i18n.t('Search')} />
            <View style={{ width: 50 }} />
          </SafeAreaView>
          <TextField
            style={{ marginTop: 10, marginHorizontal: PADDING.m }}
            value={term || null}
            onChangeText={(val) => handleSearchTerm(val)}
            onDelete={() => handleSearchTerm('')}
            placeholder={i18n.t('Filter Trip')}
          />
          <ScrollView style={{ marginHorizontal: PADDING.m, paddingTop: 10 }}>
            {term.length < 1 && (
            <SectionList
              scrollEnabled={false}
              sections={data}
              renderSectionHeader={({ section: { title, data: sectionData, type } }) => {
                const color = type === 'active' ? COLORS.error[700] : type === 'upcoming' ? COLORS.success[700] : COLORS.primary[700];
                if (sectionData.length >= 1) {
                  return (
                    <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(color, 0.2) }]}>
                      <Body
                        type={2}
                        color={color}
                        style={{ fontWeight: '500' }}
                        text={title}
                      />
                    </View>
                  );
                }
              }}
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
              <>
                <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(COLORS.neutral[500], 0.2) }]}>
                  <Body
                    type={2}
                    color={COLORS.neutral[700]}
                    style={{ fontWeight: '500' }}
                    text={`${i18n.t('Results for')} "${term}"`}
                  />
                </View>
                <FlatList
                  scrollEnabled={false}
                  ListEmptyComponent={() => (
                    <Body
                      type={2}
                      color={COLORS.neutral[300]}
                      text={i18n.t('Sorry, there are no results 🫤')}
                      style={{ textAlign: 'center', marginTop: 10 }}
                    />
                  )}
                  data={searchResult}
                  renderItem={({ item }) => (
                    <SearchResultTile
                      onPress={() => handleNavigation(item.id)}
                      data={item}
                      style={{ marginBottom: 10 }}
                    />
                  )}
                />
              </>
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
  header: {
    paddingHorizontal: PADDING.s,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginRight: 'auto',
    paddingVertical: 4,
    marginLeft: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 4,
  },
});
