import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  RefreshControl,
  Platform,
  StatusBar,
  NativeModules,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useLazyQuery, useMutation} from '@apollo/client';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import {MenuView} from '@react-native-menu/menu';
import PagerView from 'react-native-pager-view';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
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
import ROUTES from '../../constants/Routes';
import StatusContainer from '../../components/Trip/StatusContainer';
import ExpensesContainer from '../../components/Trip/ExpenseContainer';
import activeTripStore from '../../stores/ActiveTripStore';
import META_DATA from '../../constants/MetaData';
import UPDATE_TRIP from '../../mutations/updateTrip';
import httpService from '../../utils/httpService';
import InputModal from '../../components/InputModal';
import PollCarousel from '../../components/Polls/PollCarousel';
import GET_TRIP_BY_ID from '../../queries/getTripById';
import TripScreenSkeleton from './TripScreenSkeleton';
import userManagement from '../../utils/userManagement';
import DELETE_TRIP_BY_ID from '../../mutations/deleteTripById';
import ShareModal from '../../components/Trip/ShareModal';
import tripsStore from '../../stores/TripsStore';
import DocumentsContainer from '../../components/Trip/DocumentsContainer';
import AccentBubble from '../../components/Trip/AccentBubble';
import PacklistContainer from '../../components/Trip/PacklistContainer';
import CalendarModal from '../../components/CalendarModal';
import TripSlider from '../../components/Trip/TripSlider';
import Animated from 'react-native-reanimated';
import DestinationScreen from './DestinationsScreen';
import REMOVE_USER_FROM_TRIP from '../../mutations/removeUserFromTrip';
import userStore from '../../stores/UserStore';
import {LinearGradient} from 'expo-linear-gradient';
import InfoController from '../../controllers/InfoController';
import Subtitle from '../../components/typography/Subtitle';

const {StatusBarManager} = NativeModules;

const {width} = Dimensions.get('window');

