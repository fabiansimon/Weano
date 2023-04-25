import {Platform, Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import {MenuView} from '@react-native-menu/menu';
import PollTile from './PollTile';
import Body from '../typography/Body';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Avatar from '../Avatar';
import userManagement from '../../utils/userManagement';
import activeTripStore from '../../stores/ActiveTripStore';
import VOTE_FOR_POLL from '../../mutations/voteForPoll';
import userStore from '../../stores/UserStore';
import Divider from '../Divider';
import Subtitle from '../typography/Subtitle';

const MAX_LENGTH = 2;

export default function PollView({
  style,
  data,
  title,
  onPress,
  isMinimized = false,
  onNavigation,
}) {
  // MUTATIONS
  const [voteForPoll] = useMutation(VOTE_FOR_POLL);

  // STORES
  const {id} = userStore(state => state.user);
  const {polls, activeMembers} = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);

  const handleVote = async item => {
    const {_id: pollId} = data;
    const {id: optionId} = item;

    const oldPolls = polls;
    const updatedPolls = polls.map(poll => {
      if (poll._id === pollId) {
        const nOptions = poll.options;
        const oIndex = nOptions.findIndex(o => o.id === optionId);

        const nVotes = [...nOptions[oIndex].votes];
        const vIndex = nVotes.findIndex(v => v === id);

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

    updateActiveTrip({polls: updatedPolls});

    await voteForPoll({
      variables: {
        data: {
          optionId,
          pollId,
        },
      },
    }).catch(e => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      updateActiveTrip({polls: oldPolls});
      console.log(`ERROR: ${e.message}`);
    });
  };

  const header = data ? title : i18n.t('Be the first one to add one!');
  const creator = userManagement.convertIdToUser(data?.creatorId);

  return (
    <Pressable onPress={onNavigation} style={[styles.pollContainer, style]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 5,
        }}>
        <View>
          <Body type={1} style={{fontWeight: '500'}} text={header} />
          <Body
            type={2}
            text={`${i18n.t('Created by')} ${creator?.firstName}`}
            color={COLORS.neutral[300]}
            style={{marginBottom: 16}}
          />
        </View>
        {onPress ? (
          <MenuView
            style={styles.addIcon}
            onPressAction={({nativeEvent}) => onPress(nativeEvent)}
            actions={[
              {
                id: 'delete',
                attributes: {
                  destructive: true,
                },
                title: i18n.t('Delete Poll'),
                image: Platform.select({
                  ios: 'trash',
                  android: 'ic_menu_delete',
                }),
              },
            ]}>
            <Icon name="more-vertical" size={20} color={COLORS.neutral[700]} />
          </MenuView>
        ) : (
          <Avatar
            data={userManagement.convertIdToUser(data.creatorId)}
            size={35}
          />
        )}
      </View>
      {data.options.map((option, index) => {
        if ((isMinimized && index < 2) || !isMinimized) {
          return (
            <PollTile
              activeMembers={activeMembers}
              key={option.id}
              style={{marginBottom: 10}}
              item={option}
              data={data}
              index={index}
              onPress={() => handleVote(option)}
              isActive={option.votes.includes(id)}
            />
          );
        }
        if (isMinimized && index === 2) {
          return (
            <View style={{marginTop: -6}}>
              <Divider
                style={{
                  marginHorizontal: -6,
                }}
                color={COLORS.neutral[100]}
              />
              <Body
                type={2}
                color={COLORS.neutral[300]}
                style={{alignSelf: 'center'}}
                text={`+ ${data.options.length - MAX_LENGTH} ${i18n.t(
                  'more options',
                )}`}
              />
            </View>
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
