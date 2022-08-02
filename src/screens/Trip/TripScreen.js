import {
  View, StyleSheet, Image, Dimensions, TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/Theme';
import AnimatedHeader from '../../components/AnimatedHeader';
import Headline from '../../components/typography/Headline';
import i18n from '../../utils/i18n';
import Button from '../../components/Button';
import DefaultImage from '../../../assets/images/default_trip.png';
import BackButton from '../../components/BackButton';
import InfoCircle from '../../components/InfoCircle';
import Body from '../../components/typography/Body';
import Divider from '../../components/Divider';
import Utils from '../../utils';
import TripHeader from '../../components/TripHeader';
import ListItem from '../../components/ListItem';
import InviteeContainer from '../../components/Trip/InviteeContainer';
import TabBar from '../../components/Trip/TabBar';
import ChecklistContainer from '../../components/Trip/ChecklistContainer';
import AccomodationCarousel from '../../components/Trip/AccomodationCarousel';
import ROUTES from '../../constants/Routes';

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
      status: true,
    },
    {
      name: 'Julia Stefan',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Matthias Betonmisha',
      status: 'https://i.pravatar.cc/300',
    },
  ],
  accomodations: [
    {
      title: 'Villa El Salvador',
      description: 'Beautiful Villa with direct access to the ocean. Parties are not allowed. Dogs must be like Rocky',
      info: {
        accomodates: 12,
        price: 1222,
      },
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
    },
    {
      title: 'Villa Da Salvador',
      description: 'Crazy ting',
      info: {
        accomodates: 10,
        price: 1999,
      },
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
    },
    {
      title: 'Nauheimergasse',
      description: 'Beautiful Villa with direct access to the ocean. Parties are not allowed. Dogs must be like Rocky',
      info: {
        accomodates: 12,
        price: 1222,
      },
      dateRange: {
        startDate: 1656865380,
        endDate: 1658074980,
      },
    },
  ],
  tasks: {
    privateTasks: [
      {
        title: 'Bring towels',
        isDone: false,
        id: 0,
      },
      {
        title: 'Get passport renewed',
        isDone: true,
        id: 1,
      },
    ],
    mutualTasks: [
      {
        title: 'Bring speakers 🎧',
        isDone: false,
        assignee: 'Julia Chovo',
      },
      {
        title: 'Check Clubscene 🎉',
        isDone: true,
        assignee: 'Clembo',
      },
      {
        title: 'Pay for Airbnb',
        isDone: true,
        assignee: 'Jennelie',
      },
    ],
  },
};

export default function TripScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const [currentTab, setCurrentTab] = useState(0);
  const [tripData, setTripData] = useState(mockData);

  const navigation = useNavigation();

  const getDate = (timestamp) => Utils.getDateFromTimestamp(timestamp, 'MMM Do');

  const handleTabPress = (index) => {
    setCurrentTab(index);
    scrollRef.current?.scrollTo({ y: contentItems[index].yPos, animated: true });
  };

  const updateTasks = (val, index, type) => {
    if (type === 'PRIVATE') {
      const updatedTasks = tripData.tasks.privateTasks;
      updatedTasks[index].isDone = val;
      setTripData((prev) => ({
        ...prev,
        tasks: {
          privateTasks: updatedTasks,
          mutualTasks: prev.tasks.mutualTasks,
        },
      }));
    }

    if (type === 'MUTUAL') {
      const updatedTasks = tripData.tasks.mutualTasks;
      updatedTasks[index].isDone = val;
      setTripData((prev) => ({
        ...prev,
        tasks: {
          privateTasks: prev.tasks.privateTasks,
          mutualTasks: updatedTasks,
        },
      }));
    }
  };

  const contentItems = [
    {
      title: 'Accomodations',
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.accomodationsScreen, { data: mockData.accomodations })}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      omitPadding: true,
      content: <AccomodationCarousel data={mockData.accomodations} />,
      yPos: 600,
    },
    {
      title: 'Checklist',
      content: <ChecklistContainer
        data={tripData.tasks}
        onPress={(val, index, type) => updateTasks(val, index, type)}
      />,
      yPos: 600,
    },
    {
      title: 'Invitees',
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.inviteeScreen)}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      content: <InviteeContainer data={tripData.invitees} />,
      yPos: 200,
    },
    {
      title: 'Itinerary',
      content: <View style={{ height: 300 }} />,
      yPos: 400,
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
            title={tripData.invitees.length}
            subtitle="👍"
            style={{
              position: 'absolute', top: -30, right: 20, zIndex: 11,
            }}
          />
          <Headline type={2} text={tripData.title} />
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Button
              text={i18n.t('Set location')}
              fullWidth={false}
              icon="location-pin"
              onPress={() => navigation.push(ROUTES.locationScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={styles.infoButton}
            />
            <Button
              text={i18n.t('Find date')}
              fullWidth={false}
              icon={<AntIcon name="calendar" size={22} />}
              onPress={() => navigation.push(ROUTES.dateScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={[styles.infoButton, { marginLeft: 10 }]}
            />
          </View>
          <Body
            type={1}
            text={tripData.description}
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
        <ListItem
          omitPadding={item.omitPadding}
          title={item.title}
          trailing={item.trailing}
        >
          {item.content}
        </ListItem>
      ))}
    </View>
  );

  return (
    !tripData
      ? <Headline text="Loading..." />
      : (
        <View style={{ backgroundColor: COLORS.shades[50], flex: 1 }}>
          <BackButton style={styles.backButton} />
          <AnimatedHeader
            style={{ height: 170 }}
            maxHeight={380}
            scrollY={scrollY}
          >
            <TripHeader
              title={tripData.title}
              subtitle={`${getDate(tripData.dateRange.startDate)} - ${getDate(tripData.dateRange.endDate)}`}
              invitees={tripData.invitees}
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
      )
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
