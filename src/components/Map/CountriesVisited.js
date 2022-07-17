import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Button from '../Button';
import ContinentChip from './ContinentChip';
import CONTINENTS_DATA from '../../constants/Continents';

export default function CountriesVisited() {
  const [selectedContinent, setSelectedContinent] = useState('worldwide');

  const continentData = CONTINENTS_DATA;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.handler} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Headline
                type={2}
                style={{ fontWeight: '400', marginRight: 4 }}
                text={i18n.t('Hey')}
              />
              <Headline type={2} text="Fabian" />
            </View>
            <Headline
              type={4}
              text={`${i18n.t("You've visited 23 countries 🌍")}`}
            />
          </View>
          <Button
            style={[styles.searchButton, styles.buttonShadow]}
            backgroundColor={COLORS.shades[0]}
            icon={<Icon name="search1" size={20} />}
            fullWidth={false}
            color={COLORS.neutral[900]}
          />
        </View>
        <ScrollView horizontal style={{ paddingHorizontal: 20, marginTop: 20 }}>
          {continentData.map((continent, index) => (
            <ContinentChip
              onTap={() => setSelectedContinent(continent.name.toLowerCase())}
              isActive={selectedContinent.toLowerCase() === continent.name.toLowerCase()}
              style={{ marginRight: index !== continentData.length - 1 ? 6 : 30 }}
              data={continent}
            />
          ))}
        </ScrollView>
        {/* <TextField
          style={{ marginVertical: 20 }}
          placeholder={i18n.t('Barcelona 2021 🇪🇸')}
          value={searchTerm || null}
          onChangeText={(val) => setSearchTerm(val)}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.06,
    shadowRadius: 10,
    paddingVertical: 15,
  },
  handler: {
    alignSelf: 'center',
    width: 60,
    height: 7,
    borderRadius: 100,
    backgroundColor: COLORS.shades[0],
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
