import {
  FlatList, StyleSheet, View, TouchableOpacity, StatusBar, Image, Pressable, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import EntIcon from 'react-native-vector-icons/Entypo';
import React, { useRef, useState, useEffect } from 'react';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import Toast from 'react-native-toast-message';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import Subtitle from '../components/typography/Subtitle';
import ImageContainer from '../components/Trip/ImageContainer';
import LoadingGif from '../../assets/images/loading.gif';
import Camera3D from '../../assets/images/camera_3d.png';
import Body from '../components/typography/Body';
import userStore from '../stores/UserStore';
import GET_IMAGES_FROM_TRIP from '../queries/getImagesFromTrip';
import StoryModal from '../components/StoryModal';
import JourneyIcon from '../../assets/icons/journey_icon.svg';
import ROUTES from '../constants/Routes';

export default function MemoriesScreen({ route }) {
  const { tripId } = route.params;
  const navigation = useNavigation();

  const { loading, error, data } = useQuery(GET_IMAGES_FROM_TRIP, {
    variables: {
      tripId,
    },
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const gridRef = useRef();
  const scale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);
  const user = userStore((state) => state.user);

  const { width } = Dimensions.get('window');

  let loadingIndex = 0;
  const maxAngle = 8;

  useEffect(() => {
    if (data) {
      const { getImagesFromTrip: imageData } = data;
      setImages(imageData);
    }

    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
      console.log(error.message);
      setIsLoading(false);
    }
  }, [data, error]);

  const numColumns = Math.round(Math.sqrt(user.images.length));

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

  const getRandomAngle = () => `${(Math.random() * maxAngle) - (maxAngle / 2)}deg`;
  const Header = () => {
    const shadow = {
      shadowOpacity: 1,
      shadowColor: COLORS.shades[100],
      shadowRadius: 10,
    };
    return (
      <Animated.View style={[styles.header, hAnimated]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.roundButton}
        >
          <Icon
            style={{ marginLeft: -2 }}
            name="sharealt"
            color={COLORS.neutral[300]}
            size={18}
          />
        </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  const Buttons = () => (
    <View style={{
      flexDirection: 'row', position: 'absolute', right: PADDING.l, bottom: 50,
    }}
    >
      <Pressable
        onPress={() => navigation.navigate(ROUTES.timelineScreen, { tripId })}
        activeOpacity={0.5}
        style={styles.fabSecondary}
      >
        <JourneyIcon height={35} />
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
  );

  const getImageTile = (image, index) => {
    const isLeft = index === 0 || index % numColumns === 0;

    return (
      <ImageContainer
        onLoadEnd={() => loadingIndex += 1}
        style={[{ marginLeft: isLeft ? 0 : 40, marginTop: 40, transform: [{ rotate: getRandomAngle() }] }]}
        uri={image.uri}
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
          <Buttons />
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
      <Header />
      <StoryModal
        data={images}
        onRequestClose={() => setStoryVisible(false)}
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
});
