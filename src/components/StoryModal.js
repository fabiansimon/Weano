import {
  Modal,
  StyleSheet,
  ImageBackground,
  View,
  Dimensions,
  Pressable,
  Share,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import BackButton from './BackButton';
import Utils from '../utils';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import Avatar from './Avatar';

export default function StoryModal({ data, isVisible, onRequestClose }) {
  const [imageIndex, setImageIndex] = useState(0);
  const { width, height } = Dimensions.get('window');

  const handleShare = async () => {
    Share.share({
      message:
            'React Native | A framework for building native apps using React',
    });
  };

  const ProgressHeader = () => (
    <View style={{
      position: 'absolute',
      top: 50,
    }}
    >
      <View style={styles.progressBar}>
        {data.map((_, index) => (
          <View style={{
            height: 3, flex: 1, backgroundColor: index <= imageIndex ? COLORS.shades[0] : Utils.addAlpha('#ffffff', 0.1), marginLeft: index !== 0 ? 10 : 0, borderRadius: 10,
          }}
          />
        ))}
      </View>
      <View style={styles.buttonRow}>
        <BackButton
          isClear
          onPress={onRequestClose}
          iconColor={COLORS.shades[0]}
        />
        <Pressable
          onPress={handleShare}
          activeOpacity={0.8}
          style={[styles.roundButton, { marginLeft: 10 }]}
        >
          <Icon
            name="arrow-redo"
            size={20}
            color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
            style={{ marginRight: -2 }}
          />
        </Pressable>
      </View>
    </View>
  );

  const ImagePreview = ({ item }) => {
    const {
      uri, title, description, author, createdAt,
    } = item;
    const { firstName, lastName, avatarUri } = author;
    return (
      <View style={{ width, height, backgroundColor: COLORS.neutral[900] }}>
        <ImageBackground
          source={{ uri }}
          style={{
            width,
            height: '94%',
          }}
        />
        <View style={{
          position: 'absolute', height: '88%', width, flexDirection: 'row',
        }}
        >
          <Pressable
            onPress={() => setImageIndex((index) => (index !== 0 ? index - 1 : 0))}
            style={{
              flex: 1,
            }}
          />
          <Pressable
            onPress={() => setImageIndex((index) => (index !== data.length - 1 ? index + 1 : data.length - 1))}
            style={{
              flex: 1,
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Body
              type={1}
              color={COLORS.shades[0]}
              style={{ fontStyle: !title ? 'italic' : 'normal' }}
              text={title || i18n.t('No title')}
            />
            <Body
              type={2}
              color={Utils.addAlpha('#ffffff', 0.5)}
              style={{ fontStyle: !description ? 'italic' : 'normal' }}
              text={description || i18n.t('No description')}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Body
                type={1}
                style={{ textAlign: 'right' }}
                color={COLORS.shades[0]}
                text={`${firstName} ${lastName}`}
              />
              <Body
                type={2}
                style={{ textAlign: 'right' }}
                color={Utils.addAlpha('#ffffff', 0.5)}
                text={`${Utils.getDateFromTimestamp(createdAt / 1000, 'MMM Do YYYY')}`}
              />
            </View>
            <Avatar
              style={{ marginLeft: 10 }}
              disabled
              size={30}
              uri={avatarUri}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="overFullScreen"
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={{ flex: 1, backgroundColor: COLORS.neutral[900] }}>
        <ImagePreview item={data[imageIndex]} />
        <ProgressHeader />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    paddingHorizontal: PADDING.m,
  },
  roundButton: {
    borderRadius: RADIUS.xl,
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[50], 0.3),
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shades[100],
    shadowRadius: 30,
    shadowOpacity: 0.3,
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.15),
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.m,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.l,
    bottom: 32,
  },
});
