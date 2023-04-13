import React, {useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import CountryData from '../constants/Countries';
import COLORS, {PADDING} from '../constants/Theme';
import i18n from '../utils/i18n';
import CountryListItem from './CountryListItem';
import TextField from './TextField';
import TitleModal from './TitleModal';

const CountrySelectorModal = ({
  isVisible,
  onRequestClose,
  selectedCountry,
  onPress,
}) => {
  const [countryData, setCountryData] = React.useState(CountryData);
  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    getSortedList();
    setSearchTerm('');
  }, []);

  const getSortedList = () => {
    const countries = CountryData;
    const sortedCountries = [];
    let prefCountries = [];
    let restCountries = [];

    prefCountries = countries.filter(country => country.isPref);
    prefCountries.sort((a, b) => a.name.localeCompare(b.name));

    restCountries = countries.filter(country => !country.isPref);
    restCountries.sort((a, b) => a.name.localeCompare(b.name));

    setCountryData(sortedCountries.concat(prefCountries, restCountries));
  };

  const filterData = val => {
    setSearchTerm(val);

    if (val.trim() === '') {
      getSortedList();
      return;
    }

    const filteredData = [];
    const term = val.toLowerCase().trim();

    CountryData.forEach(country => {
      if (country.name.toLowerCase().trim().includes(term)) {
        filteredData.push(country);
      }

      if (country.dialCode.trim().includes(term)) {
        if (!filteredData.includes(country)) {
          filteredData.push(country);
        }
      }
    });

    setCountryData(filteredData);
  };

  const renderItem = (country, index) => (
    <CountryListItem
      showPrefix
      country={country}
      index={index}
      searchActive={searchTerm.trim() !== ''}
      countryData={countryData}
      isSelected={selectedCountry === country}
      onPress={() => {
        onPress(country);
        filterData('');
        onRequestClose();
      }}
    />
  );

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Select Country')}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TextField
            style={{marginBottom: 10, borderColor: 'transparent', height: 45}}
            value={searchTerm || null}
            onChangeText={val => filterData(val)}
            onDelete={() => filterData('')}
            placeholder={i18n.t('Filter Trip')}
          />
        </View>
        {!countryData ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              marginBottom: 50,
            }}>
            <FlatList
              data={countryData}
              scrollEnabled={false}
              renderItem={({item, index}) => renderItem(item, index)}
            />
          </View>
        )}
      </ScrollView>
    </TitleModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING.m,
    backgroundColor: COLORS.neutral[50],
    height: '100%',
  },
  headerContainer: {
    paddingTop: 10,
    backgroundColor: COLORS.neutral[50],
  },
  countrySelector: {
    width: '100%',
    paddingBottom: 40,
  },
});

export default CountrySelectorModal;
