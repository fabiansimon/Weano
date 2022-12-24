import {
  View, StyleSheet, Modal, SafeAreaView, Pressable, SectionList, ScrollView, FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../typography/Headline';
import TextField from '../TextField';
import KeyboardView from '../KeyboardView';
import tripsStore from '../../stores/TripsStore';
import SearchResultTile from './SearchResultTile';
import Body from '../typography/Body';
import ROUTES from '../../constants/Routes';

export default function LocationScreen({ isVisible, onRequestClose }) {
  const navigation = useNavigation();

  const [term, setTerm] = useState('');
  const trips = tripsStore((state) => state.trips);
  const [data, setData] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const now = Date.now() / 1000;

  useEffect(() => {
    setData(
      [
        {
          title: i18n.t('Successful trips'),
          data: trips.filter((trip) => trip.dateRange.startDate < now && trip.dateRange.endDate < now),
        },
        {
          title: i18n.t('Upcoming trips'),
          data: trips.filter((trip) => trip.dateRange.startDate > now && trip.dateRange.endDate > now),
        },
      ],
    );
  }, [trips]);

  const handleSearchTerm = (val) => {
    setTerm(val);
  };

  const handleNavigation = (id) => {
    onRequestClose();
    navigation.navigate(ROUTES.tripScreen, { tripId: id });
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
              onPress={onRequestClose}
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
            {term.length >= 1 && (
            <FlatList
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <Headline
                  type={4}
                  color={COLORS.neutral[300]}
                  text={i18n.t('Sorry, there are no results')}
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
