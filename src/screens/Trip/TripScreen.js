import {
  View, StyleSheet, Image, Dimensions, Pressable, RefreshControl, Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import React, {
  useRef, useState, useEffect,
} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLazyQuery, useMutation } from '@apollo/client';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import { MenuView } from '@react-native-menu/menu';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
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
import QRModal from '../../components/Trip/QRModal';
import tripsStore from '../../stores/TripsStore';
import DocumentsContainer from '../../components/Trip/DocumentsContainer';
import AccentBubble from '../../components/Trip/AccentBubble';

export default function TripScreen({ route }) {
  // PARAMS
  const { tripId } = route.params;

  // QUERIES
  const [getTripData, { error: fetchError, data: tripData, loading }] = useLazyQuery(GET_TRIP_BY_ID, {
    variables: {
      tripId,
    },
    fetchPolicy: 'network-only',
  });

  // MUTATIONS
  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);
  const [deleteTrip] = useMutation(DELETE_TRIP_BY_ID);

  // STORES
  const activeTrip = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);
  const removeTrip = tripsStore((state) => state.removeTrip);

  // STATE & MISC
  const [currentTab, setCurrentTab] = useState(0);
  const [inputOpen, setInputOpen] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const addImageRef = useRef();
  const scrollRef = useRef();
  const documentsRef = useRef();
  const expensesRef = useRef();
  const pollsRef = useRef();
  const checklistRef = useRef();
  const travelersRef = useRef();

  const navigation = useNavigation();

  const contentRefs = [
    documentsRef,
    expensesRef,
    checklistRef,
    pollsRef,
    travelersRef,
  ];

  const IMAGE_HEIGHT = 240;
  const data = activeTrip.title !== undefined ? activeTrip : null;
  const inactive = !data || (loading && !refreshing);

  const isHost = userManagement.isHost();

  const themeColor = activeTrip.type === 'active' ? COLORS.error[900] : COLORS.primary[700];

  const { width } = Dimensions.get('window');

  const handleMenuOption = (input) => {
    const { event } = input;

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
      case 'copy':
        Clipboard.setString(`${META_DATA.baseUrl}/redirect/invitation/${tripId}`);
        Toast.show({
          type: 'success',
          text1: i18n.t('Copied!'),
          text2: i18n.t('You can now send it to your friends'),
        });
        break;
      case 'delete':
        handleDeleteTrip();
        break;
      case 'qr':
        setShowQR(true);
        break;

      default:
        break;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTripData().then(() => setRefreshing(false)).catch(() => setRefreshing(false));
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
      setActiveTrip(tripData.getTripById);
    }
  }, [error, fetchError, tripData]);

  useEffect(() => {
    getTripData();
  }, [tripId]);

  const handleDeleteTrip = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Trip'),
      i18n.t(`Are you sure you want to delete '${data?.title}' as an expense?`),
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
          .catch((e) => {
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

  const handleTabPress = (index) => {
    setCurrentTab(index);
    const headerHeight = 460;
    const ref = contentRefs[index];
    ref?.current.measure((_, fy) => {
      scrollRef.current?.scrollTo({ y: fy + headerHeight, animated: true });
    });
  };

  const handleAddImage = async (index) => {
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
      ImageCropPicker.openPicker(options).then(async (image) => {
        uploadImage(image);
      });
    }

    if (index === 2) {
      ImageCropPicker.openCamera(options).then(async (image) => {
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
    }).then(() => {
      updateActiveTrip({ thumbnailUri: '' });
    })
      .catch((e) => {
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        }, 500);
      });
  };

  const uploadImage = async (image) => {
    try {
      const { Location } = await httpService.uploadToS3(image.data);

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
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
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
  const updateTitle = async (title) => {
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
    updateActiveTrip({ title });

    await updateTrip({
      variables: {
        trip: {
          title,
          tripId: data.id,
        },
      },
    }).catch((e) => {
      updateActiveTrip({ description: oldTitle });
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
      return i18n.t('• live');
    }

    const difference = Utils.getDaysDifference(data?.dateRange.startDate);

    if (difference < 0) {
      return `${difference * -1} ${i18n.t('days ago')}`;
    }
    return `${i18n.t('In')} ${difference} ${difference === 1 ? i18n.t('day') : i18n.t('days')}`;
  };

  const checkTasksStatus = () => {
    if (!data) {
      return false;
    }

    const { mutualTasks, privateTasks } = data;
    const tasks = [...mutualTasks, ...privateTasks];

    if (tasks.length <= 0) {
      return false;
    }

    return tasks.filter((task) => task.isDone).length === tasks.length;
  };

  const statusData = [
    {
      name: i18n.t('Location'),
      isDone: data?.location,
      route: ROUTES.locationScreen,
    },
    {
      name: i18n.t('Date'),
      isDone: data?.dateRange?.startDate,
      route: ROUTES.dateScreen,
    },
    {
      name: i18n.t('Tasks'),
      isDone: checkTasksStatus(),
      route: ROUTES.checklistScreen,
    },
  ];

  const contentItems = [
    {
      title: i18n.t('Documents'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.documentsScreen)}
        type={4}
        style={{ textDecorationLine: 'underline' }}
        text={i18n.t('see all')}
        color={COLORS.neutral[300]}
      />,
      ref: documentsRef,
      omitPadding: true,
      content: data?.documents && (
        <DocumentsContainer
          data={data?.documents}
        />
      ),
    },
    {
      title: i18n.t('Expenses'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.expenseScreen, { expenses: data?.expenses || {}, tripId: data.id || '' })}
        type={4}
        style={{ textDecorationLine: 'underline' }}
        text={i18n.t('see all')}
        color={COLORS.neutral[300]}
      />,
      ref: expensesRef,
      content: <ExpensesContainer
        tileBackground={COLORS.shades[0]}
      />,
    },
    {
      title: i18n.t('Checklist'),
      trailing: <Headline
        ref={checklistRef}
        onPress={() => navigation.navigate(ROUTES.checklistScreen)}
        type={4}
        style={{ textDecorationLine: 'underline' }}
        text={i18n.t('see all')}
        color={COLORS.neutral[300]}
      />,
      ref: checklistRef,
      content: <ChecklistContainer
        onPress={() => navigation.navigate(ROUTES.checklistScreen)}
      />,
    },

    {
      title: i18n.t('Polls'),
      trailing: <Headline
        ref={pollsRef}
        onPress={() => navigation.navigate(ROUTES.pollScreen)}
        type={4}
        style={{ textDecorationLine: 'underline' }}
        text={i18n.t('see all')}
        color={COLORS.neutral[300]}
      />,
      ref: pollsRef,
      omitPadding: true,
      content: data?.polls && (
      <PollCarousel
        onPress={() => navigation.navigate(ROUTES.pollScreen)}
        data={data?.polls}
      />
      ),
    },
    {
      title: i18n.t('Travelers'),
      trailing: <Headline
        ref={travelersRef}
        onPress={() => navigation.navigate(ROUTES.inviteeScreen)}
        type={4}
        style={{ textDecorationLine: 'underline' }}
        text={i18n.t('see all')}
        color={COLORS.neutral[300]}
      />,
      ref: travelersRef,
      content: <InviteeContainer
        onPress={() => navigation.navigate(ROUTES.inviteeScreen)}
        data={data?.activeMembers}
        onLayout={(e) => {
          console.log(`Invitees: ${e.nativeEvent.layout.y}`);
        }}
      />,
    },
  ];

  const getTopContent = () => (
    <>
      <View style={styles.handler} />
      <View style={styles.bodyContainer}>
        <View style={{ paddingHorizontal: PADDING.l }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Headline
              onPress={() => isHost && setInputOpen('title')}
              type={2}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flex: 1 }}
              text={data?.title}
            />

            <MenuView
              style={styles.addIcon}
              onPressAction={({ nativeEvent }) => handleMenuOption(nativeEvent)}
              actions={[
                {
                  id: 'edit',
                  title: i18n.t('Edit Trip'),
                  subactions: [
                    {
                      id: 'editTitle',
                      title: i18n.t('Edit title'),
                      attributes: {
                        disabled: !isHost,
                      },
                    },
                    {
                      id: 'editDescription',
                      title: i18n.t('Edit description'),
                      attributes: {
                        disabled: !isHost,
                      },
                    },
                    {
                      id: 'editThumbnail',
                      title: i18n.t('Edit thumbnail'),
                      attributes: {
                        disabled: !isHost,
                      },
                    },
                    {
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
                    },
                  ],
                },
                {
                  id: 'copy',
                  title: i18n.t('Copy invite link'),
                  image: Platform.select({
                    ios: 'square.and.arrow.up',
                    android: 'ic_menu_share',
                  }),
                },
                {
                  id: 'qr',
                  title: i18n.t('Show QR Code'),
                  image: Platform.select({
                    ios: 'qrcode',
                  }),
                },

              ]}
            >
              <FeatherIcon
                name="more-vertical"
                size={20}
                color={COLORS.neutral[700]}
              />
            </MenuView>

          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
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
              text={data?.location?.placeName.split(', ')[0] || i18n.t('Set location')}
              fullWidth={false}
              icon="location-pin"
              onPress={() => navigation.push(ROUTES.locationScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={data?.location ? styles.infoTile : styles.infoButton}
            />
            <Button
              isSecondary
              text={data?.dateRange?.startDate ? Utils.getDateRange(data.dateRange) : i18n.t('Find date')}
              fullWidth={false}
              icon={<AntIcon name="calendar" size={18} />}
              onPress={() => navigation.push(ROUTES.dateScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={[data?.dateRange?.startDate ? styles.infoTile : styles.infoButton, { marginLeft: 14 }]}
            />
          </ScrollView>
          <Pressable
            style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}
            onPress={() => isHost && setInputOpen('description')}
          >
            {!data?.description && isHost && (
            <Icon
              size={16}
              color={COLORS.neutral[300]}
              name="pencil-sharp"
            />
            )}
            <Body
              type={1}
              text={data?.description || i18n.t('Add a description to the trip 😎')}
              style={{ marginLeft: 4, color: COLORS.neutral[300] }}
            />
          </Pressable>
        </View>
        <Divider vertical={20} />
        <View style={styles.statusContainer}>
          <Headline
            type={3}
            text={i18n.t('Status')}
          />
          <Animatable.View
            style={[styles.dateDifferenceStyle, { backgroundColor: themeColor }]}
            animation="pulse"
            iterationCount={activeTrip.type === 'active' ? 'infinite' : 1}
          >
            <Headline
              type={4}
              text={getDayDifference()}
              style={{ fontWeight: '600', fontSize: 16 }}
              color={COLORS.shades[0]}
            />
          </Animatable.View>
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
        <View ref={item.ref}>
          <ListItem
            onPress={item.onPress}
            omitPadding={item.omitPadding}
            title={item.title}
            trailing={item.trailing}
          >
            {item.content}
          </ListItem>
        </View>
      ))}
    </View>
  );

  const getHeaderImage = () => (
    <Animated.View style={{
      backgroundColor: COLORS.shades[100],
      position: 'absolute',
      zIndex: 0,
      height: IMAGE_HEIGHT,
      width,
      transform: [{
        translateY: scrollY.interpolate({
          inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
          outputRange: [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT / 3],
        }),
        scale: scrollY.interpolate({
          inputRange: [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
          outputRange: [2, 1, 1],
        }),
      }],
    }}
    >
      <Image
        style={styles.image}
        resizeMode="cover"
        source={DefaultImage}
        blurRadius={5}
      />
      {!inactive && (
      <View style={styles.addImage}>
        <Headline
          type={3}
          text={i18n.t('Add Trip Image')}
          color="white"
        />
        <Icon
          name="image"
          size={32}
          color="white"
        />
      </View>
      )}
      {data?.thumbnailUri && (
      <FastImage
        style={styles.image}
        resizeMode="center"
        source={{ uri: data.thumbnailUri }}
      />
      )}
    </Animated.View>
  );

  return (
    <View style={{ backgroundColor: COLORS.shades[0], flex: 1 }}>
      <AnimatedHeader
        style={{ height: 170 }}
        scrollDistance={480}
        threshold={1.2}
        scrollY={scrollY}
      >
        <TripHeader
          title={!inactive ? data?.title : i18n.t('Loading...')}
          id={data?.id}
          isActive={activeTrip.type === 'active'}
          subtitle={`${data?.location.placeName.split(',')[0]}`}
          items={contentItems}
          onPress={(index) => handleTabPress(index)}
          currentTab={currentTab}
        />
      </AnimatedHeader>
      {getHeaderImage()}
      <Animated.ScrollView
        refreshControl={(
          <RefreshControl
            enabled={data}
            progressViewOffset={50}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          )}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <Pressable style={{ height: IMAGE_HEIGHT }} onPress={() => (data && isHost ? addImageRef.current?.show() : null)} />
        {inactive && <View style={[styles.bodyContainer, { paddingHorizontal: PADDING.m, marginBottom: 60 }]}><TripScreenSkeleton /></View>}
        {!inactive && getTopContent()}
        {!inactive && getMainContent()}
      </Animated.ScrollView>
      <BackButton
        onPress={() => navigation.navigate(ROUTES.mainScreen)}
        style={{
          position: 'absolute', top: 47, left: 20, zIndex: 10,
        }}
      />
      <Pressable
        onPress={() => (data ? navigation.navigate(ROUTES.memoriesScreen, { tripId: data.id }) : null)}
        style={styles.memoryButton}
      >
        {data?.type === 'active' && data?.userFreeImages > 0 && (
          <AccentBubble
            style={{ position: 'absolute', right: -4, top: -6 }}
            text={data?.userFreeImages}
          />
        )}
        <Icon
          name="image"
          color={COLORS.neutral[700]}
          size={22}
        />

      </Pressable>
      <ActionSheet
        ref={addImageRef}
        title={i18n.t('Choose an option')}
        options={['Cancel', i18n.t('Choose from Camera Roll'), i18n.t('Take a picture'), i18n.t('Reset image')]}
        cancelButtonIndex={0}
        onPress={(index) => handleAddImage(index)}
      />
      <InputModal
        isVisible={inputOpen}
        placeholder={inputOpen === 'description' ? i18n.t('Enter description') : i18n.t('Enter title')}
        initalValue={inputOpen === 'description' ? data?.description : data?.title}
        onRequestClose={() => setInputOpen(null)}
        multiline={inputOpen === 'description'}
        maxLength={inputOpen === 'description' ? 100 : 20}
        onPress={(string) => (inputOpen === 'description' ? updateDescription(string) : updateTitle(string))}
      />
      <QRModal
        isVisible={showQR}
        onRequestClose={() => setShowQR(false)}
        value={`${META_DATA.baseUrl}/redirect/invitation/${tripId}`}
      />
    </View>
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
    top: 47,
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
});
