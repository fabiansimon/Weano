import {
  StyleSheet, ScrollView, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import COLORS, { PADDING } from '../constants/Theme';
import Body from './typography/Body';

export default function ContactsModal({
  isVisible, onRequestClose, data,
}) {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  useEffect(() => {
    setSelectedContacts(data);
  }, []);

  const getNumberTile = (n) => (
    <TouchableOpacity
      style={styles.numberContainer}

    >
      <View>
        <Body
          text={capitalize(n.label)}
          type={3}
        />
        <Body
          text={n.number}
          type={3}
          color={COLORS.neutral[700]}
        />
      </View>
      {/* {selectedNumber === n.number && (
      <Icon
        name="check"
        size={22}
      />
      )} */}
    </TouchableOpacity>
  );

  const ContactTile = ({ contact, index }) => {
    const expandable = contact.phoneNumbers.length > 1;

    return (
      <View>
        <TouchableOpacity
          onPress={() => (expandable ? setExpandedIndex((prev) => (prev === index ? -1 : index)) : addInvitee(contact))}
          activeOpacity={0.7}
          style={[styles.container, { borderTopWidth: index !== 0 && 1 }]}
        >
          <Body
            type={3}
            text={`${contact.givenName} ${contact.familyName}`}
            color={COLORS.neutral[700]}
          />
          {expandable
          && (
            <Icon
              name="chevron-down"
              size={24}
              color={COLORS.neutral[300]}
            />
          )}
        </TouchableOpacity>
        {expandedIndex === index && (
        <View>
          {contact.phoneNumbers.map((n) => getNumberTile(n, contact))}
        </View>
        )}
      </View>
    );
  };

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
          <ContactTile contact={contact} index={index} />
        ))}
      </ScrollView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopColor: COLORS.neutral[100],
  },
});
