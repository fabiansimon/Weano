import {
  Image, Modal, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import Dash from 'react-native-dash';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import HighlightContainer from './HighlightContainer';
import i18n from '../../utils/i18n';
import BoardingPassCode from '../../../assets/images/boarding_card_code.png';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import Button from '../Button';

export default function BoardingPassModal({ type, isVisible, onRequestClose }) {
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
        toValue: 0,
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
  const getDestinationContainer = () => (
    <HighlightContainer description={i18n.t('Date')} text="21.04 to 28.04" />
  );

  const getDateContainer = () => (
    <HighlightContainer
      description={i18n.t('Destination')}
      text="Paris, France"
    />
  );

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      useNativeDriver
      collapsable
      transparent
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onRequestClose}
        style={{ backgroundColor: 'rgba(0,0,0,0.9)', flex: 1 }}
      >
        <View style={{ height: '24%' }} />
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY: 0 }] }]}
        >
          <View style={styles.boardingPass}>
            <View
              style={{
                paddingVertical: PADDING.m,
                paddingHorizontal: PADDING.m,
              }}
            >
              <Headline
                type={2}
                color={COLORS.shades[0]}
                text="Dogpack trip 2022 🐶"
              />
              <Body
                style={{ marginTop: 6, marginRight: 20 }}
                type={1}
                color={COLORS.shades[0]}
                text="Fucking sending it for a few weeks straight. Guys trip baby. LET’S GO 🍻"
              />
            </View>
            <Dash
              style={{ width: '97%', alignSelf: 'center' }}
              dashColor={COLORS.shades[0]}
              dashLength={4}
              dashThickness={1}
            />
            <View
              style={{
                paddingHorizontal: PADDING.m,
                paddingTop: PADDING.s,
                paddingBottom: PADDING.l,
              }}
            >
              {type === 'date' ? getDateContainer() : getDestinationContainer()}
              {type === 'date' ? getDestinationContainer() : getDateContainer()}
            </View>
            <Dash
              style={{ width: '85%', alignSelf: 'center' }}
              dashColor={COLORS.shades[0]}
              dashLength={4}
              dashThickness={1}
            />
            <Image
              style={styles.barcode}
              resizeMode="contain"
              source={BoardingPassCode}
            />
            <View
              style={[
                styles.invertBubble,
                { position: 'absolute', left: -20, bottom: 83 },
              ]}
            />
            <View
              style={[
                styles.invertBubble,
                { position: 'absolute', right: -20, bottom: 83 },
              ]}
            />
          </View>
          <Button
            style={{ marginTop: 20, marginHorizontal: PADDING.l }}
            text={i18n.t('Share Trip')}
          />
          <Button
            style={{ marginTop: 14, marginHorizontal: PADDING.l }}
            isSecondary
            onPress={onRequestClose}
            text={i18n.t('Close')}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  barcode: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  boardingPass: {
    marginHorizontal: PADDING.s,
    backgroundColor: COLORS.primary[700],
    height: 420,
    borderRadius: RADIUS.l,
  },
  modalContainer: {
    flex: 1,
  },
  innerContainer: {
    marginVertical: 30,
    paddingVertical: 10,
    paddingHorizontal: PADDING.m,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: COLORS.shades[0],
    borderWidth: 1,
    width: '102%',
    left: -5,
  },
  invertBubble: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: COLORS.neutral[900],
  },
});
