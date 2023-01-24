import {
  FlatList, Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import PollTile from './PollTile';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Avatar from '../Avatar';
import userManagement from '../../utils/userManagement';
import activeTripStore from '../../stores/ActiveTripStore';
import VOTE_FOR_POLL from '../../mutations/voteForPoll';
import userStore from '../../stores/UserStore';

export default function PollView({
  style, data, title, subtitle, onPress, onVote,
}) {
  const [voteForPoll, { error }] = useMutation(VOTE_FOR_POLL);
  const { id } = userStore((state) => state.user);
  const { polls } = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  const handleVote = async (item) => {
    const { _id: pollId } = data;
    const { id: optionId } = item;

    updateActiveTrip({
      polls: polls.map((poll) => {
        if (poll._id === pollId) {
          const { options } = poll;
          const indexOption = options.findIndex((option) => option.id === optionId);
          const { votes } = options[indexOption];
          const indexVote = votes.indexOf(id);

          const nVotes = [...votes];
          if (indexVote === -1) {
            nVotes.push(id);
          } else {
            nVotes.splice(indexVote, 1);
          }

          const nOptions = options;
          nOptions[indexOption].votes = nVotes;
          console.log(nOptions);
          // console.log(newVotes);
          return {
            ...poll,
            options: nOptions,
          };
        }
        return poll;
      }),
    });

    await voteForPoll({
      variables: {
        data: {
          optionId,
          pollId,
        },
      },
    }).then(() => {

      // updateActiveTrip({ polls: polls.filter((p) => p._id !== _id) });
    })
      .catch((e) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const header = data ? title : i18n.t('Be the first one to add one!');

  return (
    <View style={[styles.pollContainer, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 5 }}>
        <View>
          <Headline
            type={4}
            text={header}
          />
          <Body
            type={2}
            text={subtitle}
            color={COLORS.neutral[300]}
            style={{ marginBottom: 16, marginTop: 2 }}
          />
        </View>
        {onPress ? (
          <Pressable
            onPress={onPress}
            style={styles.addIcon}
          >
            <Icon
              name="more-vertical"
              size={20}
              color={COLORS.neutral[700]}
            />
          </Pressable>
        ) : (
          <Avatar
            data={userManagement.convertIdToUser(data.creatorId)}
            size={35}
          />
        )}
      </View>
      <FlatList
        data={data.options}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <PollTile
            style={{ marginBottom: 16 }}
            item={item}
            data={data}
            index={index}
            onPress={() => handleVote(item)}
            isActive={false}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    borderRadius: 100,
    backgroundColor: COLORS.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    height: 35,
    width: 35,
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
