import {
  View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import COLORS from '../constants/Theme';
import AnimatedHeader from '../components/AnimatedHeader';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import Button from '../components/Button';
import DefaultImage from '../../assets/images/default_trip.png';
import BackButton from '../components/BackButton';
import InfoCircle from '../components/InfoCircle';
import Body from '../components/typography/Body';
import Divider from '../components/Divider';
import TabIndicator from '../components/TabIndicator';
import Utils from '../utils';

export default function TripScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentTab, setCurrentTab] = useState(0);

  const getDate = (timestamp) => Utils.getDateFromTimestamp(timestamp, 'MMM Do');

  const pageTabs = [
    {
      name: 'Trip Overview',
    },
    {
      name: 'Details',
    },
    {
      name: 'Accomodations',
    },
    {
      name: 'Etc',
    },
  ];

  const mockData = {

    title: 'Maturareise VBS Gang 🐕',
    description: 'Fucking sending it for a few weeks straight. Guys trip baby. LET’S GO 🍻',
    dateRange: {
      startDate: 1656865380,
      endDate: 1658074980,
    },
    latlon: [48.864716, 2.349014],
    images: [],
    invitees: [
      {
        name: 'Fabian Simon',
        uri: 'https://i.pravatar.cc/300',
      },
      {
        name: 'Julia Stefan',
        uri: 'https://i.pravatar.cc/300',
      },
      {
        name: 'Matthias Betonmisha',
        uri: 'https://i.pravatar.cc/300',
      },
    ],

  };

  const getBody = () => (
    <>
      <TouchableOpacity
        style={{ height: 240, backgroundColor: 'transparent' }}
        onPress={() => console.log('Add Image')}
      />
      <View style={styles.bodyContainer}>
        <View style={{ paddingHorizontal: 25 }}>
          <InfoCircle
            title={mockData.invitees.length}
            subtitle="👍"
            style={{
              position: 'absolute', top: -30, right: 20, zIndex: 11,
            }}
          />
          <Headline type={2} text={mockData.title} />
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Button
              text={i18n.t('Set location')}
              fullWidth={false}
              icon="location-pin"
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={styles.infoButton}
            />
            <Button
              text={i18n.t('Find date')}
              fullWidth={false}
              icon={<AntIcon name="calendar" size={22} />}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={[styles.infoButton, { marginLeft: 10 }]}
            />
          </View>
          <Body
            type={1}
            text={mockData.description}
            style={{ marginTop: 16, color: COLORS.neutral[700] }}
          />
        </View>
        <Divider vertical={18} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pageTabs.map((item, index) => (
            <TabIndicator
              style={{ marginLeft: index === 0 ? 10 : 14 }}
              key={item.name}
              text={item.name}
              onPress={() => setCurrentTab(index)}
              isActive={currentTab === index}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );

  return (
    <View style={{ backgroundColor: COLORS.shades[0], flex: 1 }}>
      <BackButton style={styles.backButton} />
      <AnimatedHeader
        scrollY={scrollY}
      >
        <View style={styles.header}>
          <View style={{ width: 55 }} />
          <View>
            <Headline type={4} text={mockData.title} style={{fontWeight: '600'}}/>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <EntypoIcon
                name="location-pin"
                size={16}
                color={COLORS.neutral[500]}
              />
              <Body
                type={2}
                text={`${getDate(mockData.dateRange.startDate)} - ${getDate(mockData.dateRange.endDate)}`}
                color={COLORS.neutral[500]}
              />
            </View>
          </View>
          <InfoCircle
            title={mockData.invitees.length}
            subtitle="👍"
            disableShadow
          />
        </View>
      </AnimatedHeader>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={DefaultImage}
          blurRadius={10}
        />
        <View style={styles.addImage}>
          <Headline type={3} text={i18n.t('Add Trip Image')} color={COLORS.shades[0]} />
          <Icon name="image" size={32} color={COLORS.shades[0]} />
        </View>
      </View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {getBody()}
      </Animated.ScrollView>
      <BackButton style={{
        position: 'absolute', top: 47, left: 20, zIndex: 10,
      }}
      />
      <View style={styles.buttonContainer}>
        <Button
          text={i18n.t('new adventure')}
          onPress={() => console.log('hello')}
          style={[styles.buttonShadow]}
        />
        <Button
          style={[styles.globeButton, styles.buttonShadow]}
          backgroundColor={COLORS.shades[0]}
          icon="globe"
          fullWidth={false}
          color={COLORS.neutral[900]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addImage: {
    position: 'absolute',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
    index: 10,
  },
  bodyContainer: {
    paddingTop: 16,
    backgroundColor: COLORS.shades[0],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  buttonContainer: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingTop: 18,
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowOffset: {
      height: -10,
    },
    position: 'absolute',
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 110,
    width: '100%',
    bottom: 0,
  },
  globeButton: {
    marginLeft: 15,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  image: {
    resizeMode: 'stretch',
    height: 290,
    width: Dimensions.get('window').width,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
  },
  infoButton: {
    borderColor: COLORS.shades[100],
    borderWidth: 2,
    height: 40,
    paddingHorizontal: 12,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
});
