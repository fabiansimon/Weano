import {
  FlatList, StyleSheet, View, TouchableOpacity, StatusBar, Image, Pressable, Dimensions, Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntIcon from 'react-native-vector-icons/Entypo';
import React, { useRef, useState, useEffect } from 'react';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  SensorType,
  useAnimatedGestureHandler, useAnimatedSensor, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
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
import Subtitle from '../components/typography/Subtitle';
import ImageContainer from '../components/Trip/ImageContainer';
import LoadingGif from '../../assets/images/loading.gif';
import Camera3D from '../../assets/images/camera_3d.png';
import Body from '../components/typography/Body';
import GET_IMAGES_FROM_TRIP from '../queries/getImagesFromTrip';
import StoryModal from '../components/StoryModal';
import JourneyIcon from '../../assets/icons/journey_icon.svg';
import ROUTES from '../constants/Routes';
import Label from '../components/typography/Label';
import Utils from '../utils';

export default function MemoriesScreen({ route }) {
  const { tripId } = route.params;
  const navigation = useNavigation();

  const { loading, error, data } = useQuery(GET_IMAGES_FROM_TRIP, {
    variables: {
      tripId,
    },
  });

  const [images, setImages] = useState([]);
  const [freeImages, setFreeImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [initalIndex, setInitalIndex] = useState(0);
  const [downloadIndex, setDownloadIndex] = useState(null);

  const gridRef = useRef();

  const scale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 100,
  });
  const animatedStyle = useAnimatedStyle(() => {
    const { pitch, yaw } = animatedSensor.sensor.value;
    const yawValue = 20 * (yaw < 0 ? 2.5 * Number(yaw.toFixed(2)) : Number(yaw.toFixed(2)));
    const pitchValue = 50 * pitch.toFixed(2);
    return {
      transform: [{ translateX: pitchValue }, { translateY: yawValue }],
    };
  });

  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (data) {
      const { getImagesFromTrip: imageData } = data;
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

  const handleMenuOption = async ({ event }) => {
    if (event === 'take') {
      navigation.navigate(ROUTES.cameraScreen, { tripId, onNavBack: () => navigation.goBack() });
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

  const numColumns = Math.round(Math.sqrt(images.length));

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
      headerOpacity.value = withSpring(0);
    },
    onEnd: () => {
      scale.value = withTiming(1);
      headerOpacity.value = withSpring(1);
    },
  });

  const gAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const hAnimated = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const Header = () => {
    const shadow = {
      shadowOpacity: 1,
      shadowColor: COLORS.shades[100],
      shadowRadius: 10,
    };
    return (
      <Animated.View style={[styles.header, hAnimated]}>
        <TouchableOpacity
          onPress={() => downloadIndex === null && navigation.goBack()}
          activeOpacity={0.9}
          style={styles.roundButton}
        >
          <Icon
            name="arrowleft"
            color={COLORS.neutral[300]}
            size={22}
          />
        </TouchableOpacity>
        {!isLoading && (
        <View style={{ flexDirection: 'row' }}>
          <Headline
            type={1}
            style={[{ fontWeight: '500', marginTop: -2 }, shadow]}
            color={COLORS.shades[0]}
            text={images && images?.length}
          />
          <View style={{ marginLeft: 12 }}>
            <Headline
              type={4}
              style={shadow}
              color={COLORS.shades[0]}
              text={i18n.t('Moments captured')}
            />
            <Subtitle
              type={2}
              color={COLORS.shades[0]}
              style={[{ opacity: 0.5 }, shadow]}
              text="3 POV’s • 36 Photos • 7 Videos"
            />
          </View>
        </View>
        )}
        {!isLoading && (
        <MenuView
          style={styles.addIcon}
          onPressAction={({ nativeEvent }) => handleMenuOption(nativeEvent)}
          actions={[
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
                ios: 'square.and.arrow.down',
              }),
            },
          ]}
        >
          <View
            style={styles.roundButton}
          >
            <FeatherIcon
              name="more-vertical"
              color={COLORS.neutral[300]}
              size={18}
            />
          </View>

        </MenuView>
        )}
      </Animated.View>
    );
  };
  const Buttons = () => (
    <Animated.View style={[styles.buttonRow, hAnimated]}>
      {freeImages > 0 ? (
        <MenuView
          style={styles.addIcon}
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
            activeOpacity={0.5}
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
            style={[styles.fab, { backgroundColor: Utils.addAlpha(COLORS.primary[700], 0.3) }]}
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
        )}

      {images.length > 0 && (
      <View style={{ flexDirection: 'row' }}>
        <Pressable
          onPress={() => navigation.navigate(ROUTES.timelineScreen, { tripId })}
          activeOpacity={0.5}
          style={styles.fabSecondary}
        >
          <JourneyIcon height={28} />
        </Pressable>
        <Pressable
          onPress={() => setStoryVisible(true)}
          activeOpacity={0.5}
          style={styles.fab}
        >
          <EntIcon
            name="controller-play"
            size={30}
            style={{ marginRight: -3 }}
            color={COLORS.shades[100]}
          />
        </Pressable>
      </View>
      )}
    </Animated.View>
  );

  const getImageTile = (image, index) => {
    const isLeft = index === 0 || index % numColumns === 0;

    return (
      <ImageContainer
        tripId={tripId}
        onPress={() => {
          setInitalIndex(index);
          setStoryVisible(true);
        }}
        onDelete={(id) => {
          setImages((prev) => prev.filter((i) => i._id !== id));
          setFreeImage((prev) => prev + 1);
        }}
        style={[{ marginLeft: isLeft ? 0 : 10, marginTop: 10 }, animatedStyle]}
        image={image}
      />
    );
  };

  const EmptyDataSet = () => (
    <View style={{ width: width * 0.9, alignItems: 'center' }}>
      <Image
        source={Camera3D}
        style={{ height: 140 }}
        resizeMode="contain"
      />
      <Body
        style={{ alignSelf: 'center', marginVertical: 10 }}
        type={1}
        text={i18n.t('No Memories added yet 😢')}
        color={COLORS.neutral[300]}
      />
    </View>
  );

  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {images.length > 0 ? (
        <>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <AnimatedFlatlist
              ref={gridRef}
              style={gAnimated}
              onScrollBeginDrag={() => headerOpacity.value = withSpring(0)}
              onScrollEndDrag={() => headerOpacity.value = withSpring(1)}
              data={images || null}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 60 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => getImageTile(item, index)}
            />
          </PinchGestureHandler>
          {(loading || error) && (
          <View style={styles.loading}>
            <View style={{ justifyContent: 'center', alignItems: 'center', top: '40%' }}>
              <Image
                source={LoadingGif}
                resizeMode="center"
                style={styles.gif}
              />
              <Headline
                type={4}
                color={COLORS.shades[0]}
                text={i18n.t('Fetching your memories')}
              />
              <Body
                style={{ marginTop: 4 }}
                type={2}
                color={COLORS.neutral[500]}
                text={i18n.t('Just give us a second...')}
              />
            </View>
          </View>
          )}
        </>
      ) : <EmptyDataSet />}
      <Buttons />
      <Header />
      {downloadIndex !== null && getDownloadContainer()}
      <StoryModal
        initalIndex={initalIndex}
        data={images}
        onRequestClose={() => {
          setStoryVisible(false);
        }}
        isVisible={storyVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[100],
    alignItems: 'center',
    justifyContent: 'center',
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
  fabSecondary: {
    borderRadius: RADIUS.xl,
    height: 50,
    width: 50,
    marginRight: 10,
    shadowOffset: {},
    shadowOpacity: 0.05,
    borderWidth: 1,
    shadowColor: COLORS.shades[100],
    borderColor: COLORS.neutral[700],
    backgroundColor: COLORS.neutral[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    top: 50,
    position: 'absolute',
    width: '98%',
    alignSelf: 'center',
    height: 55,
    marginHorizontal: PADDING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.s,
  },
  roundButton: {
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: COLORS.shades[100],
  },
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: COLORS.shades[100],
  },
  gif: {
    width: '100%',
    height: 100,
  },
  buttonRow: {
    paddingHorizontal: PADDING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 50,
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
});
