import {
  Dimensions,
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../../components/typography/Headline';
import i18n from '../../utils/i18n';
import Utils from '../../utils';

export default function CameraScreen() {
  const navigation = useNavigation();

  const RoundedBackButton = () => (
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
  );

  const CaptureContainer = () => (
    <View style={{ position: 'absolute', width: Dimensions.get('window').width }}>
      <View style={styles.captureContainer}>
        <Headline
          type={3}
          isDense
          text={i18n.t('Capture now')}
          color={COLORS.shades[0]}
        />
      </View>
    </View>
  );
  const FooterContainer = () => (
    <View style={styles.footerContainer}>
      <View style={styles.countdown}>
        <Headline
          type={3}
          color={COLORS.shades[0]}
          text="01:33"
        />
      </View>
      <View style={styles.recordUnit}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.flashButton}
        >
          <IonIcons
            name="ios-flash"
            color={COLORS.shades[0]}
            size={18}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.recordButton}
        >
          <View style={{
            backgroundColor: COLORS.shades[0], height: 54, width: 54, borderRadius: RADIUS.xl,
          }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.flipButton}
        >
          <MatIcon
            name="flip-camera-android"
            color={COLORS.shades[0]}
            size={22}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CaptureContainer />
          <RoundedBackButton />
        </View>
        <FooterContainer />
      </SafeAreaView>
      {devices !== null && (
      <Camera
        style={StyleSheet.absoluteFill}
        device={devices}
      />
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  captureContainer: {
    alignSelf: 'center',
    height: 35,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[700],
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  roundButton: {
    marginLeft: PADDING.m,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: COLORS.shades[100],
  },
  flashButton: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.shades[0],
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    borderRadius: RADIUS.xl,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.2),
  },
  recordButton: {
    marginHorizontal: 24,
    height: 66,
    width: 66,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.shades[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordUnit: {
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.4),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 110,
    paddingTop: 50,
    marginTop: 15,
    justifyContent: 'center',
    flex: 1,
  },
  countdown: {
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[300], 0.5),
    alignSelf: 'center',
    width: 80,
    paddingHorizontal: 12,
    borderRadius: RADIUS.l,
    height: 40,
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
