import 'react-native-get-random-values';
import {
  Animated,
  Modal,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Share,
  Image,
  Dimensions,
  NativeModules,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import Avatar from './Avatar';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import Utils from '../utils';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Button from './Button';
import KeyboardView from './KeyboardView';
import ImageSharedView from './ImageSharedView';
import httpService from '../utils/httpService';
import userStore from '../stores/UserStore';
import toastConfig from '../constants/ToastConfig';
import UPLOAD_TRIP_IMAGE from '../mutations/uploadTripImage';
import LoadingModal from './LoadingModal';
import activeTripStore from '../stores/ActiveTripStore';
import tripsStore from '../stores/TripsStore';
import GradientOverlay from './GradientOverlay';
// import activeTripStore from '../stores/ActiveTripStore';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const {StatusBarManager} = NativeModules;
console.log(NativeModules);
export default function ImageModal({
  style,
  image,
  isVisible,
  onRetake,
  onRequestClose,
  tripId,
  isPreselected = false,
}) {
  // MUTATIONS
  const [uploadTripImage, {error}] = useMutation(UPLOAD_TRIP_IMAGE);

  // STORES
  const user = userStore(state => state.user);
  const {id, images} = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const trips = tripsStore(state => state.trips);
  const setTrips = tripsStore(state => state.setTrips);

  // STATE & MISC
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const {width, height} = Dimensions.get('window');

  const imageHeight = useRef(new Animated.Value(height)).current;
  const imageWidth = useRef(new Animated.Value(width)).current;
  const imageBorderRadius = useRef(new Animated.Value(0)).current;
  const imageRotation = useRef(new Animated.Value(0)).current;
  const imageBottomMargin = useRef(new Animated.Value(0)).current;

  const duration = 300;

  useEffect(() => {
    toggleShareView();
  }, [isShared]);

  const toggleShareView = () => {
    if (isShared) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(imageHeight, {
            toValue: height * 0.4,
            duration,
          }),
          Animated.spring(imageWidth, {
            toValue: height * 0.3,
            duration,
          }),
          Animated.spring(imageBorderRadius, {
            toValue: 10,
            duration,
          }),
          Animated.spring(imageRotation, {
            toValue: 1,
            duration,
          }),
          Animated.spring(imageBottomMargin, {
            toValue: 40,
            duration,
          }),
        ]).start(),
      ]);
      setTimeout(() => {
        setAnimationDone(true);
      }, duration);
    }
  };

  const rotation = imageRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'],
  });

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: error.message,
      });
      setIsLoading(false);
    }
  }, [error]);

  const handleShare = async () => {
    Share.share({
      message:
        'React Native | A framework for building native apps using React',
    });
  };

  const handlePublish = async () => {
    setIsLoading(true);

    const data = isPreselected ? image.data : image;

    try {
      const {Location, Key} = await httpService.uploadToS3(
        data,
        !isPreselected,
      );

      await uploadTripImage({
        variables: {
          image: {
            uri: Location,
            title: title || '',
            description: description || '',
            tripId,
            s3Key: Key,
          },
        },
      }).then(res => {
        const {
          _id,
          author,
          createdAt,
          description: _description,
          title: _title,
          uri,
          userFreeImages: _userFreeImages,
        } = res.data.uploadTripImage;

        setTrips(
          trips.map(trip => {
            if (trip.id === tripId) {
              return {
                ...trip,
                userFreeImages: _userFreeImages - 1,
              };
            }
            return trip;
          }),
        );
        if (id === tripId) {
          const newImage = {
            author,
            createdAt,
            _id,
            description: _description,
            title: _title,
            uri,
          };
          if (images?.length > 0) {
            updateActiveTrip({
              images: [...images, newImage],
              userFreeImages: _userFreeImages - 1,
            });
          } else {
            updateActiveTrip({
              images: [newImage],
              userFreeImages: _userFreeImages - 1,
            });
          }
        }
        setIsShared(true);
        setIsLoading(false);
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      console.log(e);
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    navigation.goBack();
    setIsShared(false);
    setTimeout(() => {
      onRequestClose();
    }, 500);
  };

  const getPublishFooter = () => (
    <View style={styles.footer}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => Utils.downloadImage(image)}
          activeOpacity={0.8}
          style={styles.roundButton}>
          <Icon
            name="ios-download"
            size={20}
            color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
            style={{marginRight: -2}}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.8}
          style={[styles.roundButton, {marginLeft: 10}]}>
          <Icon
            name="arrow-redo"
            size={20}
            color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
            style={{marginRight: -2}}
          />
        </TouchableOpacity> */}
      </View>
      <Button
        text={i18n.t('Publish')}
        fullWidth={false}
        isLoading={isLoading}
        style={[
          {borderRadius: RADIUS.xl, paddingHorizontal: 30},
          styles.shadow,
        ]}
        backgroundColor={COLORS.primary[700]}
        onPress={handlePublish}
      />
    </View>
  );

  const getDetailsHeader = () => (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar disabled isSelf size={45} />
        <View style={{marginLeft: 10}}>
          <Headline
            type={4}
            text={`${i18n.t('By')} ${user?.firstName} ${user?.lastName}`}
            color={COLORS.shades[0]}
            style={styles.shadow}
          />
          <Body
            type={2}
            text={`${Utils.getDateFromTimestamp(
              Date.now() / 1000,
              'MMM Do YYYY',
            )}`}
            color={Utils.addAlpha(COLORS.neutral[50], 0.8)}
            style={styles.shadow}
          />
        </View>
      </View>
      <Button
        text={isPreselected ? i18n.t('Go back') : i18n.t('Retake')}
        fullWidth={false}
        onPress={onRetake}
        style={{borderRadius: RADIUS.xl, paddingHorizontal: 18}}
        backgroundColor={Utils.addAlpha(COLORS.neutral[50], 0.25)}
      />
    </View>
  );

  return (
    <Modal
      animationType="none"
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      onRequestClose={onRequestClose}>
      <View style={[styles.container, style]}>
        {animationDone && (
          <ImageSharedView
            style={styles.doneContainer}
            image={image}
            onDone={handleDone}
          />
        )}
        <>
          <View
            style={{
              backgroundColor: '#1E1E1E',
              position: 'absolute',
              height: '100%',
              width: '100%',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <AnimatedImage
              source={{
                uri: isPreselected
                  ? image?.path || image.sourceURL
                  : image?.uri,
              }}
              resizeMode={isPreselected && 'contain'}
              style={[
                {
                  alignSelf: 'center',
                  borderRadius: imageBorderRadius,
                  height: imageHeight,
                  bottom: imageBottomMargin,
                  width: imageWidth,
                },
                {transform: [{rotate: rotation}]},
              ]}
            />
          </View>
          {!isShared && (
            <>
              <GradientOverlay />
              <KeyboardView
                behavior="padding"
                paddingBottom={-50}
                style={styles.textinputs}>
                <View style={{flex: 1}} />
                <View style={{marginLeft: PADDING.m, bottom: '15%'}}>
                  <TextInput
                    maxLength={20}
                    placeholder={i18n.t('Add a title')}
                    placeholderTextColor={Utils.addAlpha(
                      COLORS.neutral[100],
                      0.6,
                    )}
                    style={[styles.titleStyle, styles.shadow]}
                    onChangeText={val => setTitle(val)}
                  />
                  <TextInput
                    maxLength={50}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    placeholder={i18n.t('Or even an description')}
                    placeholderTextColor={Utils.addAlpha(
                      COLORS.neutral[100],
                      0.6,
                    )}
                    style={[styles.descriptionStyle, styles.shadow]}
                    onChangeText={val => setDescription(val)}
                  />
                </View>
              </KeyboardView>
              {getDetailsHeader()}
              {getPublishFooter()}
            </>
          )}
        </>
      </View>
      <Toast config={toastConfig} />
      <LoadingModal isLoading={isLoading} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 18,
    color: COLORS.shades[0],
    letterSpacing: -0.6,
    height: 50,
    marginBottom: -25,
  },
  descriptionStyle: {
    marginTop: 6,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[0],
    fontSize: 16,
    marginRight: PADDING.l,
    letterSpacing: -0.6,
    height: 50,
  },
  header: {
    paddingHorizontal: PADDING.m,
    position: 'absolute',
    top: StatusBarManager.HEIGHT - (Platform.OS === 'android' ? 20 : 0),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footer: {
    paddingHorizontal: PADDING.m,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 30 : 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roundButton: {
    borderRadius: RADIUS.xl,
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[50], 0.3),
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shades[100],
    shadowRadius: 30,
    shadowOpacity: 0.3,
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.15),
  },
  shadow: {
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  textinputs: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  doneContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
});
