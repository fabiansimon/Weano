import { View, StyleSheet, FlatList } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import PollView from '../../components/Polls/PollView';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import activeTripStore from '../../stores/ActiveTripStore';
import Utils from '../../utils';
import FAButton from '../../components/FAButton';
import AddPollModal from '../../components/Trip/AddPollModal';
import ADD_POLL from '../../mutations/addPoll';
import userStore from '../../stores/UserStore';

export default function PollScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { polls, id } = activeTripStore((state) => state.activeTrip);
  const user = userStore((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [addPoll, { loading, error }] = useMutation(ADD_POLL);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
      }, 500);
    }
  }, [error]);

  const handleAddPoll = async (data) => {
    const title = data[0].value;
    const optionsArr = data.splice(1, data.length);

    const options = optionsArr.map((item) => ({
      option: item.value,
      votes: [],
    }));

    setIsLoading(true);

    await addPoll({
      variables: {
        poll: {
          title,
          tripId: id,
          options,
        },
      },
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      console.log(`ERROR: ${e.message}`);
    });
    setIsLoading(false);
    setIsVisible(false);
  };
  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Polls 📊')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={styles.innerContainer}>
          <FlatList
            data={polls}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            renderItem={({ item }) => {
              const onPress = user.id === item.creatorId ? () => console.log('hello') : null;
              return (
                <PollView
                  onPress={onPress}
                  data={item}
                  title={item.title}
                  subtitle={Utils.getDateFromTimestamp(item.createdAt / 1000, 'DD.MM.YYYY • HH:mm')}
                />
              );
            }}
          />
        </View>
      </HybridHeader>
      <FAButton
        icon="add"
        iconSize={28}
        onPress={() => setIsVisible(true)}
      />
      <AddPollModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onPress={(data) => handleAddPoll(data)}
        isLoading={isLoading || loading}
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
    paddingBottom: 120,
  },
});
