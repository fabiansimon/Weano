import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import TextField from '../components/TextField';
import RecapCard from '../components/RecapCard';
import PageIndicator from '../components/PageIndicator';
import Button from '../components/Button';

export default function MainScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recapIndex] = useState(0);

  const mockTrips = [
    {
      title: 'Maturareise VBS Gang 🐕',
      start_date: 1656865380,
      end_date: 1658074980,
      latlon: [48.864716, 2.349014],
      images: ['https://picsum.photos/315/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150'],
    },
    {
      title: 'Paris with mon Amie 🇫🇷',
      start_date: 1656865380,
      end_date: 1658074980,
      latlon: [48.864716, 2.349014],
      images: ['https://picsum.photos/315/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150'],
    },
    {
      title: 'Solo thru the US 🤠',
      start_date: 1656865380,
      end_date: 1658074980,
      latlon: [48.864716, 2.349014],
      images: ['https://picsum.photos/315/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150', 'https://picsum.photos/150'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 20 }}>
        <Headline type={3} text={i18n.t('Hey Fabian')} />
        <Headline type={4} text={i18n.t('ready for a new Adventure? 🌍')} />
        <TextField
          style={{ marginTop: 20 }}
          focusable={false}
          placeholder={i18n.t('Barcelona 2021 🇪🇸')}
          value={searchTerm || null}
          onChangeText={(val) => setSearchTerm(val)}
          onDelete={() => setSearchTerm('')}
        />
      </View>
      <View style={styles.carousel}>
        <ScrollView
          horizontal
          paddingHorizontal={25}
          marginTop={25}
          showsHorizontalScrollIndicator={false}
        >
          {mockTrips.map((trip) => (
            <RecapCard
              data={trip}
              style={{ marginRight: 30 }}
            />
          ))}
        </ScrollView>
      </View>
      <PageIndicator
        data={mockTrips}
        pageIndex={recapIndex}
        style={{ alignSelf: 'center' }}
      />
      <View style={styles.buttonContainer}>
        <Button
          text={i18n.t('new adventure')}
          style={[styles.buttonShadow, { marginTop: 30 }]}
        />
        <Button
          style={[styles.globeButton, styles.buttonShadow]}
          icon="globe"
          color={COLORS.neutral[900]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carousel: {
    height: '63%',
    Horizontal: 25,
  },
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  buttonShadow: {
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  globeButton: {
    marginLeft: 15,
    marginTop: 30,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
