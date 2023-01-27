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
import Headline from '../../components/typography/Headline';
import DELETE_POLL from '../../mutations/deletePoll';
import FilterModal from '../../components/FilterModal';

export default function PollScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { polls, id: tripId } = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const { id: userId } = userStore((state) => state.user);
  const user = userStore((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pollSelected, setPollSelected] = useState(null);

  const [addPoll, { loading, error }] = useMutation(ADD_POLL);
  const [deletePoll, { error: deleteError }] = useMutation(DELETE_POLL);

  const inputOptions = {
    title: pollSelected?.title,
    options: [
      {
        name: 'Delete Poll',
        onPress: () => handleDelete(pollSelected),
        deleteAction: true,
      },
    ],
  };

  useEffect(() => {
    if (error || deleteError) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error?.message || deleteError?.message,
        });
      }, 500);
    }
  }, [error, deleteError]);

  const handleDelete = (poll) => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Poll'),
      i18n.t('Are you sure you want to delete your poll?'),
      i18n.t('Yes'),
      async () => {
        const { _id } = poll;

        await deletePoll({
          variables: {
            data: {
              id: _id,
              tripId,
            },
          },
        }).then(() => {
          Toast.show({
            type: 'success',
            text1: i18n.t('Whooray!'),
            text2: i18n.t('Poll was succeessfully deleted!'),
          });

          updateActiveTrip({ polls: polls.filter((p) => p._id !== _id) });
        })
          .catch((e) => {
            Toast.show({
              type: 'error',
              text1: i18n.t('Whoops!'),
              text2: e.message,
            });
            console.log(`ERROR: ${e.message}`);
          });
      },
    );
  };

  const handleAddPoll = async (data) => {
    const title = data[0].value.trim();
    const optionsArr = data.splice(1, data.length);

    const options = optionsArr.map(((item) => ({
      option: item.value,
      votes: [],
    }))).filter(((item) => item.option !== ''));

    if (options.length <= 1 || title.length <= 0) {
      return;
    }

    setIsLoading(true);

    await addPoll({
      variables: {
        poll: {
          title,
          tripId,
          options,
        },
      },
    }).then((res) => {
      const id = res.data.createPoll;

      console.log(id);
      const newPoll = {
        createdAt: Date.now(),
        creatorId: userId,
        title,
        options,
        _id: id,
      };
      updateActiveTrip({ polls: [...polls, newPoll] });
    })
      .catch((e) => {
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
            ListEmptyComponent={(
              <Headline
                type={4}
                style={{
                  textAlign: 'center', alignSelf: 'center', marginTop: 18,
                }}
                text={i18n.t('No polls yet. \nBe the first one to add one 😎')}
                color={COLORS.neutral[300]}
              />
          )}
            data={polls}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            renderItem={({ item }) => {
              const onPress = user.id === item.creatorId ? () => setPollSelected(item) : null;
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
      <FilterModal
        isVisible={pollSelected !== null}
        onRequestClose={() => setPollSelected(null)}
        data={inputOptions}
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
