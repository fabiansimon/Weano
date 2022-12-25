import {
  View, StyleSheet, Image, Dimensions, TouchableOpacity, Pressable, RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import React, {
  useRef, useState, useEffect, useCallback,
} from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLazyQuery, useMutation } from '@apollo/client';
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
import ROUTES from '../../constants/Routes';
import StatusContainer from '../../components/Trip/StatusContainer';
import ExpensesContainer from '../../components/Trip/ExpenseContainer';
import FAButton from '../../components/FAButton';
import activeTripStore from '../../stores/ActiveTripStore';
import UPDATE_TRIP from '../../mutations/updateTrip';
import httpService from '../../utils/httpService';
import InputModal from '../../components/InputModal';
import PollCarousel from '../../components/Polls/PollCarousel';
import GET_TRIP_BY_ID from '../../queries/getTripById';

export default function TripScreen({ route }) {
  const { tripId } = route.params;
  const [getTripData, { error: fetchError, data: tripData }] = useLazyQuery(GET_TRIP_BY_ID, {
    variables: {
      tripId,
    },
  });

  const isActive = false;
  const [updateTrip, { error }] = useMutation(UPDATE_TRIP);
  const activeTrip = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const setActiveTrip = activeTripStore((state) => state.setActiveTrip);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const [currentTab, setCurrentTab] = useState(0);
  const [inputOpen, setInputOpen] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const addImageRef = useRef();

  const navigation = useNavigation();
  const data = activeTrip;

  const { width } = Dimensions.get('window');

  const IMAGE_HEIGHT = 240;

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
      setActiveTrip(tripData.getTripById);
    }
  }, [error, fetchError, tripData]);

  useEffect(() => {
    if (tripId !== activeTrip.id) {
      getTripData();
    }
  }, [tripId]);

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
        setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        }, 500);
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

    setInputOpen(false);
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
        style={{ marginHorizontal: PADDING.m, maxHeight: 300 }}
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

  const TopContent = () => (
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
            text={data.location?.placeName || i18n.t('Set location')}
            fullWidth={false}
            icon="location-pin"
            onPress={() => navigation.push(ROUTES.locationScreen)}
            backgroundColor={COLORS.shades[0]}
            textColor={COLORS.shades[100]}
            style={data.location ? styles.infoTile : styles.infoButton}
          />
          <Button
            isSecondary
            text={data.dateRange?.startDate ? Utils.getDateRange(data.dateRange) : i18n.t('Find date')}
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
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Headline
            type={4}
            text={isActive ? i18n.t('• live') : i18n.t('21 days left')}
            style={{ fontWeight: '600', fontSize: 16 }}
            color={isActive ? COLORS.error[900] : COLORS.primary[700]}
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

  const HeaderImage = () => (
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
        resizeMode={data.thumbnailUri ? 'center' : 'cover'}
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
    </Animated.View>
  );

  return (
    !data
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
              id={data.id}
              subtitle={`${Utils.getDateRange(data?.dateRange)}`}
              items={contentItems}
              onPress={(index) => handleTabPress(index)}
              currentTab={currentTab}
            />
          </AnimatedHeader>
          <HeaderImage />
          <Animated.ScrollView
            refreshControl={(
              <RefreshControl
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
            <Pressable style={{ height: IMAGE_HEIGHT }} onPress={() => addImageRef.current?.show()} />
            <TopContent />
            <MainContent />
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
            onPress={() => navigation.navigate(ROUTES.memoriesScreen, { tripId: data.id })}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
});
