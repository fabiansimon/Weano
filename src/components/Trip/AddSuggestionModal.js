import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import TitleModal from '../TitleModal';
import i18n from '../../utils/i18n';
import KeyboardView from '../KeyboardView';
import Headline from '../typography/Headline';
import COLORS, {PADDING} from '../../constants/Theme';
import TextField from '../TextField';
import Chip from '../Chip';
import Button from '../Button';

export default function AddSuggestionModal({
  isVisible,
  onRequestClose,
  data,
  setPollData,
}) {
  const [suggestion, setSuggestion] = useState('');

  const handleSuggestion = () => {
    if (suggestion.trim() === '') return;

    const newSuggestion = {
      title: suggestion,
      subtitle: 'Fabian Simon',
      votes: 0,
    };

    onRequestClose();
    setPollData([...data, newSuggestion]);
    setSuggestion('');
  };
  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add suggestion')}>
      <KeyboardView paddingBottom={50}>
        <View style={{flex: 1}}>
          <View
            style={{
              paddingHorizontal: PADDING.l,
              paddingTop: 25,
              paddingBottom: 15,
            }}>
            <Headline
              type={3}
              text={i18n.t('Add a destiny')}
              color={COLORS.neutral[700]}
            />
            <TextField
              style={{
                marginTop: 18,
                backgroundColor: COLORS.neutral[50],
              }}
              value={suggestion || null}
              onChangeText={val => setSuggestion(val)}
              placeholder={i18n.t('Barcelona, Spain')}
              onDelete={() => setSuggestion('')}
            />
            <View style={styles.wrapContainer}>
              {data.map(sugg => (
                <Chip
                  style={{marginBottom: 10, marginRight: 10}}
                  text={sugg.string}
                  onDelete={() => console.log('delete')}
                />
              ))}
            </View>
          </View>
          <Button
            text={i18n.t('Add')}
            onPress={handleSuggestion}
            style={{
              marginTop: 'auto',
              marginHorizontal: PADDING.m,
              marginBottom: 30,
            }}
          />
        </View>
      </KeyboardView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  wrapContainer: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
