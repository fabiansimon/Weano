import { View, StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import PollView from '../../components/Polls/PollView';
import Headline from '../../components/typography/Headline';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import AddSuggestionModal from '../../components/Trip/AddSuggestionModal';
import BoardingPassModal from '../../components/Trip/BoardingPassModal';

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
  const [pollData, setPollData] = useState(mockData || null);

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Find location')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <View style={styles.pollContainer}>
            <PollView
              data={pollData}
              title={i18n.t('Destination options')}
              subtitle={i18n.t('You can simply add a new one')}
            />
            <Headline
              onPress={() => setIsVisible(true)}
              type={4}
              text={i18n.t('Add suggestion')}
              color={COLORS.neutral[300]}
              style={{
                alignSelf: 'center',
                marginTop: pollData ? 18 : -10,
              }}
            />
          </View>
        </View>
      </HybridHeader>
      <AddSuggestionModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        data={pollData}
        setPollData={setPollData}
      />
      <BoardingPassModal
        type="destination"
        onRequestClose={() => setIsVisible(false)}
        isVisible={isVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  innerContainer: {
    paddingHorizontal: PADDING.s,
    paddingTop: 15,
    paddingBottom: 36,
  },
  pollContainer: {
    paddingVertical: 20,
    paddingHorizontal: PADDING.s,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
});
