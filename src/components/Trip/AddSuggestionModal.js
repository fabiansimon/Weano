import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import TitleModal from '../TitleModal';
import i18n from '../../utils/i18n';
import KeyboardView from '../KeyboardView';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import TextField from '../TextField';
import Divider from '../Divider';

export default function AddSuggestionModal({
  isVisible, onRequestClose, data, setPollData,
}) {
  const [suggestion, setSuggestion] = useState('');

  const handleSuggestion = () => {
    const newSuggestion = {
      title: suggestion,
      subtitle: 'Fabian Simon',
      votes: 0,
    };

    onRequestClose();
    setPollData([...data, newSuggestion]);
  };
  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add suggestion')}
    >
      <KeyboardView>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 25, paddingBottom: 15 }}>
            <Headline
              type={4}
              text={i18n.t('Add a destiny')}
              color={COLORS.neutral[700]}
            />
            <TextField
              style={{
                marginTop: 18, marginBottom: 0, backgroundColor: COLORS.neutral[50], borderWidth: 0,
              }}
              value={suggestion || null}
              onChangeText={(val) => setSuggestion(val)}
              placeholder={i18n.t('Barcelona, Spain')}
              onDelete={() => setSuggestion('')}
            />
          </View>
          <Divider color={COLORS.neutral[50]} />
          {/* <View style={styles.wrapContainer}>
            {data.map((invitee) => (
              <Chip
                key={invitee.name}
                style={{ marginBottom: 10, marginRight: 10 }}
                string={invitee.name}
                onDelete={() => console.log(`delete: ${invitee.name}`)}
              />
            ))}
          </View> */}
          {/* <Button
            text={i18n.t('Add')}
            onPress={handleSuggestion}
            style={{ margin: 25, marginBottom: 30 }}
          /> */}
        </View>
      </KeyboardView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  wrapContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
