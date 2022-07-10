import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import BasicHeader from '../../components/BasicHeader';
import i18n from '../../utils/i18n';
import PollView from '../../components/Polls/PollView';

export default function LocationScreen() {
  const mockData = [
    {
      title: '🇫🇷 Paris, France',
      subtitle: 'Fabian Simon',
      votes: 6,
    },
    {
      title: '🇭🇷 Pula, Croatia',
      subtitle: 'Julia',
      votes: 2,
    },
    {
      title: '🇦🇹 Vienna, Austria',
      subtitle: 'Matthias',
      votes: 0,
    },
  ];

  return (
    <View style={styles.container}>
      <BasicHeader title={i18n.t('Set location')} />
      <View style={styles.innerContainer}>
        <PollView
          data={mockData}
          title={i18n.t('Where do you want to go?')}
          subtitle={i18n.t('The location can be choosed by the host')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  innerContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
});
