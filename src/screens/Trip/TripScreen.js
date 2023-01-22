import {
  View, StyleSheet, Image, Dimensions, TouchableOpacity, Pressable, RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import React, {
  useRef, useState, useEffect, useCallback,
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
import moment from 'moment';
import ImageCropPicker from 'react-native-image-crop-picker';
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
// import FAButton from '../../components/FAButton';
import activeTripStore from '../../stores/ActiveTripStore';
import UPDATE_TRIP from '../../mutations/updateTrip';
import httpService from '../../utils/httpService';
import InputModal from '../../components/InputModal';
import PollCarousel from '../../components/Polls/PollCarousel';
import GET_TRIP_BY_ID from '../../queries/getTripById';
import TripScreenSkeleton from './TripScreenSkeleton';
import FilterModal from '../../components/FilterModal';
import RoleChip from '../../components/RoleChip';
import userManagement from '../../utils/userManagement';
import DELETE_TRIP_BY_ID from '../../mutations/deleteTripById';

export default function TripScreen({ route }) {
  const { tripId } = route.params;
  const [getTripData, { error: fetchError, data: tripData, loading }] = useLazyQuery(GET_TRIP_BY_ID, {
    variables: {
      tripId,
    },
  });

  const now = Date.now() / 1000;

  const isActive = activeTrip?.dateRange.startDate < now && activeTrip?.dateRange.endDate > now;
  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);
  const [deleteTrip] = useMutation(DELETE_TRIP_BY_ID);
  const activeTrip = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const [currentTab, setCurrentTab] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [inputOpen, setInputOpen] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const addImageRef = useRef();

  const navigation = useNavigation();
  const data = activeTrip;
  const inactive = !data || loading;

  const isHost = userManagement.isHost();

  const { width } = Dimensions.get('window');

  const IMAGE_HEIGHT = 240;

  const menuOptions = {
    title: i18n.t('Trip options'),
    options: [
      {
        name: 'Change title',
        trailing: !isHost && <RoleChip isHost string={i18n.t('Must be host')} />,
        notAvailable: !isHost,
        onPress: () => {
          setTimeout(() => {
            setInputOpen('title');
          }, 300);
        },
      },
      {
        name: 'Change description',
        trailing: !isHost && <RoleChip isHost string={i18n.t('Must be host')} />,
        notAvailable: !isHost,
        onPress: () => {
          setTimeout(() => {
            setInputOpen('description');
          }, 300);
        },
      },
      {
        name: 'Change thumbnail',
        trailing: !isHost && <RoleChip isHost string={i18n.t('Must be host')} />,
        notAvailable: !isHost,
        onPress: () => {
          setTimeout(() => {
            addImageRef.current?.show();
          }, 300);
        },
      },
      {
        name: 'Copy invite link',
        onPress: () => {
          Clipboard.setString(`http://143.198.241.91:4000/redirect/invitation/${tripId}`);
          Toast.show({
            type: 'success',
            text1: i18n.t('Copied!'),
            text2: i18n.t('You can now send it to your friends'),
          });
        },
      },
      {
        name: 'Delete Trip',
        trailing: !isHost && <RoleChip isHost string={i18n.t('Must be host')} />,
        notAvailable: !isHost,
        onPress: () => handleDeleteTrip(),
        deleteAction: isHost,
      },
    ],
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTripData().then(() => setRefreshing(false)).catch(() => setRefreshing(false));
  }, []);

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
      // console.log(tripData);
      setActiveTrip(tripData.getTripById);
    }
  }, [error, fetchError, tripData]);

  useEffect(() => {
    if (tripId !== activeTrip.id) {
      getTripData();
    }
  }, [tripId]);

  const handleDeleteTrip = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Expense'),
      i18n.t(`Are you sure you want to delete '${data.title}' as an expense?`),
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
              text2: i18n.t('Expense was succeessfully deleted!'),
            });

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
    scrollRef.current?.scrollTo({ y: contentItems[index].yPos, animated: true });
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
    // eslint-disable-next-line no-unsafe-optional-chaining
    const toDate = moment(new Date(data?.dateRange?.startDate * 1000));
    const fromDate = moment().startOf('day');

    const difference = Math.round(moment.duration(toDate.diff(fromDate)).asDays());
    if (difference < 0) {
      return `${difference * -1} ${i18n.t('days ago')}`;
    }
    return `${i18n.t('In')} ${difference} ${i18n.t('days')}`;
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
      isDone: false,
      route: ROUTES.checklistScreen,
    },
  ];

  const contentItems = [
    {
      title: i18n.t('Polls'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.pollScreen)}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      omitPadding: true,
      onPress: () => navigation.navigate(ROUTES.pollScreen),
      content: data?.polls && (
      <PollCarousel
        style={{ marginHorizontal: PADDING.l, maxHeight: 220 }}
        data={data?.polls}
      />
      ),
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
        onPress={() => navigation.navigate(ROUTES.checklistScreen)}
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
        tileBackground={COLORS.shades[0]}
        onLayout={(e) => {
          console.log(`Invitees: ${e.nativeEvent.layout.y}`);
        }}
      />,
      yPos: 0,
    },
    {
      title: i18n.t('Travelers'),
      trailing: <Headline
        onPress={() => navigation.navigate(ROUTES.inviteeScreen)}
        type={4}
        text={i18n.t('see all')}
        color={COLORS.neutral[500]}
      />,
      content: <InviteeContainer
        onPress={() => navigation.navigate(ROUTES.inviteeScreen)}
        data={data?.activeMembers}
        onLayout={(e) => {
          console.log(`Invitees: ${e.nativeEvent.layout.y}`);
        }}
      />,
      yPos: 0,
    },
  ];

  const TopContent = () => (
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
            <Pressable
              onPress={() => setOptionsVisible(true)}
              style={styles.addIcon}
            >
              <FeatherIcon
                name="more-vertical"
                size={20}
                color={COLORS.neutral[700]}
              />
            </Pressable>
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
              icon={<AntIcon name="calendar" size={22} />}
              onPress={() => navigation.push(ROUTES.dateScreen)}
              backgroundColor={COLORS.shades[0]}
              textColor={COLORS.shades[100]}
              style={[data?.dateRange?.startDate ? styles.infoTile : styles.infoButton, { marginLeft: 14 }]}
            />
          </ScrollView>
          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}
            onPress={() => isHost && setInputOpen('description')}
          >
            {!data?.description && (
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
          </TouchableOpacity>
        </View>
        <Divider vertical={20} />
        <View style={styles.statusContainer}>
          <Headline
            type={3}
            text={i18n.t('Status')}
          />
          <Animatable.View
            style={[styles.dateDifferenceStyle, { backgroundColor: isActive ? COLORS.error[900] : COLORS.primary[700] }]}
            animation="pulse"
            iterationCount={isActive ? 'infinite' : 1}
          >
            <Headline
              type={4}
              text={isActive ? i18n.t('• live') : `${getDayDifference()}`}
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

  const MainContent = () => (
    <View style={styles.mainContainer}>
      {contentItems.map((item) => (
        <ListItem
          onPress={item.onPress}
          omitPadding={item.omitPadding}
          title={item.title}
          trailing={item.trailing}
        >
          {item.content}
        </ListItem>
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
          color={COLORS.shades[0]}
        />
        <Icon
          name="image"
          size={32}
          color={COLORS.shades[0]}
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
        maxHeight={380}
        scrollY={scrollY}
      >
        <TripHeader
          title={!inactive ? data?.title : i18n.t('Loading...')}
          id={data?.id}
          subtitle={`${Utils.getDateRange(data?.dateRange)}`}
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
        <Pressable style={{ height: IMAGE_HEIGHT }} onPress={() => (data ? addImageRef.current?.show() : null)} />
        {inactive && <View style={[styles.bodyContainer, { paddingHorizontal: PADDING.m, marginBottom: 60 }]}><TripScreenSkeleton /></View>}
        {!inactive && <TopContent />}
        {!inactive && <MainContent />}
      </Animated.ScrollView>
      <BackButton
        onPress={() => navigation.navigate(ROUTES.mainScreen)}
        style={{
          position: 'absolute', top: 47, left: 20, zIndex: 10,
        }}
      />
      <Button
        isSecondary
        style={{
          position: 'absolute', top: 47, right: 20, zIndex: 10,
        }}
        onPress={() => (data ? navigation.navigate(ROUTES.memoriesScreen, { tripId: data.id }) : null)}
        icon={(
          <Icon
            name="image"
            color={COLORS.neutral[700]}
            size={22}
          />
            )}
        fullWidth={false}
        color={COLORS.neutral[900]}
      />
      {/* <FAButton
        icon="chatbox-ellipses"
        onPress={() => navigation.push(ROUTES.chatScreen)}
      /> */}
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
        onRequestClose={() => setInputOpen(null)}
        onPress={(string) => (inputOpen === 'description' ? updateDescription(string) : updateTitle(string))}
      />
      <FilterModal
        isVisible={optionsVisible}
        onRequestClose={() => setOptionsVisible(false)}
        data={menuOptions}
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 25,
    index: 10,
  },
  bodyContainer: {
    top: -20,
    zIndex: 100,
    paddingTop: 16,
    backgroundColor: COLORS.shades[0],
    borderTopLeftRadius: RADIUS.s,
    borderTopRightRadius: RADIUS.s,
    shadowColor: COLORS.neutral[700],
    shadowRadius: 10,
    shadowOpacity: 0.1,
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
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.xl,
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
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
});
