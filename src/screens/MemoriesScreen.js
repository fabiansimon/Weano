import {
  FlatList, StyleSheet, View, StatusBar, Pressable, Platform, ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntIcon from 'react-native-vector-icons/Entypo';
import React, { useState, useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
import { MenuView } from '@react-native-menu/menu';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import ImageContainer from '../components/Trip/ImageContainer';
import Body from '../components/typography/Body';
import GET_IMAGES_FROM_TRIP from '../queries/getImagesFromTrip';
import StoryModal from '../components/StoryModal';
import ROUTES from '../constants/Routes';
import Label from '../components/typography/Label';
import Utils from '../utils';
import BackButton from '../components/BackButton';
import months from '../constants/Months';
import AnimatedHeader from '../components/AnimatedHeader';

export default function MemoriesScreen({ route }) {
  // PARAMS
  const { tripId, initShowStory } = route.params;

  // QUERIES
  const { error, data } = useQuery(GET_IMAGES_FROM_TRIP, {
    variables: {
      tripId,
    },
  });

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [images, setImages] = useState([]);
  const [freeImages, setFreeImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dateSelection, setDateSelection] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [storyVisible, setStoryVisible] = useState(false);
  const [initalIndex, setInitalIndex] = useState(0);
  const [downloadIndex, setDownloadIndex] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (initShowStory) {
      setStoryVisible(true);
    }
  }, [initShowStory]);

  useEffect(() => {
    if (data) {
      const { getImagesFromTrip: imageData } = data;
      // setImages(imageData.images.slice(0, 20));
      setImages(imageData.images);
      setFreeImage(imageData.userFreeImages);
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
      setDateSelection([{
        title: i18n.t('All images'),
        images,
      }, ...sortArr(images)]);
    }
  }, [images]);
  const sortArr = (arr) => {
    const dataSet = [];

    for (let i = 0; i < arr.length; i += 1) {
      const datestamp = Utils.getDateFromTimestamp(arr[i].createdAt / 1000, 'DDMMYY');
      const setSection = getMonthString(datestamp);

      const index = dataSet.findIndex((d) => d.title === setSection);

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

  const getMonthString = (month) => {
    const day = month.slice(0, 2);
    let mm;
    if (month[2] === '0') {
      mm = month.slice(3, 4);
    } else {
      mm = month.slice(2, 4);
    }

    return `${day} ${months[mm - 1]} 20${month.slice(3, 5)}`;
  };

  const handleMenuOption = async ({ event }) => {
    if (event === 'trip') {
      return navigation.navigate(ROUTES.tripScreen, { tripId });
    }

    if (event === 'timeline') {
      return navigation.navigate(ROUTES.timelineScreen, { tripId });
    }

    if (event === 'take') {
      return navigation.navigate(ROUTES.cameraScreen, { tripId, onNavBack: () => navigation.goBack() });
    }

    if (event === 'select') {
      const options = {
        compressImageQuality: 0.2,
        mediaType: 'photo',
        includeBase64: true,
      };

      ImageCropPicker.openPicker(options).then(async (image) => {
        navigation.navigate(ROUTES.cameraScreen, { tripId, onNavBack: () => navigation.goBack(), preselectedImage: image });
      });
    }

    if (event === 'download') {
      setDownloadIndex(0);
      for (let i = 0; i < images.length; i += 1) {
        const { uri } = images[i];
        // eslint-disable-next-line no-await-in-loop
        await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'png',
        // eslint-disable-next-line no-loop-func
        }).fetch('GET', uri).then((res) => {
          const isLast = i === images.length - 1;
          Utils.downloadImage(res.data, !!isLast);
          setDownloadIndex(isLast ? null : i);
        }).catch((e) => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
          setDownloadIndex(null);
        });
      }
    }
  };

  const getDateSelection = () => (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: PADDING.m }}
      style={{ marginHorizontal: -PADDING.m }}
      horizontal
    >
      {dateSelection?.map((item, index) => {
        const isSelected = dateIndex === index;
        const backgroundColor = isSelected ? COLORS.shades[0] : 'transparent';
        const color = isSelected ? COLORS.shades[100] : COLORS.neutral[50];
        return (
          <Pressable
            onPress={() => setDateIndex(index)}
            style={{
              flex: null,
              borderRadius: 100,
              backgroundColor,
              paddingHorizontal: 13,
              paddingVertical: 8,
              marginRight: 5,
            }}
          >
            <Body
              type={1}
              color={color}
              text={item.title}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Headline
            type={2}
            style={shadow}
            color={COLORS.shades[0]}
            text={i18n.t('Moments')}
          />
          {images.length > 0 && (
            <View style={{ flexDirection: 'row', top: -10 }}>
              <Pressable
                onPress={() => {
                  console.log('refresh');
                }}
                style={[styles.roundButton, { marginRight: 5 }]}
              >
                <IonIcon
                  name="refresh"
                  style={{ marginRight: -2 }}
                  color={COLORS.shades[0]}
                  size={22}
                />
              </Pressable>
              {!isLoading && (
              <MenuView
                style={styles.addIcon}
                onPressAction={({ nativeEvent }) => handleMenuOption(nativeEvent)}
                actions={[
                  {
                    id: 'timeline',
                    title: i18n.t('See Timeline'),
                  },
                  {
                    id: 'trip',
                    title: i18n.t('Go to Trip'),
                  },
                  {
                    id: 'share',
                    title: i18n.t('Share Collage'),
                    image: Platform.select({
                      ios: 'square.and.arrow.up',
                    }),
                  },
                  {
                    id: 'download',
                    title: i18n.t('Download Album'),
                    image: Platform.select({
                      ios: 'folder',
                    }),
                  },
                ]}
              >
                <View
                  style={styles.roundButton}
                >
                  <FeatherIcon
                    name="more-vertical"
                    color={COLORS.shades[0]}
                    size={20}
                  />
                </View>
              </MenuView>
              )}
              <Pressable
                onPress={() => {
                  setInitalIndex(0);
                  setStoryVisible(true);
                }}
                style={[styles.roundButton, { marginLeft: 5 }]}
              >
                <EntIcon
                  name="controller-play"
                  style={{ marginRight: -2 }}
                  color={COLORS.shades[0]}
                  size={22}
                />
              </Pressable>
            </View>
          )}
        </View>
        {images.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {getDateSelection()}
        </View>
        )}
      </SafeAreaView>
    );
  };

  const getImageTile = (image, index) => {
    const isLeft = index % 1;
    return (
      <ImageContainer
        cacheImage={index < 30}
        tripId={tripId}
        onPress={() => {
          setInitalIndex(images.findIndex((img) => img._id === image._id));
          setStoryVisible(true);
        }}
        onDelete={(id) => {
          setImages((prev) => prev.filter((i) => i._id !== id));
          setFreeImage((prev) => prev + 1);
        }}
        style={{ marginLeft: isLeft ? 0 : 10, marginTop: 10 }}
        image={image}
      />
    );
  };

  const getDownloadContainer = () => {
    const percentage = (downloadIndex / images.length) * 100;
    return (
      <View style={styles.loadingContainer}>
        <SafeAreaView edges={['bottom']}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Body
              type={1}
              text={i18n.t('Downloading')}
              color={COLORS.shades[0]}
            />
            <Body
              type={2}
              style={{ marginLeft: 8 }}
              text={`${downloadIndex + 1}/${images.length} ${i18n.t('image')}`}
              color={COLORS.shades[0]}
            />
          </View>
          <View style={styles.loadingBar}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          </View>

        </SafeAreaView>
      </View>
    );
  };

  const getFAB = () => (
    freeImages > 0 ? (
      <MenuView
        style={styles.fabContainer}
        onPressAction={({ nativeEvent }) => handleMenuOption(nativeEvent)}
        actions={[
          {
            id: 'take',
            title: i18n.t('Take a picture'),
            image: Platform.select({
              ios: 'camera',
            }),
          },
          {
            id: 'select',
            title: i18n.t('Select from Cameraroll'),
            image: Platform.select({
              ios: 'photo',
            }),
          },
        ]}
      >
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          style={[styles.fab, { backgroundColor: COLORS.primary[700] }]}
        >
          <View
            style={styles.imagesLeftContainer}
          >
            <Label
              type={1}
              color={COLORS.shades[0]}
              style={{ marginRight: -1 }}
              text={freeImages}
            />
          </View>
          <EntIcon
            name="camera"
            size={22}
            color={COLORS.shades[0]}
          />
        </Animatable.View>
      </MenuView>
    )
      : (
        <View
          animation="pulse"
          iterationCount="infinite"
          activeOpacity={0.5}
          style={[styles.fab, styles.fabContainer, { backgroundColor: Utils.addAlpha(COLORS.primary[700], 0.3) }]}
        >
          <View
            style={[styles.imagesLeftContainer, { backgroundColor: Utils.addAlpha(COLORS.error[900], 0.3) }]}
          >
            <Label
              type={1}
              color={COLORS.shades[0]}
              style={{ marginRight: -1 }}
              text={freeImages}
            />
          </View>
          <EntIcon
            name="camera"
            size={22}
            color={COLORS.shades[0]}
          />
        </View>
      )

  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {images.length > 0 && (
        <AnimatedHeader
          scrollY={scrollY}
          maxHeight={110}
          minHeight={10}
          style={{ backgroundColor: COLORS.neutral[900], shadowOpacity: 0.85 }}
        >
          <SafeAreaView style={{
            width: '100%',
            paddingTop: 10,
            paddingBottom: -24,
            paddingHorizontal: PADDING.m,
          }}
          >
            {getDateSelection()}
          </SafeAreaView>
        </AnimatedHeader>
        )}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
        >
          {getHeader()}
          <FlatList
            removeClippedSubviews
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '60%' }}>
                <Body
                  type={1}
                  text={i18n.t('No memories captured yet')}
                  style={{ marginBottom: 4 }}
                  color={COLORS.shades[0]}
                />
                <Body
                  type={2}
                  text={i18n.t("You will get a notification as soon as it's time to snap some memories 📸 ")}
                  style={{ maxWidth: '80%', textAlign: 'center' }}
                  color={COLORS.neutral[500]}
                />
              </View>
            )}
            data={dateSelection && dateSelection[dateIndex]?.images}
            style={{ marginTop: -10, paddingBottom: 100 }}
            renderItem={({ item, index }) => getImageTile(item, index)}
            numColumns={3}
          />
        </Animated.ScrollView>

        {downloadIndex !== null && getDownloadContainer()}
        {getFAB()}
        <StoryModal
          initalIndex={initalIndex}
          data={images}
          onRequestClose={() => {
            setStoryVisible(false);
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
  imagesLeftContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 100,
    backgroundColor: COLORS.error[900],
    height: 18,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
