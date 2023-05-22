import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import CategoryChip from './CategoryChip';

export default function SelectionModal({
  data,
  onRequestClose,
  isVisible,
  initIndex = 0,
  onPress,
  isCategories = false,
  title,
}) {
  const getTile = (item, index) => (
    <Pressable
      onPress={() => {
        onPress(index);
        onRequestClose();
      }}
      style={styles.tileContainer}>
      {isCategories ? (
        <CategoryChip
          disabled
          string={item.title}
          style={{marginRight: 'auto'}}
          color={item.color}
        />
      ) : (
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <Body type={1} style={{marginLeft: 8}} text={item.title} />
        </View>
      )}
      <View style={index === initIndex ? styles.activeBox : styles.inactiveBox}>
        <Icon name="check" color={COLORS.shades[0]} size={16} />
      </View>
    </Pressable>
  );

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={title}>
      <FlatList
        data={data}
        style={{marginHorizontal: PADDING.m, paddingTop: 8}}
        renderItem={({item, index}) => getTile(item, index)}
      />
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  activeBox: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveBox: {
    borderRadius: RADIUS.xl,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  tileContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
});
