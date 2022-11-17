import {
  FlatList, Share, StyleSheet, View, TouchableOpacity, StatusBar, Image,
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
import Body from '../components/typography/Body';
import userStore from '../stores/UserStore';
import GET_IMAGES_FROM_TRIP from '../queries/getImagesFromTrip';

export default function MemoriesScreen({ route }) {
  const { tripId } = route.params;
  const navigation = useNavigation();

  const { loading, error, data } = useQuery(GET_IMAGES_FROM_TRIP, {
    variables: {
      tripId,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef();

  const scale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);

  const user = userStore((state) => state.user);

  let loadingIndex = 0;
  const maxAngle = 8;

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
      setIsLoading(false);
    }
  }, [data, error]);

  // const images = [
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  //   {
  //     uri: 'https://picsum.photos/320/580',
  //   },
  // ];

  const numColumns = Math.round(Math.sqrt(user.images.length));

  // const checkLoadingStatus = () => {
  //   setTimeout(() => {
  //     if (loadingIndex >= user.images.length) {
  //       setIsLoading(false);
  //       return;
  //     }
  //     checkLoadingStatus();
  //   }, 2000);
  // };
  // checkLoadingStatus();

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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
              'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
    }
  };

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
            text={user.images.length}
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
          onPress={onShare}
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

  const PlayButton = () => (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.fab}
    >
      <EntIcon
        name="controller-play"
        size={30}
        style={{ marginRight: -3 }}
        color={COLORS.shades[100]}
      />
    </TouchableOpacity>
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

  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <AnimatedFlatlist
          ref={gridRef}
          style={gAnimated}
          onScrollBeginDrag={() => headerOpacity.value = withSpring(0)}
          onScrollEndDrag={() => headerOpacity.value = withSpring(1)}
          data={data?.getImagesFromTrip}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 60 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => getImageTile(item, index)}
        />
      </PinchGestureHandler>
      <PlayButton />
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
      <Header />
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
    position: 'absolute',
    bottom: 40,
    right: 20,
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
