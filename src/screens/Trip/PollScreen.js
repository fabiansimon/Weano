import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Animated from 'react-native-reanimated';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import COLORS, {PADDING} from '../../constants/Theme';
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
import DELETE_POLL from '../../mutations/deletePoll';
import Body from '../../components/typography/Body';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';

const asyncStorageDAO = new AsyncStorageDAO();

export default function PollScreen() {
  // MUTATIONS
  const [addPoll, {loading, error}] = useMutation(ADD_POLL);
  const [deletePoll, {error: deleteError}] = useMutation(DELETE_POLL);

  // STORES
  const {
    polls,
    id: tripId,
    activeMembers,
  } = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const user = userStore(state => state.user);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {height} = Dimensions.get('window');

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

  const handleDelete = poll => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Poll'),
      i18n.t('Are you sure you want to delete your poll?'),
      i18n.t('Yes'),
      async () => {
        const {_id} = poll;

        await deletePoll({
          variables: {
            data: {
              id: _id,
              tripId,
            },
          },
        })
          .then(() => {
            Toast.show({
              type: 'success',
              text1: i18n.t('Whooray!'),
              text2: i18n.t('Poll was succeessfully deleted!'),
            });

            updateActiveTrip({polls: polls.filter(p => p._id !== _id)});
          })
          .catch(e => {
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

  const handleAddPoll = async data => {
    const usageLimit = JSON.parse(
      user?.isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).polls;
    if (polls.length >= usageLimit) {
      return PremiumController.showModal();
    }

    const {title} = data;
    const {options: optionsData} = data;

    const options = optionsData
      .map(item => ({
        option: item,
        votes: [],
      }))
      .filter(item => item.option !== '');

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
    })
      .then(res => {
        const {id, options: newOptions} = res.data.createPoll;

        const newPoll = {
          createdAt: Date.now(),
          creatorId: user.id,
          title,
          options: newOptions,
          _id: id,
        };
        updateActiveTrip({polls: [...polls, newPoll]});
      })
      .catch(e => {
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
        title={i18n.t('Polls')}
        scrollY={scrollY}
        info={INFORMATION.pollScreen}>
        <View style={styles.innerContainer}>
          <FlatList
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  height: height * 0.65,
                  justifyContent: 'center',
                }}>
                <Body
                  type={1}
                  style={{alignSelf: 'center'}}
                  color={COLORS.shades[100]}
                  text={i18n.t('There are no polls yet 😕')}
                />
                <Body
                  type={2}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    width: '85%',
                    marginTop: 4,
                  }}
                  color={COLORS.neutral[300]}
                  text={i18n.t(
                    'Use polls to figure out what the majority wants. Once created all the polls will be shown here.',
                  )}
                />
              </View>
            }
            data={polls}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 24,
                  borderTopColor: COLORS.neutral[100],
                  borderTopWidth: 1,
                }}
              />
            )}
            renderItem={({item}) => {
              const isDeletedUser = !activeMembers.includes(item.creatorId);
              const onPress =
                user.id === item?.creatorId || isDeletedUser
                  ? () => handleDelete(item)
                  : null;

              return (
                <PollView
                  style={{marginHorizontal: 5}}
                  onPress={onPress}
                  data={item}
                  title={item.title}
                  subtitle={Utils.getDateFromTimestamp(
                    item.createdAt / 1000,
                    'HH:mm • Do MMMM ',
                  )}
                />
              );
            }}
          />
        </View>
      </HybridHeader>
      <FAButton icon="add" iconSize={28} onPress={() => setIsVisible(true)} />
      <AddPollModal
        polls={polls}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onPress={data => handleAddPoll(data)}
        isLoading={isLoading || loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  innerContainer: {
    paddingHorizontal: PADDING.s,
    paddingTop: 15,
    paddingBottom: 120,
  },
});
