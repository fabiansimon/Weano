import {
  Modal,
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Logo from '../../assets/images/logo_blue.png';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import Divider from './Divider';
import Utils from '../utils';
import Subtitle from './typography/Subtitle';

import PremiumController from '../PremiumController';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Purchases from 'react-native-purchases';
import PopUpModal from './PopUpModal';

const PremiumModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef();

  useLayoutEffect(() => {
    PremiumController.setModalRef(modalRef);
  }, []);

  useImperativeHandle(
    modalRef,
    () => ({
      show: () => {
        setIsVisible(true);
      },
      hide: () => {
        setIsVisible(false);
      },
    }),
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          const {availablePackages} = offerings.current;

          const {
            product: {priceString, title, description},
          } = availablePackages[0];
          setProducts([
            {
              title,
              priceString,
              description,
            },
          ]);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handlePurchase = async () => {
    const product =
      Platform.OS === 'android' ? 'weanopro:weano-monthly' : 'weano_0350_1m';

    try {
      const purchaseMade = await Purchases.purchasePackage(product);
      if (purchaseMade.customerInfo.entitlements.active.pro) {
        // Unlock that great "pro" content
      }
    } catch (e) {
      console.log(e);
      if (!e.userCancelled) {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: i18n.t('Something went wrong'),
        });
      }
    }
  };

  const features = [
    {
      title: i18n.t('📸  Create more memories!'),
      subtitle: i18n.t('Store up to 100 images per trip (yes one hundred)'),
    },
    {
      title: i18n.t('🌍  Visit more countries!'),
      subtitle: i18n.t('Create and store as many trips as you like'),
    },
    {
      title: i18n.t('👀  Increased storage for planning!'),
      subtitle: i18n.t(
        'Upload as many documents, expenses, polls and tasks as you wish',
      ),
    },
    {
      title: i18n.t('🏄‍♀️  Travel with more friends!'),
      subtitle: i18n.t(
        'Invite as many people as you wish. The more the merrier',
      ),
    },
  ];

  const getFeatureItem = feature => (
    <View style={{marginTop: 18}}>
      <Body type={1} color={COLORS.neutral[900]} text={feature.title} />
      <Body type={2} color={COLORS.neutral[500]} text={feature.subtitle} />
    </View>
  );

  const getOfferTile = offer => {
    const {title: _title, priceString, description} = offer;

    const title = `${priceString} ${_title}`;

    return (
      <TouchableHighlight
        underlayColor={COLORS.neutral[100]}
        onPress={() => {
          RNReactNativeHapticFeedback.trigger('impactHeavy', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true,
          });
          handlePurchase();
        }}
        style={[styles.offerTile, styles.bestContainer]}>
        <>
          {true && (
            <View style={styles.bestHeader}>
              <Icon name="ios-star" color={COLORS.shades[0]} />
              <Subtitle
                type={1}
                style={{marginLeft: 4}}
                color={COLORS.shades[0]}
                text={i18n.t('Best seller')}
              />
            </View>
          )}
          <View
            style={{
              paddingHorizontal: PADDING.m,
              paddingVertical: PADDING.s,
              height: 62,
            }}>
            {isLoading ? (
              <ActivityIndicator
                style={{marginTop: 10}}
                color={COLORS.primary[700]}
              />
            ) : (
              <>
                <Body type={1} color={COLORS.neutral[900]} text={title} />
                <Body type={2} color={COLORS.neutral[300]} text={description} />
              </>
            )}
          </View>
        </>
      </TouchableHighlight>
    );
  };

  return (
    <PopUpModal
      onRequestClose={() => setIsVisible(false)}
      isVisible={isVisible}
      title={i18n.t('Sorry!')}
      subtitle={i18n.t(
        "You can't add any more at this point. Please either delete other items to add another one.",
      )}
    />
  );

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image source={Logo} style={{height: 50, width: 50}} />
          </View>
          <Headline
            type={3}
            style={{marginTop: 8}}
            color={COLORS.shades[0]}
            text={i18n.t('Get Weano Pro')}
          />
          <Body
            type={2}
            style={{marginTop: 8, lineHeight: 16, textAlign: 'center'}}
            color={COLORS.shades[0]}
            text={i18n.t(
              'We know everybody hates subscriptions, but for only one cup of coffee a month you can get a bunch of cool stuff',
            )}
          />
        </View>
        <ScrollView>
          <View style={{marginTop: 6}}>
            {features.map(feature => getFeatureItem(feature))}
          </View>
          <View style={{marginTop: 20}}>
            <Divider />
            <View style={styles.offerContainer}>
              <Body
                color={COLORS.shades[0]}
                type={2}
                text={i18n.t('One time offer')}
              />
              <Icon
                style={{marginLeft: 4}}
                name="timer-outline"
                size={20}
                color={COLORS.shades[0]}
              />
            </View>
          </View>
          <View style={{marginTop: -18}}>
            {products.map(offer => getOfferTile(offer))}
          </View>
        </ScrollView>
        <Pressable
          onPress={() => setIsVisible(false)}
          style={styles.closeContainer}>
          <AntIcon
            name="close"
            size={16}
            color={Utils.addAlpha(COLORS.neutral[50], 0.8)}
          />
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: PADDING.l,
  },
  header: {
    marginHorizontal: -PADDING.l,
    paddingHorizontal: PADDING.m,
    paddingVertical: PADDING.m,
    alignItems: 'center',
    backgroundColor: COLORS.primary[700],
  },
  iconContainer: {
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.shades[0],
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  offerContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: COLORS.primary[700],
    marginLeft: 'auto',
    marginRight: 'auto',
    top: -28,
  },
  closeContainer: {
    padding: 6,
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.2),
    position: 'absolute',
    borderRadius: RADIUS.xl,
    top: 10,
    right: 10,
  },
  offerTile: {
    marginTop: 10,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  bestContainer: {
    borderColor: COLORS.primary[700],
    borderWidth: 2,
  },
  bestHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 7,
    borderTopStartRadius: 7,
  },
});

export default forwardRef(PremiumModal);
