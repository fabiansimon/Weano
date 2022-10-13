import {
  ImageBackground, Modal, StyleSheet, TextInput, View, TouchableOpacity, Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from './Avatar';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import Utils from '../utils';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Button from './Button';
import KeyboardView from './KeyboardView';
import ImageSharedModal from './ImageSharedModal';

export default function ImageModal({
  style, image, isVisible, onRetake, onRequestClose,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);

  const name = 'Fabian Simon';
  const timestamp = 1656865380;

  const handlePublish = async () => {
    // console.log(title);
    // console.log(description);
    setIsShared(true);
    setTimeout(() => {
      onRequestClose();
    }, 400);
    // Utils.uploadToS3(capturedImage);
  };

  const PublishFooter = () => (
    <View style={styles.footer}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.roundButton}
        >
          <Icon
            name="ios-download"
            size={20}
            color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
            style={{ marginRight: -2 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.roundButton, { marginLeft: 10 }]}
        >
          <Icon
            name="arrow-redo"
            size={20}
            color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
            style={{ marginRight: -2 }}
          />
        </TouchableOpacity>
      </View>
      <Button
        text={i18n.t('Publish')}
        fullWidth={false}
        style={[{ borderRadius: RADIUS.xl, paddingHorizontal: 30 }, styles.shadow]}
        backgroundColor={COLORS.primary[700]}
        onPress={handlePublish}
      />
    </View>
  );

  const DetailsHeader = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size={55} />
        <View style={{ marginLeft: 10 }}>
          <Headline
            type={4}
            text={`${i18n.t('By')} ${name}`}
            color={COLORS.shades[0]}
            style={styles.shadow}
          />
          <Body
            type={2}
            text={`${Utils.getDateFromTimestamp(timestamp, 'MMM Do YY')}`}
            color={Utils.addAlpha(COLORS.neutral[50], 0.8)}
            style={styles.shadow}
          />
        </View>
      </View>
      <Button
        text={i18n.t('Retake')}
        fullWidth={false}
        onPress={onRetake}
        style={{ borderRadius: RADIUS.xl, paddingHorizontal: 18 }}
        backgroundColor={Utils.addAlpha(COLORS.neutral[50], 0.25)}
      />
    </View>
  );
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      onRequestClose={onRequestClose}
    >
      <View style={[styles.container, style]}>
        <ImageBackground
          source={{ uri: image && image.uri }}
          style={{
            flex: 1,
          }}
        />
        <KeyboardView
          paddingBottom={20}
          style={styles.textinputs}
        >
          <View style={{ flex: 1 }} />
          <View style={{ marginLeft: PADDING.m }}>
            <TextInput
              maxLength={20}
              placeholder={i18n.t('Add a title')}
              placeholderTextColor={Utils.addAlpha(COLORS.neutral[100], 0.6)}
              style={[styles.titleStyle, styles.shadow]}
              onChangeText={(val) => setTitle(val)}
            />
            <TextInput
              maxLength={80}
              placeholder={i18n.t('Or even an description')}
              placeholderTextColor={Utils.addAlpha(COLORS.neutral[100], 0.6)}
              style={[styles.descriptionStyle, styles.shadow]}
              onChangeText={(val) => setDescription(val)}
            />
          </View>
        </KeyboardView>
        <DetailsHeader />
        <PublishFooter />
      </View>
      <ImageSharedModal
        image={image}
        isVisible={isShared}
        onRequestClose={() => setIsShared(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 20,
    color: COLORS.shades[0],
    letterSpacing: -0.6,
  },
  descriptionStyle: {
    marginTop: 6,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[0],
    fontSize: 18,
    letterSpacing: -0.6,
  },
  header: {
    paddingHorizontal: PADDING.m,
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footer: {
    paddingHorizontal: PADDING.m,
    position: 'absolute',
    bottom: 50,
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
    bottom: '20%',
  },
});
