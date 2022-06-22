import {
  View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
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
import Utils from '../utils';
import TripHeader from '../components/TripHeader';
import ListItem from '../components/ListItem';
import InviteeContainer from '../components/Trip/InviteeContainer';
import TabBar from '../components/Trip/TabBar';

export default function TripScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const [currentTab, setCurrentTab] = useState(0);

  const getDate = (timestamp) => Utils.getDateFromTimestamp(timestamp, 'MMM Do');

  const handleTabPress = (index) => {
    setCurrentTab(index);
    scrollRef.current?.scrollTo({ y: contentItems[index].yPos, animated: true });
  };

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
        isComing: true,
      },
      {
        name: 'Julia Stefan',
        uri: 'https://i.pravatar.cc/300',
        isComing: false,
      },
      {
        name: 'Matthias Betonmisha',
        uri: 'https://i.pravatar.cc/300',
      },
    ],

  };

  const contentItems = [
    {
      title: 'Invitees',
      trailing: <Headline type={4} text={i18n.t('see all')} color={COLORS.neutral[500]} />,
      content: <InviteeContainer data={mockData.invitees} />,
      yPos: 200,
    },
    {
      title: 'Itinerary',
      content: <View style={{ height: 300 }} />,
      yPos: 400,
    },
    {
      title: 'Checklist',
      content: <View style={{ height: 300 }} />,
      yPos: 600,
    },
    {
      title: 'Etc',
      content: <View style={{ height: 300 }} />,
      yPos: 800,
    },
  ];

  const getTopContent = () => (
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
        <Divider top={18} />
        <TabBar
          style={{ marginBottom: 10 }}
          items={contentItems}
          currentTab={currentTab}
          onPress={(index) => handleTabPress(index)}
        />
      </View>
    </>
  );

  const getMainContent = () => (
    <View style={styles.mainContainer}>
      {contentItems.map((item) => (
        <ListItem title={item.title} trailing={item.trailing}>
          {item.content}
        </ListItem>
      ))}
    </View>
  );

  return (
    <View style={{ backgroundColor: COLORS.shades[50], flex: 1 }}>
      <BackButton style={styles.backButton} />
      <AnimatedHeader
        style={{ height: 170 }}
        scrollY={scrollY}
      >
        <TripHeader
          title={mockData.title}
          subtitle={`${getDate(mockData.dateRange.startDate)} - ${getDate(mockData.dateRange.endDate)}`}
          invitees={mockData.invitees}
          items={contentItems}
          onPress={(index) => handleTabPress(index)}
          currentTab={currentTab}
        />
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
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {getTopContent()}
        <View style={{ backgroundColor: COLORS.neutral[50], height: 10 }} />
        {getMainContent()}
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
  mainContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: COLORS.shades[0],
    shadowColor: COLORS.shades[100],
    shadowOffset: {
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});
