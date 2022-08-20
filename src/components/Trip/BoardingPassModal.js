import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import HighlightContainer from './HighlightContainer';
import i18n from '../../utils/i18n';
import BoardingPassDots from '../../../assets/images/boarding_card_dots.png';
import BoardingPassCode from '../../../assets/images/boarding_card_code.png';

export default function BoardingPassModal({ style, type }) {
  const getDestinationContainer = () => (
    <HighlightContainer
      description={i18n.t('Destination')}
      text={'Paris, France'}
      buttonText={i18n.t('Find Destination')}
      buttonIcon="calendar"
    />
  );

  const getDateContainer = () => (
    <HighlightContainer
      description={i18n.t('Dates')}
      buttonText={i18n.t('Find date')}
      buttonIcon="calendar"
    />
  );

  return (
    <View style={[style, styles.boardingPassSheet]}>
      <View style={styles.handleIndicator} />
      <Image
        style={styles.dots}
        resizeMode="contain"
        source={BoardingPassDots}
      />
      <View style={styles.innerContainer}>
        {type === 'date' ? getDateContainer() : getDestinationContainer()}
        <Image
          style={styles.barcode}
          resizeMode="contain"
          source={BoardingPassCode}
        />
        {type === 'date' ? getDestinationContainer() : getDateContainer()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardingPassSheet: {
    flex: 1,
    borderTopRightRadius: RADIUS.m,
    borderTopLeftRadius: RADIUS.m,
    marginHorizontal: PADDING.s,
    backgroundColor: COLORS.primary[700],
  },
  dots: {
    marginTop: 8,
    width: '100%',
  },
  barcode: {
    alignSelf: 'center',
    width: '90%',
  },
  handleIndicator: {
    alignSelf: 'center',
    marginTop: 10,
    height: 5,
    width: 70,
    borderRadius: 100,
    backgroundColor: COLORS.shades[0],
  },
});
