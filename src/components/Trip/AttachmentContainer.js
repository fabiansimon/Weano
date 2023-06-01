import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntIcon from 'react-native-vector-icons/Entypo';
import COLORS, {RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import Divider from '../Divider';
import Subtitle from '../typography/Subtitle';
import i18n from '../../utils/i18n';
import ATTACHMENT_TYPE from '../../constants/Attachments';
import Body from '../typography/Body';
import Utils from '../../utils';

export default function AttachmentContainer({
  style,
  attachment,
  onClose,
  onPress,
  isSelf,
}) {
  if (!attachment) {
    return (
      <Subtitle
        type={2}
        color={Utils.addAlpha(
          isSelf ? COLORS.neutral[50] : COLORS.shades[100],
          0.5,
        )}
        style={{fontStyle: 'italic', marginTop: 4}}
        text={i18n.t('Attachment item was deleted')}
      />
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.attachmentContainer, style]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: onClose ? 0 : 2,
        }}>
        <Subtitle
          type={2}
          color={COLORS.neutral[500]}
          text={`${i18n.t('Attached')} ${attachment?.type}`}
        />
        {onClose && (
          <Pressable onPress={onClose} style={{marginTop: 0}}>
            <IonIcon
              name="close-outline"
              color={COLORS.neutral[500]}
              size={18}
            />
          </Pressable>
        )}
      </View>
      <Divider style={{marginHorizontal: -10, marginTop: 4, marginBottom: 6}} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Body
            numberOfLines={1}
            ellipsizeMode="tail"
            type={1}
            style={{fontWeight: '500'}}
            text={attachment.title}
          />
          <Subtitle
            type={2}
            style={{marginTop: 2}}
            color={COLORS.neutral[500]}
            text={attachment.subtitle}
          />
        </View>
        {attachment.type === ATTACHMENT_TYPE.task && (
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: attachment.isDone
                  ? COLORS.success[700]
                  : COLORS.error[900],
              },
            ]}>
            {attachment.isDone ? (
              <EntIcon name="check" color={COLORS.shades[0]} size={18} />
            ) : (
              <IonIcon name="close" color={COLORS.shades[0]} size={20} />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  attachmentContainer: {
    minWidth: '90%',
    marginTop: -4,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  checkbox: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
    height: 22,
  },
});
