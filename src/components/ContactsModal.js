import {
  StyleSheet, ScrollView,
} from 'react-native';
import React from 'react';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import ContactTile from './ContactTile';

export default function ContactsModal({
  isVisible, onRequestClose, data, onAdd,
}) {
  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add friends')}
    >
      {/* <TextField
        placeholder={i18n.t('Filter trip')}
        style={{ backgroundColor: COLORS.neutral[50], borderWidth: 0, margin: PADDING.l }}
      /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {data.map((contact, index) => (
          <ContactTile contact={contact} index={index} onAdd={(c) => onAdd(c)} />
        ))}
      </ScrollView>
    </TitleModal>
  );
}
