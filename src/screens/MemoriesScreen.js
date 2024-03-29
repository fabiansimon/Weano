import {
  FlatList,
  StyleSheet,
  View,
  StatusBar,
  Pressable,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntIcon from 'react-native-vector-icons/Entypo';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import Animated, {sub} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {useLazyQuery, useQuery} from '@apollo/client';
import Toast from 'react-native-toast-message';
import {MenuView} from '@react-native-menu/menu';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import ImageContainer from '../components/Trip/ImageContainer';
import Body from '../components/typography/Body';
import GET_IMAGES_FROM_TRIP from '../queries/getImagesFromTrip';
import StoryModal from '../components/StoryModal';
import ROUTES from '../constants/Routes';
import Utils from '../utils';
import BackButton from '../components/BackButton';
import months from '../constants/Months';
import AnimatedHeader from '../components/AnimatedHeader';
import activeTripStore from '../stores/ActiveTripStore';
import AccentBubble from '../components/Trip/AccentBubble';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import PremiumController from '../PremiumController';
import userStore from '../stores/UserStore';
import MemoriesSkeleton from '../components/MemoriesSkeleton';
import tripsStore from '../stores/TripsStore';

const asyncStorageDAO = new AsyncStorageDAO();

export default function MemoriesScreen({route}) {
  // PARAMS
  const {tripId, initShowStory} = route.params;

  // QUERIES
  const {error, data} = useQuery(GET_IMAGES_FROM_TRIP, {
    variables: {
      tripId,
    },
    fetchPolicy: 'network-only',
  });
  const [getImagesFromTrip, {data: updatedData}] = useLazyQuery(
    GET_IMAGES_FROM_TRIP,
    {
      variables: {
        tripId,
      },
      fetchPolicy: 'network-only',
    },
  );

  // STORES
  const {images, userFreeImages} = activeTripStore(state => state.activeTrip);
  const trips = tripsStore(state => state.trips);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const {isProMember, id: userId} = userStore(state => state.user);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [dateSelection, setDateSelection] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [storyVisible, setStoryVisible] = useState(false);
  const [initalIndex, setInitalIndex] = useState(0);
  const [downloadIndex, setDownloadIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getImagesFromTrip()
      .then(() => {
        const {getImagesFromTrip: imageData} = updatedData;
        updateTripState(imageData.images, imageData.userFreeImages);
        setRefreshing(false);
      })
      .catch(() => setRefreshing(false));
  };

  const navigation = useNavigation();

  useEffect(() => {
    if (initShowStory && images?.length > 0) {
      // setStoryVisible(true);
    }
  }, [initShowStory]);

  useEffect(() => {
    if (data) {
      const {getImagesFromTrip: imageData} = data;
      updateTripState(imageData.images, imageData.userFreeImages);
      setIsLoading(false);
    }

    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
      setIsLoading(false);
    }
  }, [data, error]);

  useEffect(() => {
    if (images) {
      setDateSelection([
        {
          title: i18n.t('All images'),
          images,
        },
        ...sortArr(images),
      ]);
    }
  }, [images]);

  const updateTripState = (imageData, freeImagesData) =>
    updateActiveTrip({images: imageData, userFreeImages: freeImagesData});

  const sortArr = arr => {
    const dataSet = [];

    for (let i = 0; i < arr.length; i += 1) {
      const datestamp = Utils.getDateFromTimestamp(
        arr[i].timestamp || arr[i].createdAt / 1000,
        'DDMMYY',
      );
      const setSection = getMonthString(datestamp);

      const index = dataSet.findIndex(d => d.title === setSection);

      if (index < 0) {
        dataSet.push({
          title: setSection,
          images: [arr[i]],
        });
      } else {
        dataSet[index].images.push(arr[i]);
      }
    }
    return dataSet;
  };

  const getMonthString = month => {
    const day = month.slice(0, 2);
    let mm;
    if (month[2] === '0') {
      mm = month.slice(3, 4);
    } else {
      mm = month.slice(2, 4);
    }

    return `${day} ${months[mm - 1]} 20${month.slice(4, 6)}`;
  };

  const getActions = () => {
    const timeline = {
      id: 'timeline',
      title: i18n.t('See Timeline'),
    };

    const trip = {
      id: 'trip',
      title: i18n.t('Go to Trip'),
    };

    const download = {
      id: 'download',
      title: i18n.t('Download Album'),
      image: Platform.select({
        ios: 'folder',
      }),
    };

    if (images && images.length <= 0) {
      return [timeline, trip];
    }
    return [timeline, trip, download];
  };

  const handleMenuOption = async ({event}) => {
    if (event === 'trip') {
      return navigation.navigate(ROUTES.tripScreen, {tripId});
    }

    if (event === 'timeline') {
      return navigation.navigate(ROUTES.timelineScreen, {tripId});
    }

    if (event === 'download') {
      if (images.length <= 0) {
        return;
      }
      setDownloadIndex(0);
      for (let i = 0; i < images.length; i += 1) {
        const {uri} = images[i];

        await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'png',
        })
          .fetch('GET', uri)
          .then(res => {
            const isLast = i === images.length - 1;
            Utils.downloadImage(res.data, !!isLast, true, getTripData().title);
            setDownloadIndex(isLast ? null : i);
          })
          .catch(e => {
            Toast.show({
              type: 'error',
              text1: i18n.t('Whoops!'),
              text2: e.message,
            });
            setDownloadIndex(null);
          });
      }
    }

    const usageLimit = JSON.parse(
      isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).images;
    if (images?.length >= usageLimit) {
      return PremiumController.showModal(isProMember);
    }

    if (event === 'take') {
      return navigation.push(ROUTES.cameraScreen, {
        tripId,
        onNavBack: () => navigation.goBack(),
      });
    }

    if (event === 'select') {
      const options = {
        compressImageQuality: 0.2,
        mediaType: 'photo',
        includeBase64: true,
      };

      ImageCropPicker.openPicker(options).then(async image => {
        navigation.push(ROUTES.cameraScreen, {
          tripId,
          onNavBack: () => navigation.goBack(),
          preselectedImage: image,
        });
      });
    }
  };

  const getDateSelection = () => (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: PADDING.m}}
      style={{marginHorizontal: -PADDING.m}}
      horizontal>
      {dateSelection?.map((item, index) => {
        const isSelected = dateIndex === index;
        const backgroundColor = isSelected ? COLORS.shades[0] : 'transparent';
        const color = isSelected ? COLORS.shades[100] : COLORS.neutral[50];
        const borderColor = isSelected
          ? 'transparent'
          : Utils.addAlpha(COLORS.neutral[50], 0.1);
        return (
          <Pressable
            onPress={() => setDateIndex(index)}
            style={{
              flex: null,
              borderRadius: 100,
              backgroundColor,
              borderColor,
              borderWidth: 0.5,
              paddingHorizontal: 13,
              paddingVertical: 8,
              marginRight: 4,
            }}>
            <Body type={2} color={color} text={item.title} />
          </Pressable>
        );
      })}
    </ScrollView>
  );

  const getTripData = useCallback(() => {
    const {
      type,
      destinations,
      dateRange: {startDate, endDate},
      title,
    } = trips.find(trip => trip.id === tripId);

    let subtitle;
    const location = destinations[0].placeName.split(',');
    const destination = location[location.length - 1].trim();

    const diff = Utils.getDaysDifference(startDate, null, false);

    if (type === 'active') {
      const activeDiff = Utils.getDaysDifference(startDate, endDate, true);
      subtitle = `${destination}, ${activeDiff} ${i18n.t('days left')}`;
    } else if (diff > 0) {
      subtitle = `${destination}, ${i18n.t('in')} ${diff} ${i18n.t('days')}`;
    } else {
      subtitle = `${destination}, ${Math.abs(diff)} ${i18n.t('days ago')}`;
    }

    return {
      title,
      subtitle,
    };
  }, [tripId]);

  const getHeader = () => {
    const shadow = {
      shadowOpacity: 1,
      shadowColor: COLORS.shades[100],
      shadowRadius: 10,
    };

    return (
      <SafeAreaView style={styles.header}>
        <BackButton
          iconColor={COLORS.shades[0]}
          isClear
          onPress={() => downloadIndex === null && navigation.goBack()}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 4,
            marginBottom: 4,
          }}>
          <View style={{flex: 1}}>
            <Headline
              type={3}
              style={shadow}
              color={COLORS.shades[0]}
              text={getTripData().title}
            />
            <Body
              type={2}
              style={shadow}
              color={Utils.addAlpha(COLORS.neutral[50], 0.7)}
              text={getTripData().subtitle}
            />
          </View>
          <View style={{flexDirection: 'row', top: -10}}>
            {!isLoading && (
              <MenuView
                style={styles.addIcon}
                onPressAction={({nativeEvent}) => handleMenuOption(nativeEvent)}
                actions={getActions()}>
                <View style={styles.roundButton}>
                  <FeatherIcon
                    name="more-vertical"
                    color={COLORS.shades[0]}
                    size={20}
                  />
                </View>
              </MenuView>
            )}
            {images && images.length > 0 && (
              <Pressable
                onPress={() => {
                  setInitalIndex(0);
                  setStoryVisible(true);
                }}
                style={[styles.roundButton, {marginLeft: 5}]}>
                <EntIcon
                  name="controller-play"
                  style={{marginRight: -2}}
                  color={COLORS.shades[0]}
                  size={22}
                />
              </Pressable>
            )}
          </View>
        </View>
        {images && images.length > 0 && (
          <View
            style={{
              marginTop: 10,
              marginBottom: Platform.OS === 'android' ? 20 : 0,
            }}>
            {getDateSelection()}
          </View>
        )}
      </SafeAreaView>
    );
  };

  const getImageTile = (image, index) => {
    const isLeft = index % 1;
    const {
      author: {_id: creatorId},
    } = image;

    return (
      <ImageContainer
        cacheImage={index < 20}
        tripId={tripId}
        onPress={() => {
          setInitalIndex(images?.findIndex(img => img._id === image._id) || 0);
          setStoryVisible(true);
        }}
        onDelete={
          creatorId === userId
            ? id => {
                updateActiveTrip({
                  images: images.filter(i => i._id !== id),
                  userFreeImages: userFreeImages + 1,
                });
              }
            : null
        }
        style={{marginLeft: isLeft ? 0 : 4, marginTop: 4}}
        image={image}
      />
    );
  };

  const getDownloadContainer = () => {
    const percentage = (downloadIndex / images.length) * 100;
    return (
      <View style={styles.loadingContainer}>
        <SafeAreaView edges={['bottom']}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Body
              type={1}
              text={i18n.t('Downloading')}
              color={COLORS.shades[0]}
            />
            <Body
              type={2}
              style={{marginLeft: 8}}
              text={`${downloadIndex + 1}/${images.length} ${i18n.t('image')}`}
              color={COLORS.shades[0]}
            />
          </View>
          <View style={styles.loadingBar}>
            <View style={[styles.progressBar, {width: `${percentage}%`}]} />
          </View>
        </SafeAreaView>
      </View>
    );
  };

  const getFAB = useCallback(() => {
    const isDisabled = userFreeImages <= 0;
    return (
      <MenuView
        style={styles.fabContainer}
        onPressAction={({nativeEvent}) => handleMenuOption(nativeEvent)}
        actions={[
          {
            id: 'select',
            title: i18n.t('Select from Cameraroll'),
            attributes: {
              disabled: isDisabled,
            },
            image: Platform.select({
              ios: 'photo',
            }),
          },
          {
            id: 'take',
            title: i18n.t('Take a picture'),
            attributes: {
              disabled: isDisabled,
            },
            image: Platform.select({
              ios: 'camera',
            }),
          },
        ]}>
        {isDisabled ? (
          <View
            activeOpacity={0.5}
            style={[
              styles.fab,
              {backgroundColor: Utils.addAlpha(COLORS.primary[700], 0.3)},
            ]}>
            <AccentBubble
              disabled
              text={userFreeImages}
              style={{position: 'absolute', right: -2, top: -2}}
            />
            <EntIcon name="camera" size={22} color={COLORS.shades[0]} />
          </View>
        ) : (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={[styles.fab, {backgroundColor: COLORS.primary[700]}]}>
            <AccentBubble
              style={{position: 'absolute', right: -2, top: -2}}
              text={userFreeImages}
            />
            <EntIcon name="camera" size={22} color={COLORS.shades[0]} />
          </Animatable.View>
        )}
      </MenuView>
    );
  }, [userFreeImages]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {images && images.length > 0 && (
          <AnimatedHeader
            scrollY={scrollY}
            maxHeight={110}
            minHeight={10}
            style={{backgroundColor: COLORS.neutral[900], shadowOpacity: 0.85}}>
            <SafeAreaView
              style={{
                width: '100%',
                paddingTop: 10,
                paddingBottom: -24,
                paddingHorizontal: PADDING.m,
              }}>
              {getDateSelection()}
            </SafeAreaView>
          </AnimatedHeader>
        )}
        <Animated.ScrollView
          refreshControl={
            <RefreshControl
              progressViewOffset={50}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}>
          {getHeader()}
          {isLoading ? (
            <MemoriesSkeleton />
          ) : (
            <FlatList
              removeClippedSubviews
              showsVertiacalScrollIndicator={false}
              // eslint-disable-next-line react/no-unstable-nested-components
              ListEmptyComponent={() => (
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '60%',
                  }}>
                  <Body
                    type={1}
                    text={i18n.t('No memories captured yet')}
                    style={{marginBottom: 4}}
                    color={COLORS.shades[0]}
                  />
                  <Body
                    type={2}
                    text={i18n.t(
                      "You will get a notification as soon as it's time to snap some memories 📸 ",
                    )}
                    style={{maxWidth: '80%', textAlign: 'center'}}
                    color={COLORS.neutral[500]}
                  />
                </View>
              )}
              data={dateSelection && dateSelection[dateIndex]?.images}
              style={{marginTop: -14, paddingBottom: 100}}
              renderItem={({item, index}) => getImageTile(item, index)}
              numColumns={3}
            />
          )}
        </Animated.ScrollView>

        {downloadIndex !== null && getDownloadContainer()}
        {getFAB()}
        <StoryModal
          initalIndex={initalIndex}
          data={images}
          onRequestClose={() => {
            setStoryVisible(false);
            setInitalIndex(0);
          }}
          isVisible={storyVisible}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[900],
  },
  fab: {
    borderRadius: RADIUS.xl,
    height: 50,
    width: 50,
    shadowOffset: {},
    shadowOpacity: 0.05,
    shadowColor: COLORS.shades[100],
    backgroundColor: COLORS.shades[0],
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: PADDING.m,
  },
  roundButton: {
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: COLORS.shades[100],
  },
  loadingContainer: {
    height: 105,
    paddingTop: 10,
    paddingHorizontal: PADDING.m,
    width: '100%',
    zIndex: 10,
    backgroundColor: COLORS.primary[700],
    position: 'absolute',
    bottom: 0,
  },
  loadingBar: {
    marginTop: 15,
    marginBottom: 10,
    height: 5,
    borderRadius: RADIUS.xl,
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.1),
  },
  progressBar: {
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.xl,
    height: 5,
  },
  fabContainer: {
    height: 50,
    width: 50,
    bottom: 40,
    right: PADDING.xl,
    position: 'absolute',
  },
});
