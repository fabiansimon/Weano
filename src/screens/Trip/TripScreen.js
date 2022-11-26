import {
  View, StyleSheet, Image, Dimensions, TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useRef, useState, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useMutation } from '@apollo/client';
import ActionSheet from 'react-native-actionsheet';
import { launchImageLibrary } from 'react-native-image-picker';
import COLORS, { PADDING } from '../../constants/Theme';
import AnimatedHeader from '../../components/AnimatedHeader';
import Headline from '../../components/typography/Headline';
import i18n from '../../utils/i18n';
import Button from '../../components/Button';
import DefaultImage from '../../../assets/images/default_trip.png';
import BackButton from '../../components/BackButton';
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
import StatusContainer from '../../components/Trip/StatusContainer';
import ExpensesContainer from '../../components/Trip/ExpenseContainer';
import FAButton from '../../components/FAButton';
import activeTripStore from '../../stores/ActiveTripStore';
import userStore from '../../stores/UserStore';
import UPDATE_TRIP from '../../mutations/updateTrip';
import httpService from '../../utils/httpService';
import InputModal from '../../components/InputModal';

const mockData = {
  title: 'Graduation Trip 2022 🎓',
  description: 'Paris for a week as a graduate. Nothing better than that! 😎',
  dateRange: {
    startDate: 1656865380,
    endDate: 1658074980,
  },
  latlon: [48.864716, 2.349014],
  images: [],
  invitees: [
    {
      name: 'Fabian Simon',
      id: 'fabian simon',
      uri: 'https://i.pravatar.cc/300',
      status: true,
    },
    {
      name: 'Julia Stefan',
      id: 'julia stefan',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Matthias Betonmisha',
      id: 'matthias betonmisha',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Didi Chovookkaran',
      id: 'didi chovookkaran',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Alexander Wieser',
      id: 'alexander wieser',
      uri: 'https://i.pravatar.cc/300',
      status: false,
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
        isDone: false,
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
        isDone: false,
        assignee: 'Clembo',
      },
      {
        title: 'Pay for Airbnb',
        isDone: false,
        assignee: 'Jennelie',
      },
    ],
  },
};

