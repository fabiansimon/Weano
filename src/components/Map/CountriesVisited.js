import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';

export default function CountriesVisited() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.handler} />
      <View style={styles.container}>
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
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  handler: {
    alignSelf: 'center',
    width: 60,
    height: 8,
    borderRadius: 100,
    backgroundColor: COLORS.shades[0],
    marginBottom: 10,
  },
});
