import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import CategoryChip from './CategoryChip';
import Utils from '../utils';
import activeTripStore from '../stores/ActiveTripStore';
import Headline from './typography/Headline';
import Avatar from './Avatar';
import userManagement from '../utils/userManagement';
import ATTACHMENT_TYPE from '../constants/Attachments';

export default function SelectionModal({
  data,
  attachment,
  onRequestClose,
  isVisible,
  initIndex = 0,
  onPress,
  isCategories = false,
  title,
}) {
  // STORES
  const {expenses, mutualTasks, polls, documents, activeMembers} =
    activeTripStore(state => state.activeTrip);
  // STATE && MISC
  const [attData, setAttData] = useState({
    title: '',
    data: [],
  });

  useEffect(() => {
    switch (attachment) {
      case ATTACHMENT_TYPE.expense:
        return setAttData({
          title: i18n.t('Select Expense'),
          data: expenses.map(e => {
            return {
              id: e._id,
              title: `${e.currency} ${e.amount}`,
              subtitle: `${i18n.t('Paid by')} ${
                activeMembers.find(m => m.id === e.paidBy)?.firstName
              } ${i18n.t('for')} ${e.title}`,
            };
          }),
        });
      case ATTACHMENT_TYPE.poll:
        return setAttData({
          title: i18n.t('Select Poll'),
          data: polls.map(p => {
            return {
              id: p._id,
              title: p.title,
              subtitle: `${i18n.t('Created by')} ${
                activeMembers.find(m => m.id === p.creatorId)?.firstName
              }`,
            };
          }),
        });
      case ATTACHMENT_TYPE.document:
        return setAttData({
          title: i18n.t('Select Document'),
          data: documents.map(d => {
            return {
              id: d._id,
              title: d.title,
              subtitle: `${i18n.t('Uploaded by')} ${
                activeMembers.find(m => m.id === d.creatorId)?.firstName
              }`,
            };
          }),
        });
      case ATTACHMENT_TYPE.task:
        return setAttData({
          title: i18n.t('Select Tasks'),
          data: mutualTasks.map(t => {
            return {
              id: t._id,
              title: t.title,
              subtitle: `${i18n.t('Assigned to')} ${
                activeMembers.find(m => m.id === t.assignee)?.firstName
              }`,
            };
          }),
        });

      default:
        break;
    }
  }, [attachment, isVisible]);

  const getAttachmentTile = item => {
    return (
      <Pressable
        onPress={() => {
          onPress({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            type: attachment,
          });
          onRequestClose();
        }}
        style={[styles.tileContainer, {marginBottom: 12}]}>
        <View style={{flex: 1}}>
          <Headline
            type={3}
            style={{maxWidth: '90%'}}
            numberOfLines={1}
            ellipsizeMode="tail"
            text={item.title}
          />
          <Body
            type={2}
            style={{fontWeight: '500'}}
            color={COLORS.neutral[300]}
            text={item.subtitle.trim()}
          />
        </View>
        <View style={styles.inactiveBox}>
          <Icon name="check" color={COLORS.shades[0]} size={16} />
        </View>
      </Pressable>
    );
  };

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
      title={attachment ? attData.title : title}>
      <FlatList
        data={attachment ? attData?.data : data}
        style={{marginHorizontal: PADDING.m, paddingTop: 8}}
        renderItem={({item, index}) =>
          attachment ? getAttachmentTile(item, index) : getTile(item, index)
        }
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
