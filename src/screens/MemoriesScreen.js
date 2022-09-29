import {
  FlatList, Share, StyleSheet, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import Subtitle from '../components/typography/Subtitle';
import ImageContainer from '../components/Trip/ImageContainer';

export default function MemoriesScreen() {
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
    } catch (error) {
      alert(error.message);
    }
  };

  const getHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.roundButton}>
        <Icon
          name="arrowleft"
          color={COLORS.neutral[300]}
          size={22}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <Headline
          type={1}
          style={{ fontWeight: '500', marginTop: -2 }}
          color={COLORS.shades[0]}
          text="23"
        />
        <View style={{ marginLeft: 12 }}>
          <Headline
            type={4}
            color={COLORS.shades[0]}
            text={i18n.t('Moments captured')}
          />
          <Subtitle
            type={2}
            color={COLORS.shades[0]}
            style={{ opacity: 0.5 }}
            text="3 POV’s • 36 Photos • 7 Videos"
          />
        </View>
      </View>
      <TouchableOpacity
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
    </View>
  );

  const getImageTile = (uri) => <ImageContainer uri={uri} />;

  const getImageGrid = () => {
    const images = [];
    const imagesLength = 30;

    for (let i = 0; i < imagesLength; i += 1) {
      images.push('https://picsum.photos/160/290');
    }

    return (
      <FlatList
        style={styles.FlatlistStyles}
        data={images}
        numColumns={4}
        renderItem={({ item }) => getImageTile(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {getHeader()}
        {getImageGrid()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    top: 50,
    position: 'absolute',
    width: '98%',
    alignSelf: 'center',
    height: 55,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[900],
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
});