export default function TripScreen({ route }) {
  const { isActive = false } = route.params;

  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);

  const activeTrip = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  const user = userStore((state) => state.user);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();

  const [currentTab, setCurrentTab] = useState(0);
  const [inputOpen, setInputOpen] = useState(0);
  const [tripData, setTripData] = useState(mockData);
  const addImageRef = useRef();

  const navigation = useNavigation();
  const data = activeTrip;

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
      }, 500);
    }
  }, [error]);

  const handleTabPress = (index) => {
    setCurrentTab(index);
    scrollRef.current?.scrollTo({ y: contentItems[index].yPos, animated: true });
  };

  const handleAddImage = async (index) => {
    if (index === 0) {
      return;
    }

    if (index === 2) {
      await updateTrip({
        variables: {
          trip: {
            thumbnailUri: '',
            tripId: data.id,
          },
        },
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    const options = {
      mediaType: 'photo',
      presentationStyle: 'fullScreen',
    };
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      return;
    }

    try {
      const { Location } = await httpService.uploadToS3(result.assets[0]);

      const oldUri = activeTrip.thumbnailUri;
      updateActiveTrip({ thumbnailUri: Location });

      await updateTrip({
        variables: {
          trip: {
            thumbnailUri: Location,
            tripId: data.id,
          },
        },
      }).catch((e) => {
        updateActiveTrip({ thumbnailUri: oldUri });
        console.log(e);
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      console.log(e);
    }
  };

  const updateDescription = async (description) => {
    if (description.trim().length <= 0) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('Description is not valid'),
        });
      }, 500);
      return;
    }

    const oldDescription = activeTrip.description;
    updateActiveTrip({ description });

    await updateTrip({
      variables: {
        trip: {
          description,
          tripId: data.id,
        },
      },
    }).catch((e) => {
      updateActiveTrip({ description: oldDescription });
      console.log(e);
    });

    setInputOpen(false);
  };

  const users = [
    {
      name: 'Fabian Simon',
      id: user.id,
      uri: 'https://i.pravatar.cc/300',
      status: true,
    },
    {
      name: 'Julia Stefan',
      id: 'julia stefan',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Matthias Betonmisha',
      id: 'matthias betonmisha',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Didi Chovookkaran',
      id: 'didi chovookkaran',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Alexander Wieser',
      id: 'alexander wieser',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
  ];

  const statusData = [
    {
      name: i18n.t('Location'),
      isDone: data?.location,
      route: ROUTES.locationScreen,
    },
    {
      name: i18n.t('Date'),
      isDone: data.dateRange?.startDate,
      route: ROUTES.dateScreen,
    },
    {
      name: i18n.t('Tasks'),
      isDone: false,
      route: ROUTES.checklistScreen,
    },
  ];

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
      title: i18n.t('Accomodations'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.accomodationsScreen, { data: mockData.accomodations })}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      omitPadding: true,
      content: <AccomodationCarousel
        data={mockData.accomodations}
        onLayout={(e) => {
          console.log(`Accomodations: ${e.nativeEvent.layout.y}`);
        }}
      />,
      yPos: 0,
    },
    {
      title: i18n.t('Checklist'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.checklistScreen)}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      content: <ChecklistContainer
        data={tripData.tasks}
        onPress={(val, index, type) => updateTasks(val, index, type)}
        onLayout={(e) => {
          console.log(`Checklist: ${e.nativeEvent.layout.y}`);
        }}
      />,
      yPos: 0,
    },
    {
      title: i18n.t('Expenses'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.expenseScreen, { expenses: data?.expenses || {}, tripId: data.id || '' })}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      content: <ExpensesContainer
        data={data?.expenses}
        users={users}
        tileBackground={COLORS.shades[0]}
        onLayout={(e) => {
          console.log(`Invitees: ${e.nativeEvent.layout.y}`);
        }}
      />,
      yPos: 0,
    },
    {
      title: i18n.t('Invitees'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.inviteeScreen, { data: data?.invitees || {} })}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      content: <InviteeContainer
        data={data?.invitees}
        onLayout={(e) => {
          console.log(`Invitees: ${e.nativeEvent.layout.y}`);
        }}
      />,
      yPos: 0,
    },
  ];

  const getDateRange = () => {
    if (!data.dateRange) {
      return 'N/A';
    }

    const { startDate, endDate } = data.dateRange;
    const start = Utils.getDateFromTimestamp(startDate, endDate ? 'MM.DD' : 'MM.DD.YY');
    const end = endDate ? Utils.getDateFromTimestamp(endDate, 'MM.DD.YY') : i18n.t('open');

    return `${start} - ${end}`;
  };
  const getTopContent = () => (
    <>
      <TouchableOpacity
        style={{ height: 240 }}
        onPress={() => addImageRef.current?.show()}
      />
      <View style={styles.bodyContainer}>
        <View style={{ paddingHorizontal: PADDING.l }}>
          <Headline type={2} text={data.title} />
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingRight: 30 }}
            style={{
              flexDirection: 'row',
              marginTop: 12,
              marginHorizontal: -PADDING.l,
              paddingLeft: PADDING.m,

            }}
          >
            <Button
              isSecondary
              text={data.location || i18n.t('Set location')}
              fullWidth={false}
              icon="location-pin"
              onPress={() => navigation.push(ROUTES.locationScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={data.location ? styles.infoTile : styles.infoButton}
            />
            <Button
              isSecondary
              text={data.dateRange?.startDate ? getDateRange() : i18n.t('Find date')}
              fullWidth={false}
              icon={<AntIcon name="calendar" size={22} />}
              onPress={() => navigation.push(ROUTES.dateScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={[data.dateRange?.startDate ? styles.infoTile : styles.infoButton, { marginLeft: 14 }]}
            />
          </ScrollView>
          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}
            onPress={() => setInputOpen(true)}
          >
            {!data.description && (
            <Icon
              size={16}
              color={COLORS.neutral[300]}
              name="pencil-sharp"
            />
            )}
            <Body
              type={1}
              text={data.description || i18n.t('Add a description to the trip 😎')}
              style={{ marginLeft: 4, color: COLORS.neutral[300] }}
            />
          </TouchableOpacity>
        </View>
        <Divider vertical={20} />
        <View style={styles.statusContainer}>
          <Headline
            type={3}
            text={i18n.t('Status')}
          />
          <Headline
            type={4}
            text={isActive ? i18n.t('• live') : i18n.t('21 days left')}
            style={{ fontWeight: '600', fontSize: 16 }}
            color={isActive ? COLORS.error[900] : COLORS.primary[700]}
          />
        </View>
        <ScrollView horizontal style={{ paddingHorizontal: PADDING.l, paddingTop: 14, paddingBottom: 6 }}>
          {statusData.map((item) => (
            <StatusContainer
              style={{ marginRight: 10 }}
              data={item}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </ScrollView>
        <Divider top={18} />
        <TabBar
          style={{ marginBottom: 10 }}
          items={contentItems}
          currentTab={currentTab}
          onPress={(index) => handleTabPress(index)}
        />
        <Divider omitPadding />
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
        <View style={{ backgroundColor: COLORS.shades[0], flex: 1 }}>
          <AnimatedHeader
            style={{ height: 170 }}
            maxHeight={380}
            scrollY={scrollY}
          >
            <TripHeader
              title={data.title}
              subtitle={`${getDateRange()}`}
              invitees={tripData.invitees}
              items={contentItems}
              onPress={(index) => handleTabPress(index)}
              currentTab={currentTab}
            />
          </AnimatedHeader>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="center"
              source={data.thumbnailUri ? { uri: data.thumbnailUri } : DefaultImage}
              blurRadius={!data.thumbnailUri ? 10 : 0}
            />
            {!data.thumbnailUri && (
            <View style={styles.addImage}>
              <Headline
                type={3}
                text={i18n.t('Add Trip Image')}
                color={COLORS.shades[0]}
              />
              <Icon
                name="image"
                size={32}
                color={COLORS.shades[0]}
              />
            </View>
            )}
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
            <View style={{ backgroundColor: COLORS.neutral[50], height: 0 }} />
            {getMainContent()}
          </Animated.ScrollView>
          <BackButton
            onPress={() => navigation.navigate(ROUTES.mainScreen)}
            style={{
              position: 'absolute', top: 47, left: 20, zIndex: 10,
            }}
          />
          <FAButton
            icon="chatbox-ellipses"
            onPress={() => navigation.push(ROUTES.chatScreen)}
          />
          <ActionSheet
            ref={addImageRef}
            title={i18n.t('Choose an option')}
            options={['Cancel', i18n.t('Choose from Camera Roll'), i18n.t('Reset image')]}
            cancelButtonIndex={0}
            onPress={(index) => handleAddImage(index)}
          />
          <InputModal
            isVisible={inputOpen}
            placeholder={i18n.t('Enter description')}
            onRequestClose={() => setInputOpen(false)}
            onPress={(description) => updateDescription(description)}
          />
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
    zIndex: 100,
    paddingTop: 16,
    backgroundColor: COLORS.shades[0],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.neutral[700],
    shadowRadius: 10,
    shadowOpacity: 0.02,
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
    borderColor: COLORS.neutral[300],
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 12,
  },
  infoTile: {
    height: 40,
    borderWidth: 0,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: 12,
  },
  mainContainer: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: COLORS.neutral[50],
    shadowColor: COLORS.shades[100],
    shadowOffset: {
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statusContainer: {
    alignItems: 'center',
    paddingHorizontal: PADDING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
