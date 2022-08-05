import {
  View, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import React, { useState } from 'react';
import InsetShadow from 'react-native-inset-shadow';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import DefaultImage from '../../../assets/images/default_trip.png';
import i18n from '../../utils/i18n';
import InfoBox from '../InfoBox';
import Utils from '../../utils';
import Body from '../typography/Body';

export default function AccomodationCard({ style, data, onPress }) {
  const [isLiked, setIsLiked] = useState(false);

  const colorTheme = isLiked ? COLORS.secondary[700] : COLORS.neutral[100];

  const getDate = () => `${Utils.getDateFromTimestamp(data.dateRange.startDate, 'DD.MM')} - ${Utils.getDateFromTimestamp(data.dateRange.endDate, 'DD.MM')}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, styles.boxShadow, { borderColor: isLiked ? COLORS.secondary[500] : COLORS.neutral[100] }, style]}
      onPress={onPress}
    >
      <InsetShadow
        containerStyle={{ height: 160, borderRadius: 10 }}
        shadowOpacity={0.11}
      >
        <Image
          source={DefaultImage}
          style={styles.image}
        />
      </InsetShadow>
      <View style={styles.detailsContainer}>
        <TouchableOpacity
          onPress={() => setIsLiked(!isLiked)}
          style={[styles.infoContainer, {
            flexDirection: 'row', position: 'absolute', top: -25, right: 5,
          }]}
        >
          <Headline
            type={3}
            text="9/12"
            color={colorTheme}
          />
          <Icon
            name="heart"
            size={22}
            style={{ marginLeft: 4 }}
            color={colorTheme}
          />
        </TouchableOpacity>
        <Headline type={3} text={data.title} />
        <Headline
          type={4}
          text={data.description}
          style={{ marginVertical: 8 }}
          color={COLORS.neutral[700]}
        />
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <InfoBox
            text={`${data.info.accomodates} ${i18n.t('people')}`}
            icon="bed"
          />
          <InfoBox
            text={getDate()}
            style={{ marginLeft: 10 }}
            icon="calendar"
          />
        </View>
      </View>
      <View style={[styles.infoContainer, { position: 'absolute', top: 15, right: 15 }]}>
        <Headline type={3} text={`$${data.info.price}`} />
        <Body
          type={2}
          text={i18n.t('per night')}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    height: 350,
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    padding: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  boxShadow: {
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.shades[0],
    position: 'absolute',
  },
  image: {
    height: 160,
    borderRadius: 10,
    width: '100%',
  },
});
