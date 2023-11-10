import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntIcon from 'react-native-vector-icons/Entypo';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import i18n from '../utils/i18n';
import Avatar from './Avatar';
import Body from './typography/Body';
import Headline from './typography/Headline';
import WorldImage from '../../assets/images/world.jpeg';
import Utils from '../utils';

function ContactDetailModal({isVisible, onRequestClose, data}) {
  const [showModal, setShowModal] = useState(isVisible);
  const animatedBottom = useRef(new Animated.Value(900)).current;
  const duration = 300;

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  const toggleModal = () => {
    if (isVisible) {
      setShowModal(true);
      Animated.spring(animatedBottom, {
        toValue: 100,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), duration);
      Animated.spring(animatedBottom, {
        toValue: 900,
        duration,
        useNativeDriver: true,
      }).start();
    }
  };

  const getRoundButton = (icon, string, onPress) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{alignItems: 'center'}}>
      <View style={styles.roundButton}>
        <Icon name={icon} size={24} color={COLORS.shades[0]} />
      </View>
      <Body
        type={2}
        text={string}
        color={COLORS.neutral[300]}
        style={{marginTop: 8}}
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container]}
        onPress={onRequestClose}>
        <Animated.View
          style={[styles.content, {transform: [{translateY: animatedBottom}]}]}>
          <View style={styles.handler} />
          <View style={styles.innerContainer}>
            <Image
              source={WorldImage}
              style={{width: '100%', height: 100, borderRadius: RADIUS.m}}
            />
            <View style={styles.overlay} />
            <Avatar
              disabled
              size={70}
              data={data}
              style={{marginTop: -35}}
              borderWidth={3}
            />

            <Headline
              type={3}
              text={data && `${data.firstName} ${data.lastName}`}
            />
            <Body
              type={1}
              text={data?.phoneNumber || data?.email}
              color={COLORS.neutral[300]}
            />
            {data?.phoneNumber && (
              <View style={styles.bottomRow}>
                {getRoundButton(
                  'phone',
                  i18n.t('Audio call'),
                  () => data && Linking.openURL(`tel:${data.phoneNumber}`),
                )}
                <View style={{width: PADDING.m}} />
                {getRoundButton(
                  'save',
                  i18n.t('Save Nr'),
                  () =>
                    data &&
                    Utils.openPhoneNumber(
                      data.phoneNumber,
                      data.firstName,
                      data.lastName,
                    ),
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    marginTop: 'auto',
    padding: PADDING.s,
    opacity: 1,
    marginBottom: 30,
    paddingBottom: 100,
  },
  innerContainer: {
    padding: PADDING.s,
    alignItems: 'center',
    backgroundColor: COLORS.shades[0],
    paddingBottom: 20,
    borderRadius: RADIUS.l,
  },
  handler: {
    width: 50,
    height: 6,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    marginBottom: 10,
    alignSelf: 'center',
  },
  overlay: {
    width: '100%',
    height: 100,
    borderRadius: RADIUS.m,
    position: 'absolute',
    top: 10,
    backgroundColor: COLORS.primary[700],
    opacity: 0.82,
  },
  roundButton: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContactDetailModal;