export default function TripScreen({route}) {
  // PARAMS
  const {tripId} = route.params;

  // QUERIES
  const [getTripData, {error: fetchError, data: tripData, loading}] =
    useLazyQuery(GET_TRIP_BY_ID, {
      variables: {
        tripId,
      },
      fetchPolicy: 'network-only',
    });

  // MUTATIONS
  const [removeUser] = useMutation(REMOVE_USER_FROM_TRIP);
  const [updateTrip, {error}] = useMutation(UPDATE_TRIP);
  const [deleteTrip] = useMutation(DELETE_TRIP_BY_ID);

  // STORES
  const activeTrip = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const setActiveTrip = activeTripStore(state => state.setActiveTrip);
  const removeTrip = tripsStore(state => state.removeTrip);
  const addTrip = tripsStore(state => state.addTrip);
  const trips = tripsStore(state => state.trips);
  const {id} = userStore(state => state.user);

  // STATE & MISC
  const [viewIndex, setViewIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [inputOpen, setInputOpen] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const pageRef = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;
  const addImageRef = useRef();
  const scrollRef = useRef();
  const documentsRef = useRef();
  const expensesRef = useRef();
  const packlistRef = useRef();
  const pollsRef = useRef();
  const checklistRef = useRef();
  const travelersRef = useRef();

  const navigation = useNavigation();

  const contentRefs = [
    expensesRef,
    checklistRef,
    pollsRef,
    documentsRef,
    packlistRef,
    travelersRef,
  ];

  const IMAGE_HEIGHT = 240;
  const data = activeTrip.title !== undefined ? activeTrip : null;
  const inactive = !data || (loading && !refreshing);

  const isHost = userManagement.isHost();

  const themeColor =
    activeTrip.type === 'active' ? COLORS.error[900] : COLORS.primary[700];

  const navigatePage = index => {
    if (!inactive) {
      pageRef.current?.setPage(index);
    }
  };

  const handleMenuOption = input => {
    const {event} = input;

    switch (event) {
      case 'editTitle':
        setInputOpen('title');
        break;
      case 'editDescription':
        setInputOpen('description');
        break;
      case 'editThumbnail':
        addImageRef.current?.show();
        break;
      case 'delete':
        handleDeleteTrip();
        break;
      case 'exit':
        exitTrip();
        break;
      case 'share':
        setShareVisible(true);
        break;

      default:
        break;
    }
  };

  const exitTrip = () => {
    Utils.showConfirmationAlert(
      i18n.t('Leave the trip'),
      i18n.t('Are you sure you want to leave?'),
      i18n.t('Yes'),
      async () => {
        await removeUser({
          variables: {
            data: {
              id: id,
              tripId: tripId,
            },
          },
        })
          .then(() => {
            removeTrip(data.id);
            navigation.navigate(ROUTES.mainScreen);
          })
          .catch(e => {
            Toast.show({
              type: 'error',
              text1: i18n.t('Whoops!'),
              text2: e.message,
            });
            console.log(`ERROR: ${e.message}`);
          });
      },
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTripData()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  useEffect(() => {
    if (error || fetchError) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error?.message || fetchError?.message,
        });
      }, 500);
    }

    if (tripData) {
      const _trip = tripData.getTripById;
      if (trips.findIndex(trip => trip.id === _trip.id) === -1) {
        addTrip(_trip);
      }

      setActiveTrip(_trip);
    }
  }, [error, fetchError, tripData]);

  useEffect(() => {
    getTripData();
  }, [tripId]);

  useEffect(() => {
    navigatePage(viewIndex);
  }, [viewIndex]);

  const handleDeleteTrip = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Trip'),
      i18n.t(`Are you sure you want to delete '${data?.title}'?`),
      i18n.t('Delete'),
      async () => {
        await deleteTrip({
          variables: {
            tripId,
          },
        })
          .then(() => {
            Toast.show({
              type: 'success',
              text1: i18n.t('Whooray!'),
              text2: i18n.t('Trip was succeessfully deleted!'),
            });

            removeTrip(data.id);
            navigation.navigate(ROUTES.mainScreen);
          })
          .catch(e => {
            Toast.show({
              type: 'error',
              text1: i18n.t('Whoops!'),
              text2: e.message,
            });
            console.log(`ERROR: ${e.message}`);
          });
      },
    );
  };

  const handleTabPress = index => {
    setCurrentTab(index);
    const headerHeight = 460;
    const ref = contentRefs[index];
    ref?.current?.measure((_, fy) => {
      scrollRef.current?.scrollTo({y: fy + headerHeight, animated: true});
    });
  };

  const handleAddImage = async index => {
    const options = {
      width: 400,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      includeBase64: true,
    };

    if (index === 0) {
      return;
    }

    if (index === 1) {
      await ImageCropPicker.openPicker(options).then(async image => {
        if (!image) {
          return;
        }
        uploadImage(image);
      });
    }

    if (index === 2) {
      await ImageCropPicker.openCamera(options).then(async image => {
        if (!image) {
          return;
        }
        uploadImage(image);
      });
    }

    await updateTrip({
      variables: {
        trip: {
          thumbnailUri: '',
          tripId: data.id,
        },
      },
    })
      .then(() => {
        updateActiveTrip({thumbnailUri: ''});
      })
      .catch(e => {
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        }, 500);
      });
  };

  const uploadImage = async image => {
    try {
      const {Location} = await httpService.uploadToS3(image.data);

      const oldUri = activeTrip.thumbnailUri;
      updateActiveTrip({thumbnailUri: Location});

      await updateTrip({
        variables: {
          trip: {
            thumbnailUri: Location,
            tripId: data.id,
          },
        },
      }).catch(e => {
        updateActiveTrip({thumbnailUri: oldUri});
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

  const handleDateUpdate = async (start, end) => {
    setTimeout(async () => {
      const oldDateRange = data.dateRange;
      updateActiveTrip({
        dateRange: {
          endDate: end,
          startDate: start,
        },
      });

      await updateTrip({
        variables: {
          trip: {
            tripId: data.id,
            dateRange: {
              startDate: start,
              endDate: end,
            },
          },
        },
      }).catch(e => {
        updateActiveTrip({dateRange: oldDateRange});
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        }, 500);
        console.log(e);
      });
    }, 300);
  };

  const updateDescription = async description => {
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
    updateActiveTrip({description});

    await updateTrip({
      variables: {
        trip: {
          description,
          tripId: data.id,
        },
      },
    }).catch(e => {
      updateActiveTrip({description: oldDescription});
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      }, 500);
    });

    setInputOpen(null);
  };
  const updateTitle = async title => {
    if (title.trim().length <= 0) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('Title is not valid'),
        });
      }, 500);
      return;
    }

    const oldTitle = activeTrip.title;
    updateActiveTrip({title});

    await updateTrip({
      variables: {
        trip: {
          title,
          tripId: data.id,
        },
      },
    }).catch(e => {
      updateActiveTrip({description: oldTitle});
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      }, 500);
    });

    setInputOpen(null);
  };

  const getDayDifference = () => {
    if (activeTrip.type === 'active') {
      return i18n.t('• Live');
    }

    const difference = Utils.getDaysDifference(data?.dateRange.startDate);

    if (difference < 0) {
      return `${difference * -1} ${i18n.t('days ago')}`;
    }
    return `${i18n.t('In')} ${difference} ${
      difference === 1 ? i18n.t('day') : i18n.t('days')
    }`;
  };

  const getLocationString = useCallback(() => {
    if (!data) {
      return;
    }

    const {destinations} = data;

    const placeArr = data?.destinations[0]?.placeName.split(',');

    if (destinations.length < 1) {
      return i18n.t('Set location');
    }

    if (destinations.length > 1) {
      return placeArr[placeArr.length - 1].trim();
    }

    return placeArr[0].trim();
  }, [data?.destinations]);

  const checkTasksStatus = useCallback(() => {
    if (!data) {
      return false;
    }

    const {mutualTasks, privateTasks} = data;
    const tasks = [...mutualTasks, ...privateTasks];

    if (tasks.length <= 0) {
      return true;
    }

    return tasks.filter(task => task.isDone).length === tasks.length;
  }, [activeTrip]);

  const checkPackingListStatus = useCallback(() => {
    if (!data) {
      return false;
    }

    const {packingItems} = data;

    return packingItems.filter(p => p.isPacked).length === packingItems.length;
  }, [activeTrip]);

  const getMenuActions = () => {
    const edit = {
      id: 'edit',
      title: i18n.t('Edit Trip'),
      subactions: [
        {
          id: 'editTitle',
          title: i18n.t('Title'),
          attributes: {
            disabled: !isHost,
          },
        },
        {
          id: 'editDescription',
          title: i18n.t('Description'),
          attributes: {
            disabled: !isHost,
          },
        },
        {
          id: 'editThumbnail',
          title: i18n.t('Thumbnail'),
          attributes: {
            disabled: !isHost,
          },
        },
      ],
    };

    const share = {
      id: 'share',
      title: i18n.t('Invite friends'),
    };

    const deleteTrip = {
      id: 'delete',
      title: i18n.t('Delete Trip'),
      attributes: {
        destructive: true,
        disabled: !isHost,
      },
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    };

    const exitTrip = {
      id: 'exit',
      title: i18n.t('Leave Trip'),
      attributes: {
        destructive: true,
      },
    };

    if (isHost && data?.activeMembers.length <= 1) {
      return [edit, share, deleteTrip];
    }
    if (isHost) {
      return [edit, share, exitTrip];
    }

    return [edit, share, exitTrip];
  };

  const statusData = [
    {
      name: i18n.t('Location'),
      isDone: data?.destinations[0],
      onPress: () => setViewIndex(prev => (prev === 1 ? 0 : 1)),
    },
    {
      name: i18n.t('Date'),
      isDone: data?.dateRange?.startDate,
      onPress: () => (isHost ? setCalendarVisible(true) : null),
    },
    {
      name: i18n.t('Packing'),
      isDone: checkPackingListStatus(),
      route: ROUTES.packlistScreen,
    },
    {
      name: i18n.t('Tasks'),
      isDone: checkTasksStatus(),
      route: ROUTES.checklistScreen,
    },
  ];

  // expensesRef,
  //   checklistRef,
  //   pollsRef,
  //   documentsRef,
  //   packlistRef,
  //   travelersRef,
  const contentItems = [
    {
      title: i18n.t('Expenses'),
      trailing: (
        <Headline
          onPress={() => navigation.push(ROUTES.expenseScreen)}
          type={4}
          style={{textDecorationLine: 'underline'}}
          text={i18n.t('see all')}
          color={COLORS.neutral[300]}
        />
      ),
      ref: expensesRef,
      content: <ExpensesContainer tileBackground={COLORS.shades[0]} />,
    },
    {
      title: i18n.t('Checklist'),
      trailing: (
        <Headline
          ref={checklistRef}
          onPress={() => navigation.push(ROUTES.checklistScreen)}
          type={4}
          style={{textDecorationLine: 'underline'}}
          text={i18n.t('see all')}
          color={COLORS.neutral[300]}
        />
      ),
      ref: checklistRef,
      content: (
        <ChecklistContainer
          onPress={() => navigation.push(ROUTES.checklistScreen)}
        />
      ),
    },
    {
      title: i18n.t('Polls'),
      trailing: (
        <Headline
          ref={pollsRef}
          onPress={() => navigation.push(ROUTES.pollScreen)}
          type={4}
          style={{textDecorationLine: 'underline'}}
          text={i18n.t('see all')}
          color={COLORS.neutral[300]}
        />
      ),
      ref: pollsRef,
      omitPadding: true,
      content: data?.polls && (
        <PollCarousel
          onPress={() => navigation.push(ROUTES.pollScreen)}
          data={data?.polls}
        />
      ),
    },
    {
      title: i18n.t('Documents'),
      trailing: (
        <Headline
          onPress={() => navigation.push(ROUTES.documentsScreen)}
          type={4}
          style={{textDecorationLine: 'underline'}}
          text={i18n.t('see all')}
          color={COLORS.neutral[300]}
        />
      ),
      ref: documentsRef,
      omitPadding: true,
      content: data?.documents && <DocumentsContainer data={data?.documents} />,
    },

    {
      title: i18n.t('Packing list'),
      trailing: (
        <Headline
          onPress={() => navigation.push(ROUTES.packlistScreen)}
          type={4}
          style={{textDecorationLine: 'underline'}}
          text={i18n.t('see all')}
          color={COLORS.neutral[300]}
        />
      ),
      ref: packlistRef,
      content: (
        <PacklistContainer
          data={data?.packingItems.filter(item => !item.isPacked)}
        />
      ),
    },

    {
      title: i18n.t('Travelers'),
      trailing: (
        <Headline
          ref={travelersRef}
          onPress={() => navigation.push(ROUTES.inviteeScreen)}
          type={4}
          style={{textDecorationLine: 'underline'}}
          text={i18n.t('see all')}
          color={COLORS.neutral[300]}
        />
      ),
      ref: travelersRef,
      content: (
        <InviteeContainer
          onPress={() => navigation.push(ROUTES.inviteeScreen)}
          data={data?.activeMembers}
          onLayout={e => {
            console.log(`Invitees: ${e.nativeEvent.layout.y}`);
          }}
        />
      ),
    },
  ];

  const getTopContent = () => (
    <>
      <View style={styles.handler} />
      <View style={styles.bodyContainer}>
        <View style={{paddingHorizontal: PADDING.l}}>
          <View style={styles.infoHeader}>
            {isHost ? (
              <Pressable
                onPress={() => {
                  InfoController.showModal(
                    i18n.t('You are host'),
                    i18n.t(
                      'A host is able to edit details of the trip. You can always make fellow travelers a host too.',
                    ),
                  );
                }}
                style={styles.hostContainer}>
                <Icon color={COLORS.shades[0]} name="person" />
                <Body
                  type={2}
                  style={{
                    fontWeight: Platform.OS === 'android' ? '600' : '500',
                    marginLeft: 4,
                  }}
                  color={COLORS.shades[0]}
                  text={i18n.t('You are host')}
                />
              </Pressable>
            ) : (
              <View />
            )}
            {data?.type === 'recent' ? (
              <Pressable
                onPress={() =>
                  InfoController.showModal(
                    i18n.t('Trip locked'),
                    i18n.t(
                      "A trip is locked as soon as it is finished. After the trip is locked you won't be able to edit or add any new items.",
                    ),
                  )
                }
                style={styles.lockedContainer}>
                <Icon color={COLORS.shades[0]} name="md-lock-closed" />
                <Body
                  type={2}
                  style={{
                    fontWeight: Platform.OS === 'android' ? '600' : '500',
                    marginLeft: 4,
                  }}
                  color={COLORS.shades[0]}
                  text={i18n.t('Trip is locked')}
                />
              </Pressable>
            ) : (
              <View />
            )}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Headline
              onPress={() => isHost && setInputOpen('title')}
              type={2}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{flex: 1}}
              text={data?.title}
            />

            <MenuView
              style={styles.addIcon}
              onPressAction={({nativeEvent}) => handleMenuOption(nativeEvent)}
              actions={getMenuActions()}>
              <View
                style={{
                  borderRadius: RADIUS.xl,
                  borderWidth: 1,
                  borderColor: COLORS.neutral[100],
                  backgroundColor: COLORS.neutral[50],
                  padding: 5,
                }}>
                <FeatherIcon
                  name="more-vertical"
                  size={20}
                  color={COLORS.neutral[700]}
                />
              </View>
            </MenuView>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingRight: 30,
            }}
            style={{
              flexDirection: 'row',
              marginTop: 8,
              marginHorizontal: -PADDING.l,
              paddingLeft: PADDING.m,
            }}>
            <Button
              color={COLORS.shades[100]}
              isSecondary
              text={getLocationString()}
              fullWidth={false}
              icon="location-pin"
              onPress={() => setViewIndex(prev => (prev === 1 ? 0 : 1))}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={
                data?.destinations[0] ? styles.infoTile : styles.infoButton
              }
            />
            <Button
              isSecondary
              text={
                data?.dateRange?.startDate
                  ? Utils.getDateRange(data.dateRange)
                  : i18n.t('Find date')
              }
              fullWidth={false}
              icon={
                <AntIcon color={COLORS.shades[100]} name="calendar" size={18} />
              }
              onPress={() =>
                isHost && data?.type !== 'recent'
                  ? setCalendarVisible(true)
                  : null
              }
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={[
                data?.dateRange?.startDate
                  ? styles.infoTile
                  : styles.infoButton,
                {marginLeft: 14},
              ]}
            />
          </ScrollView>
          <Pressable
            style={{flexDirection: 'row', marginTop: 16, alignItems: 'center'}}
            onPress={() => isHost && setInputOpen('description')}>
            {!data?.description && isHost && (
              <Icon size={16} color={COLORS.neutral[300]} name="pencil-sharp" />
            )}
            <Body
              type={1}
              text={
                data?.description || i18n.t('Add a description to the trip 😎')
              }
              style={{marginLeft: 4, color: COLORS.neutral[300]}}
            />
          </Pressable>
        </View>
        <Divider vertical={20} />
        <View style={styles.statusContainer}>
          <Headline type={3} text={i18n.t('Status')} />
          <Animatable.View
            style={[styles.dateDifferenceStyle, {backgroundColor: themeColor}]}
            animation="pulse"
            iterationCount={activeTrip.type === 'active' ? 'infinite' : 1}>
            <Headline
              type={4}
              text={getDayDifference()}
              style={{
                fontWeight: Platform.OS === 'android' ? '700' : '600',
                fontSize: 14,
              }}
              color={COLORS.shades[0]}
            />
          </Animatable.View>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingRight: 30}}
          style={{
            paddingHorizontal: PADDING.l,
            paddingTop: 14,
            paddingBottom: 6,
          }}>
          {statusData.map(item => (
            <StatusContainer
              style={{marginRight: 10}}
              data={item}
              onPress={() =>
                item.onPress ? item.onPress() : navigation.push(item.route)
              }
            />
          ))}
        </ScrollView>
        <Divider top={18} />
        <TabBar
          style={{marginBottom: 10}}
          items={contentItems}
          currentTab={currentTab}
          onPress={index => handleTabPress(index)}
        />
        <Divider omitPadding />
      </View>
    </>
  );

  const getMainContent = () => (
    <View style={styles.mainContainer}>
      {contentItems.map(item => (
        <View ref={item.ref}>
          <ListItem
            onPress={item.onPress}
            omitPadding={item.omitPadding}
            title={item.title}
            trailing={item.trailing}>
            {item.content}
          </ListItem>
        </View>
      ))}
    </View>
  );

  const getHeaderImage = () => (
    <>
      <Animated.View
        style={{
          backgroundColor: COLORS.shades[100],
          position: 'absolute',
          zIndex: 0,
          height: IMAGE_HEIGHT,
          width,
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
                outputRange: [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT / 3],
              }),
              scale: scrollY.interpolate({
                inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
                outputRange: [2, 1, 1],
              }),
            },
          ],
        }}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={DefaultImage}
          blurRadius={5}
        />
        {!inactive && isHost && data?.type !== 'recent' && (
          <View style={styles.addImage}>
            <Headline type={3} text={i18n.t('Add Trip Image')} color="white" />
            <Icon name="image" size={32} color="white" />
          </View>
        )}
        {data?.thumbnailUri && !inactive && (
          <FastImage
            style={styles.image}
            resizeMode="cover"
            source={{uri: data.thumbnailUri}}
          />
        )}
        <LinearGradient
          style={{
            height: 70,
            width,
            bottom: 0,
            position: 'absolute',
            opacity: 0.5,
          }}
          colors={['transparent', COLORS.neutral[900]]}
        />
      </Animated.View>
    </>
  );

  return (
    <>
      <PagerView style={{flex: 1}} ref={pageRef} scrollEnabled={false}>
        <View style={{backgroundColor: COLORS.shades[0], flex: 1}}>
          <StatusBar barStyle="dark-content" />
          <AnimatedHeader
            style={{
              height:
                StatusBarManager.HEIGHT +
                (Platform.OS === 'android' ? 100 : 110),
            }}
            scrollDistance={480}
            threshold={1.2}
            scrollY={scrollY}>
            <TripHeader
              isLoading={inactive}
              title={data?.title}
              id={data?.id}
              isActive={activeTrip.type === 'active'}
              subtitle={`${data?.destinations[0]?.placeName.split(',')[0]}`}
              items={contentItems}
              onPress={index => handleTabPress(index)}
              currentTab={currentTab}
            />
          </AnimatedHeader>
          {getHeaderImage()}
          <Animated.ScrollView
            contentContainerStyle={{paddingBottom: 40}}
            refreshControl={
              <RefreshControl
                // enabled={data}
                progressViewOffset={50}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}>
            <Pressable
              style={{height: IMAGE_HEIGHT}}
              onPress={() =>
                data && isHost ? addImageRef.current?.show() : null
              }
            />
            {inactive && (
              <View
                style={[
                  styles.bodyContainer,
                  {paddingHorizontal: PADDING.m, marginBottom: 60},
                ]}>
                <TripScreenSkeleton />
              </View>
            )}
            {!inactive && getTopContent()}
            {!inactive && getMainContent()}
          </Animated.ScrollView>
          <BackButton
            onPress={() => navigation.navigate(ROUTES.mainScreen)}
            style={{
              position: 'absolute',
              top:
                StatusBarManager.HEIGHT - (Platform.OS === 'android' ? 25 : 5),
              left: 20,
              zIndex: 10,
            }}
          />
          <Pressable
            onPress={() =>
              data
                ? navigation.push(ROUTES.memoriesScreen, {tripId: data.id})
                : null
            }
            style={styles.memoryButton}>
            {data?.type === 'active' && data?.userFreeImages > 0 && (
              <AccentBubble
                style={{position: 'absolute', right: -4, top: -6}}
                text={data?.userFreeImages}
              />
            )}
            <Icon name="image" color={COLORS.neutral[700]} size={22} />
          </Pressable>
          <ActionSheet
            ref={addImageRef}
            title={i18n.t('Choose an option')}
            options={[
              i18n.t('Cancel'),
              i18n.t('Choose from Camera Roll'),
              i18n.t('Take a picture'),
              i18n.t('Reset image'),
            ]}
            cancelButtonIndex={0}
            onPress={index => handleAddImage(index)}
          />
          <InputModal
            isVisible={inputOpen}
            placeholder={
              inputOpen === 'description'
                ? i18n.t('Enter description')
                : i18n.t('Enter title')
            }
            initalValue={
              inputOpen === 'description' ? data?.description : data?.title
            }
            onRequestClose={() => setInputOpen(null)}
            multiline={inputOpen === 'description'}
            maxLength={inputOpen === 'description' ? 100 : 25}
            onPress={string =>
              inputOpen === 'description'
                ? updateDescription(string)
                : updateTitle(string)
            }
          />
          <ShareModal
            isVisible={shareVisible}
            onRequestClose={() => setShareVisible(false)}
            value={`${META_DATA.websiteUrl}/redirect/invitation/${tripId}`}
          />
          <CalendarModal
            minDate={false}
            isVisible={calendarVisible}
            onRequestClose={() => setCalendarVisible(false)}
            initialStartDate={data?.dateRange?.startDate}
            initialEndDate={data?.dateRange?.endDate}
            onApplyClick={dates => {
              const {
                end: {timestamp: _end},
                start: {timestamp: _start},
              } = dates;
              if (_start && _end) {
                handleDateUpdate(_start / 1000, _end / 1000);
                setCalendarVisible(false);
              }
            }}
          />
        </View>
        {!inactive ? (
          <DestinationScreen
            navigatePage={() => setViewIndex(0)}
            isHost={isHost}
          />
        ) : (
          <View />
        )}
      </PagerView>
      <TripSlider
        index={viewIndex}
        onPress={() => setViewIndex(prev => (prev === 1 ? 0 : 1))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  bodyContainer: {
    top: -20,
    marginBottom: -20,
    zIndex: 100,
    paddingTop: 16,
    backgroundColor: COLORS.shades[0],
    borderTopLeftRadius: RADIUS.s,
    borderTopRightRadius: RADIUS.s,
    shadowColor: COLORS.neutral[700],
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  image: {
    position: 'absolute',
    backgroundColor: COLORS.neutral[700],
    zIndex: 0,
    resizeMode: 'stretch',
    height: 240,
    width: Dimensions.get('window').width,
  },
  infoButton: {
    borderColor: COLORS.neutral[300],
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 12,
  },
  infoTile: {
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    height: 40,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: 12,
  },
  mainContainer: {
    zIndex: 2,
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
  addIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
  handler: {
    height: 7,
    width: 60,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: COLORS.shades[0],
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    top: -27,
  },
  dateDifferenceStyle: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.error[700],
  },
  memoryButton: {
    position: 'absolute',
    top: StatusBarManager.HEIGHT - (Platform.OS === 'android' ? 25 : 5),
    right: 20,
    zIndex: 10,
    borderWidth: 1,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
  },
  infoHeader: {
    width,
    paddingHorizontal: PADDING.s,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    top: -50,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.shades[100],
  },
});
