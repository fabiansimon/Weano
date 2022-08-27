import {
  View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import Avatar from './Avatar';
import IconButton from './IconButton';
import DaysContainer from './DaysContainer';
import DefaultImage from '../../assets/images/default_trip.png';
import Body from './typography/Body';
import Subtitle from './typography/Subtitle';
import Utils from '../utils';
import Button from './Button';
import i18n from '../utils/i18n';
import Divider from './Divider';

export default function RecapCard({
  data, style, type = 'main', onPress,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const getRVSP = () => '4 yes • 1 maybes • 2 no\'s';

  const getLocation = () => 'Paris, France';

  const getDateString = () => `${Utils.getDateFromTimestamp(data.dateRange.startDate, 'DD.MM.YYYY')} - ${Utils.getDateFromTimestamp(data.dateRange.endDate, 'DD.MM.YYYY')}`;

  const getDetailContainer = (string) => (
    <View style={styles.detailContainer}>
      <Subtitle
        type={1}
        text={string}
        color={COLORS.neutral[500]}
      />
    </View>
  );

  const getMiniCard = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.miniContainer, styles.boxShadow, style]}
      onPress={onPress}
    >
      <View style={{
        justifyContent: 'center', padding: 6, paddingTop: 2, flex: 1, marginRight: 26,
      }}
      >
        <Headline
          type={3}
          text={data.title}
          numberOfLines={1}
        />
        <Body
          type={3}
          text={getRVSP()}
          color={COLORS.neutral[300]}
          isDense
        />
      </View>
      <DaysContainer dates={data.dateRange} />
    </TouchableOpacity>
  );

  // const getInviteeList = () => (
  //   <View style={styles.inviteeContainer}>
  //     {data.invitees.map((invitee) => (
  //       <Avatar
  //         uri={invitee.uri}
  //         size={36}
  //         style={{ marginRight: -8 }}
  //       />
  //     ))}
  //     <Body
  //       type={1}
  //       text={i18n.t('+2')}
  //       style={{ marginLeft: 10 }}
  //     />
  //   </View>
  // );

  const getMainCard = () => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, styles.boxShadow, style]}
      onPress={onPress}
    >
      <View>
        <Image
          source={data.images ? { uri: data.images[0] } : DefaultImage}
          style={styles.image}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Headline type={3} text={data.title} />
        <Body
          style={{ marginVertical: 5, marginBottom: !data.description && 20 }}
          type={2}
          text={data.description || i18n.t('No description available')}
          color={COLORS.neutral[300]}
        />
        <ScrollView horizontal style={{ marginTop: 15, marginBottom: 15 }}>
          {getDetailContainer(getLocation())}
          {getDetailContainer(getDateString())}
        </ScrollView>
        <Divider
          vertical={1}
          color={COLORS.neutral[50]}
          bottom={15}
        />
        <View style={styles.buttonContainer}>
          <IconButton
            onPress={() => setIsLiked(!isLiked)}
            icon={isLiked ? 'ios-heart-sharp' : 'ios-heart-outline'}
            isActive={isLiked}
          />
          <View style={{ flexDirection: 'row' }}>
            <Button
              fullWidth={false}
              isSecondary
              text={i18n.t('Share')}
              style={{ height: 45, width: 90, marginRight: 6 }}
            />
            <Button
              fullWidth={false}
              text={i18n.t('View')}
              style={{ height: 45, width: 90 }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    type === 'mini' ? getMiniCard() : getMainCard()
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 0.5,
    backgroundColor: COLORS.shades[0],
    padding: PADDING.s,
  },
  detailContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 14,
    marginRight: 8,
    height: 40,
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[50],
    padding: PADDING.s,
  },
  miniContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: COLORS.shades[0],
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    aspectRatio: 3.7,
    height: 85,
    padding: PADDING.s,
  },
  detailsContainer: {
    paddingHorizontal: PADDING.s,
    paddingVertical: PADDING.s,
    justifyContent: 'space-between',
    flex: 1,
  },
  inviteeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.xl,
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
  },
  image: {
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[100],
    borderRadius: RADIUS.s,
    width: '100%',
    height: 170,
  },
});
