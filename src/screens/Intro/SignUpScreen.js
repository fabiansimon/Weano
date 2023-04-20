import {
  View,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import COLORS, {PADDING} from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
// import TextField from '../../components/TextField';
import AuthModal from '../../components/AuthModal';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import GoogleIcon from '../../../assets/icons/google_icon.svg';
import Button from '../../components/Button';
import Logo from '../../../assets/images/logo_temp.png';
import BackgroundImage from '../../../assets/images/signup_background.png';
import Utils from '../../utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../../constants/Routes';

const {height, width} = Dimensions.get('window');

export default function SignUpScreen({invitationId, route}) {
  // PARAMS
  const {uploadReminderId} = route.params;

  // STATE & MISC
  const [loginVisible, setLoginVisible] = useState(false);

  const navigation = useNavigation();

  const getContent = () => {
    return (
      <View
        style={{
          marginHorizontal: PADDING.m,
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 10 : 0,
          justifyContent: 'space-between',
        }}>
        <View>
          <Image
            style={{height: 40, width: 40}}
            resizeMode="contain"
            source={Logo}
          />
          <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
            <Headline
              type={2}
              color={COLORS.shades[0]}
              style={{marginRight: 4}}
              text={i18n.t('Create,')}
            />
            <Headline
              type={2}
              color={COLORS.shades[0]}
              style={{marginRight: 4}}
              text={i18n.t('capture')}
            />
            <Headline
              type={2}
              style={{fontWeight: '400', marginRight: 4}}
              color={COLORS.shades[0]}
              text={i18n.t('and')}
            />
            <Headline
              type={2}
              color={COLORS.shades[0]}
              style={{marginRight: 4}}
              text={i18n.t('preserve')}
            />
            <Headline
              type={2}
              color={COLORS.shades[0]}
              style={{marginRight: 4}}
              text={i18n.t('moments')}
            />
            <Headline
              type={2}
              style={{fontWeight: '400', marginRight: 4}}
              color={COLORS.shades[0]}
              text={i18n.t('that')}
            />
            <Headline
              type={2}
              style={{fontWeight: '400', marginRight: 4}}
              color={COLORS.shades[0]}
              text={i18n.t('you')}
            />
            <Headline
              type={2}
              color={COLORS.shades[0]}
              style={{fontWeight: '400', marginRight: 4}}
              text={i18n.t('never')}
            />
            <Headline
              type={2}
              style={{fontWeight: '400', marginRight: 4}}
              color={COLORS.shades[0]}
              text={i18n.t('wanted')}
            />
            <Headline
              type={2}
              style={{fontWeight: '400', marginRight: 4}}
              color={COLORS.shades[0]}
              text={i18n.t('to')}
            />
            <Headline
              type={2}
              style={{fontWeight: '400', marginRight: 4}}
              color={COLORS.shades[0]}
              text={i18n.t('forget')}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <Body
              type={1}
              color={COLORS.shades[0]}
              style={{
                fontWeight: Platform.OS === 'android' ? '700' : '600',
              }}
              text={i18n.t('Log in')}
            />
            <Body
              type={1}
              color={COLORS.shades[0]}
              text={i18n.t('to start!')}
              style={{
                marginHorizontal: 4,
                marginTop: Platform.OS === 'android' ? 1 : 0,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: '90%',
            height: 160,

            marginBottom: Platform.OS === 'android' ? 20 : 8,
            alignSelf: 'center',
          }}>
          <Button
            icon={<GoogleIcon />}
            style={{marginBottom: 8}}
            fullWidth
            textColor={COLORS.shades[100]}
            isSecondary
            onPress={() => setLoginVisible(true)}
            alignIcon="left"
            text={i18n.t('Continue with Google')}
          />
          <Button
            fullWidth
            alignIcon="left"
            icon={<Icon name="phone" color={COLORS.shades[100]} size={22} />}
            textColor={COLORS.shades[100]}
            isSecondary
            onPress={() => setLoginVisible(true)}
            text={i18n.t('Log in with phone')}
          />

          <Pressable
            onPress={() =>
              navigation.navigate(ROUTES.registerScreen, {
                invitationId,
                uploadReminderId,
              })
            }
            style={{
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Body
              type={2}
              color={COLORS.shades[0]}
              text={i18n.t('No account?')}
            />
            <Body
              type={2}
              color={COLORS.shades[0]}
              style={{
                fontWeight: Platform.OS === 'android' ? '700' : '600',
              }}
              text={i18n.t('Create Account')}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Image
          source={BackgroundImage}
          blurRadius={3}
          resizeMode="contain"
          style={styles.imageBackground}
        />
        <View style={styles.overlay} />
        {getContent()}
      </SafeAreaView>
      <AuthModal
        isVisible={loginVisible}
        onRequestClose={() => setLoginVisible(false)}
        joinTripId={invitationId}
        uploadReminderId={uploadReminderId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[100],
    justifyContent: 'space-between',
  },
  imageBackground: {
    top: -25,
    height: height + 50,
    alignSelf: 'center',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    height,
    width,
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.6),
  },
});
