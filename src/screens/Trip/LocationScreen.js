import { View, StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import PollView from '../../components/Polls/PollView';
import Headline from '../../components/typography/Headline';
import TitleModal from '../../components/TitleModal';
import Button from '../../components/Button';
import KeyboardView from '../../components/KeyboardView';
import TextField from '../../components/TextField';
import HighlightContainer from '../../components/Trip/HighlightContainer';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';

export default function LocationScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const mockData = [
    {
      title: 'Paris, France',
      subtitle: 'Fabian Simon',
      votes: 6,
    },
    {
      title: 'Pula, Croatia',
      subtitle: 'Julia',
      votes: 2,
    },
    {
      title: 'Vienna, Austria',
      subtitle: 'Matthias',
      votes: 0,
    },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [pollData, setPollData] = useState(mockData || null);

  const handleAddSuggestion = () => {
    const newSuggestion = {
      title: suggestion,
      subtitle: 'Fabian Simon',
      votes: 0,
    };

    setIsVisible(false);
    setPollData([...pollData, newSuggestion]);
  };

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find location')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <HighlightContainer
            description={i18n.t('Current location')}
            text="Paris, France"
            style={{ marginBottom: 30 }}
          />
          <View style={styles.pollContainer}>
            <PollView
              data={pollData}
              title={i18n.t('Where do you want to go?')}
              subtitle={i18n.t('The location can be choosen by the host')}
            />
            <Headline
              onPress={() => setIsVisible(true)}
              type={4}
              text={i18n.t('Add suggestion')}
              color={COLORS.neutral[500]}
              style={{
                alignSelf: 'center',
                marginTop: pollData ? 18 : -10,
                textDecorationLine: 'underline',
              }}
            />
          </View>
        </View>
      </HybridHeader>
      <TitleModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        title={i18n.t('Add suggestion')}
      >
        <KeyboardView>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
              <Headline
                type={4}
                text={i18n.t('What would you like to suggest?')}
                color={COLORS.neutral[700]}
              />
              <TextField
                style={{ marginTop: 18, marginBottom: 10 }}
                value={suggestion || null}
                onChangeText={(val) => setSuggestion(val)}
                placeholder={i18n.t('Barcelona, Spain')}
                onDelete={() => setSuggestion('')}
              />
            </View>
            <Button
              text={i18n.t('Add')}
              onPress={handleAddSuggestion}
              style={{ margin: 25, marginBottom: 30 }}
            />
          </View>
        </KeyboardView>
      </TitleModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  innerContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 36,
  },
  pollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
});
