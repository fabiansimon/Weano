import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Avatar from './Avatar';
import Utils from '../utils';

export default function MembersModal({
  isVisible,
  onRequestClose,
  members,
  initalMemberId,
  onPress,
}) {
  const getUserTile = user => (
    <Pressable
      onPress={() => {
        onPress(user);
        onRequestClose();
      }}
      style={styles.tileContainer}>
      <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
        <Avatar size={30} avatarUri={user?.avatarUri} />
        <Body
          type={1}
          style={{marginLeft: 8}}
          text={`${user?.firstName} ${user?.lastName}`}
        />
      </View>
      <View
        style={
          user?.id === initalMemberId ? styles.activeBox : styles.inactiveBox
        }>
        <Icon name="check" color={COLORS.shades[0]} size={16} />
      </View>
    </Pressable>
  );

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Chooses user')}>
      <FlatList
        data={members}
        style={{marginHorizontal: PADDING.m, paddingTop: 8}}
        renderItem={({item}) => getUserTile(item)}
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
    borderColor: Utils.addAlpha(COLORS.neutral[300], 0.35),
  },
  tileContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
});
