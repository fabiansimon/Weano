/* eslint-disable no-mixed-operators */
/* eslint-disable prefer-const */
import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
// eslint-disable-next-line import/no-named-as-default
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
  style, data, title, subtitle, onPress, isMinimized = false, onNavigation,
}) {
  const [voteForPoll] = useMutation(VOTE_FOR_POLL);
  const { id } = userStore((state) => state.user);
  const { polls, activeMembers } = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  const handleVote = async (item) => {
    const { _id: pollId } = data;
    const { id: optionId } = item;

    const oldPolls = polls;
    const updatedPolls = polls.map((poll) => {
      if (poll._id === pollId) {
        let nOptions = poll.options;
        const oIndex = nOptions.findIndex((o) => o.id === optionId);

        let nVotes = [...nOptions[oIndex].votes];
        const vIndex = nVotes.findIndex((v) => v === id);

        if (vIndex === -1) {
          nVotes.push(id);
        } else {
          nVotes.splice(vIndex, 1);
        }

        const options = nOptions.map((o, i) => {
          if (i === oIndex) {
            return {
              ...o,
              votes: nVotes,
            };
          }
          return o;
        });

        return {
          ...poll,
          options,
        };
      }
      return poll;
    });

    updateActiveTrip({ polls: updatedPolls });

    await voteForPoll({
      variables: {
        data: {
          optionId,
          pollId,
        },
      },
    })
      .catch((e) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        updateActiveTrip({ polls: oldPolls });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const header = data ? title : i18n.t('Be the first one to add one!');

  return (
    <Pressable
      onPress={onNavigation}
      style={[styles.pollContainer, style]}
    >
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
      {data.options.map((option, index) => {
        if (isMinimized && index < 2 || !isMinimized) {
          return (
            <PollTile
              activeMembers={activeMembers}
              key={option.id}
              style={{ marginBottom: 16 }}
              item={option}
              data={data}
              index={index}
              onPress={() => handleVote(option)}
              isActive={option.votes.includes(id)}
            />
          );
        } if (isMinimized && index === 2) {
          return (
            <Body
              type={1}
              color={COLORS.neutral[300]}
              style={{ marginLeft: 8, textAlign: 'center' }}
              text={i18n.t('see more options')}
            />
          );
        }
        return null;
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
  },
  pollContainer: {
    borderRadius: 14,
  },
});
