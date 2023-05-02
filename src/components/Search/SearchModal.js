import {
  View,
  StyleSheet,
  Modal,
  SafeAreaView,
  Pressable,
  SectionList,
  ScrollView,
  FlatList,
  Platform,
  NativeModules,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, {PADDING} from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../typography/Headline';
import TextField from '../TextField';
import KeyboardView from '../KeyboardView';
import tripsStore from '../../stores/TripsStore';
import SearchResultTile from './SearchResultTile';
import Body from '../typography/Body';
import REGEX from '../../constants/Regex';
import Utils from '../../utils';
import EmptyDataContainer from '../EmptyDataContainer';

const {StatusBarManager} = NativeModules;

export default function SearchModal({isVisible, onRequestClose, onPress}) {
  // STORES
  const trips = tripsStore(state => state.trips);

  // STATE & MISC
  const [term, setTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const now = Date.now() / 1000;

  const data = [
    {
      title: i18n.t('Active trips'),
      data: trips.filter(
        trip => trip.dateRange.startDate < now && trip.dateRange.endDate > now,
      ),
      type: 'active',
    },
    {
      title: i18n.t('Recent trips'),
      data: trips.filter(
        trip => trip.dateRange.startDate < now && trip.dateRange.endDate < now,
      ),
      type: 'recent',
    },
    {
      title: i18n.t('Upcoming trips'),
      data: trips.filter(
        trip => trip.dateRange.startDate > now && trip.dateRange.endDate > now,
      ),
      type: 'upcoming',
    },
  ];

  const handleSearchTerm = val => {
    setTerm(val);
    const formattedTerm = val.replace(REGEX.rawLetters, '').toLowerCase();

    if (formattedTerm.length <= 0) {
      return;
    }

    let results = [];
    results = trips.filter(trip => {
      const formattedTrip = {
        title: trip.title.replace(REGEX.rawLetters, '').toLowerCase(),
        description: trip.description
          .replace(REGEX.rawLetters, '')
          .toLowerCase(),
        placeName: trip.destinations[0].placeName
          .replace(REGEX.rawLetters, '')
          .toLowerCase(),
      };

      if (
        formattedTrip.title.includes(formattedTerm) ||
        formattedTrip.description.includes(formattedTerm) ||
        formattedTrip.placeName.includes(formattedTerm)
      ) {
        return trip;
      }

      return null;
    });

    setSearchResult(results);
  };

  const handleNavigation = id => {
    onRequestClose();
    onPress(id);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}>
      <StatusBar barStyle="dark-content" />
      <KeyboardView paddingBottom={0}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                setSearchResult([]);
                setTerm('');
                onRequestClose();
              }}
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon color={COLORS.shades[100]} name="close" size={22} />
            </Pressable>
            <Headline type={4} text={i18n.t('Search')} />
            <View style={{width: 50}} />
          </View>
          <TextField
            style={{marginHorizontal: PADDING.m}}
            value={term || null}
            onChangeText={val => handleSearchTerm(val)}
            onDelete={() => handleSearchTerm('')}
            placeholder={i18n.t('Filter Trip')}
          />
          <ScrollView
            style={{
              marginHorizontal: PADDING.m,
              paddingTop: 10,
            }}>
            {term.length < 1 && (
              <SectionList
                scrollEnabled={false}
                sections={data}
                renderSectionHeader={({
                  section: {title, data: sectionData, type},
                }) => {
                  const color =
                    type === 'active'
                      ? COLORS.error[700]
                      : type === 'upcoming'
                      ? COLORS.success[700]
                      : COLORS.primary[700];
                  if (sectionData.length >= 1) {
                    return (
                      <View
                        style={[
                          styles.titleContainer,
                          {backgroundColor: Utils.addAlpha(color, 0.2)},
                        ]}>
                        <Body
                          type={2}
                          color={color}
                          style={{fontWeight: '500'}}
                          text={title}
                        />
                      </View>
                    );
                  }
                }}
                renderItem={({item}) => (
                  <SearchResultTile
                    onPress={() => handleNavigation(item.id)}
                    data={item}
                    style={{marginBottom: 10}}
                  />
                )}
              />
            )}
            {term.length >= 1 ? (
              <>
                <View
                  style={[
                    styles.titleContainer,
                    {backgroundColor: Utils.addAlpha(COLORS.neutral[500], 0.2)},
                  ]}>
                  <Body
                    type={2}
                    color={COLORS.neutral[700]}
                    style={{fontWeight: '500'}}
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
                      style={{textAlign: 'center', marginTop: 10}}
                    />
                  )}
                  data={searchResult}
                  renderItem={({item}) => (
                    <SearchResultTile
                      onPress={() => handleNavigation(item.id)}
                      data={item}
                      style={{marginBottom: 10}}
                    />
                  )}
                />
              </>
            ) : (
              <View style={{marginTop: 12, marginLeft: 5}}>
                <Body
                  type={2}
                  color={COLORS.neutral[700]}
                  text={i18n.t('No trips added yet 🥱')}
                  style={{
                    marginBottom: 4,
                    fontWeight: '500',
                  }}
                />
                <Body
                  type={2}
                  color={COLORS.neutral[300]}
                  text={i18n.t(
                    'Come back when you have joined or created a trip 🫡',
                  )}
                />
              </View>
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
    marginTop: StatusBarManager.HEIGHT - (Platform.OS === 'android' ? 25 : 10),
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
