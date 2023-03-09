import {
  View, StyleSheet, SectionList, Dimensions, Pressable,
} from 'react-native';
import React, {
  useEffect, useRef, useState,
} from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import CheckboxTile from '../../components/Trip/CheckboxTile';
import Body from '../../components/typography/Body';
import activeTripStore from '../../stores/ActiveTripStore';
import ADD_TASK from '../../mutations/addTask';
import userStore from '../../stores/UserStore';
import Utils from '../../utils';
import DELETE_TASK from '../../mutations/deleteTask';
import FAButton from '../../components/FAButton';
import UPDATE_TASK from '../../mutations/updateTask';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';
import Headline from '../../components/typography/Headline';
import InputModal from '../../components/InputModal';
import SwipeView from '../../components/SwipeView';

const asyncStorageDAO = new AsyncStorageDAO();

export default function PacklistScreen() {
  const mockData = [
    {
      title: 'Socks',
      isPacked: false,
      amount: 12,
    },
    {
      title: 'Underwear',
      isPacked: false,
      amount: 12,
    },
    {
      title: 'Passport',
      isPacked: true,
      amount: 1,
    },
    {
      title: 'Hawaii Shirt',
      isPacked: true,
      amount: 4,
    },
    {
      title: 'Sunglasses',
      isPacked: true,
      amount: 1,
    },
  ];

  // MUTATIONS
  const [addTask, { error }] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  // STORES
  const {
    mutualTasks, privateTasks, id: tripId,
  } = activeTripStore((state) => state.activeTrip);
  const { id: userId, isProMember } = userStore((state) => state.user);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [packData, setPackData] = useState([]);

  const { height } = Dimensions.get('window');

  useEffect(() => {
    setPackData(
      [
        {
          title: i18n.t('Done'),
          data: mockData.filter((item) => item.isPacked),
        },
        {
          title: i18n.t('Open'),
          data: mockData.filter((item) => !item.isPacked),
        },
      ],
    );
  }, []);

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

  const handleDeletion = (task) => {
    return;
    Utils.showConfirmationAlert(
      i18n.t('Delete Task'),
      i18n.t('Are you sure you want to delete your task?'),
      i18n.t('Yes'),
      async () => {
        const { _id, isPrivate } = task;
        console.log(task);

        await deleteTask({
          variables: {
            data: {
              id: _id,
              tripId,
              isPrivate,
            },
          },
        })
          .then(() => {
            Toast.show({
              type: 'success',
              text1: i18n.t('Whooray!'),
              text2: i18n.t('Task was succeessfully deleted!'),
            });

            console.log('hello');
            if (isPrivate) {
              updateActiveTrip({ privateTasks: privateTasks.filter((p) => p._id !== _id) });
            } else {
              updateActiveTrip({ mutualTasks: mutualTasks.filter((p) => p._id !== _id) });
            }
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

  const handleChange = async (data) => {
    return;
    setIsVisible(false);

    const usageLimit = JSON.parse(isProMember ? await asyncStorageDAO.getPremiumTierLimits() : await asyncStorageDAO.getFreeTierLimits()).checklist;
    if ([...mutualTasks, ...privateTasks].length >= usageLimit) {
      setTimeout(() => {
        PremiumController.showModal();
      }, 300);
      return;
    }

    const isPrivate = data.type === 'PRIVATE';
    setIsLoading(true);

    await addTask({
      variables: {
        task: isPrivate ? {
          title: data.task,
          tripId,
          isPrivate: true,
        } : {
          title: data.task,
          tripId,
          assignee: data.assignee.id,
        },
      },
    })
      .then((res) => {
        const id = res.data.createTask;
        if (isPrivate) {
          const newTask = {
            creatorId: userId,
            isDone: false,
            title: data.task,
            _id: id,
          };
          updateActiveTrip({ privateTasks: [...privateTasks, newTask] });
        } else {
          const newTask = {
            assignee: data.assignee.id,
            creatorId: userId,
            isDone: false,
            title: data.task,
            _id: id,
          };
          updateActiveTrip({ mutualTasks: [...mutualTasks, newTask] });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const handleUpdate = async (item) => {
    return;
    // const { _id: taskId, isDone } = item;

    // let oldData;
    // if (isPrivate) {
    //   oldData = privateTasks;
    //   updateActiveTrip({
    //     privateTasks: privateTasks.map((task) => ({
    //       ...task,
    //       isDone: task._id === taskId ? !task.isDone : task.isDone,
    //     })),
    //   });
    // } else {
    //   oldData = mutualTasks;
    //   updateActiveTrip({
    //     mutualTasks: mutualTasks.map((task) => ({
    //       ...task,
    //       isDone: task._id === taskId ? !task.isDone : task.isDone,
    //     })),
    //   });
    // }

    await updateTask({
      variables: {
        data: {
          // isDone: !isDone,
          // taskId,
        },
      },
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });

      // updateActiveTrip({ privateTasks: oldData });
      console.log(`ERROR: ${e.message}`);
    });
  };

  const handleCounterInput = (amount) => {
    console.log(amount);
  };

  const getItem = (item) => {
    const { isPacked, amount } = item;
    return (
      <SwipeView onDelete={() => console.log('deleted')}>
        <CheckboxTile
          style={{ paddingHorizontal: PADDING.xl, backgroundColor: COLORS.shades[0] }}
          trailing={(
            <View style={{
              flexDirection: 'row', alignItems: 'center',
            }}
            >
              <Pressable
                onPress={() => handleCounterInput(amount - 1)}
                style={styles.counterContainer}
              >
                <Icon
                  name="minus"
                  size={16}
                  color={COLORS.neutral[700]}
                />
              </Pressable>
              <Headline
                style={{
                  marginHorizontal: 6, minWidth: 20, textAlign: 'center',
                }}
                type={4}
                text={amount}
              />
              <Pressable
                onPress={() => handleCounterInput(amount + 1)}
                style={styles.counterContainer}
              >
                <Icon
                  name="plus"
                  size={16}
                  color={COLORS.neutral[700]}
                />
              </Pressable>
            </View>
        )}
          item={{
            ...item,
            isDone: isPacked,
          }}
          disableLabel
          onPress={() => handleUpdate(item)}
        />
      </SwipeView>
    );
  };

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Packlist')}
        scrollY={scrollY}
        info={INFORMATION.packlistScreen}
        scrollEnabled={false}
      >
        <SectionList
          // style={{ marginHorizontal: PADDING.l }}
          stickySectionHeadersEnabled
          sections={packData}
          ListEmptyComponent={(
            <View
              style={{
                flex: 1,
                height: height * 0.65,
                justifyContent: 'center',
              }}
            >
              <Body
                type={1}
                style={{ alignSelf: 'center' }}
                color={COLORS.shades[100]}
                text={i18n.t('There are no entries yet 😕')}
              />
              <Body
                type={2}
                style={{
                  alignSelf: 'center', textAlign: 'center', width: '85%', marginTop: 4,
                }}
                color={COLORS.neutral[300]}
                text={i18n.t('When the groups adds new polls, tasks, expenses or memories, they will be listed here.')}
              />
            </View>
              )}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => getItem(item)}
          renderSectionHeader={({ section: { title } }) => {
            const color = title === i18n.t('Done') ? COLORS.success[700] : COLORS.error[700];
            return (
              <View style={[styles.titleContainer, { backgroundColor: Utils.addAlpha(color, 0.2) }]}>
                <Body
                  type={2}
                  color={color}
                  style={{ fontWeight: '500' }}
                  text={title}
                />
              </View>
            );
          }}
        />
      </HybridHeader>
      <InputModal
        packingInput
        isVisible={isVisible}
        autoCorrect={false}
        autoCapitalize={false}
        multipleInputs
        placeholder={i18n.t('Add items to pack')}
        onRequestClose={() => setIsVisible(false)}
        onPress={(input) => console.log(input)}
        autoClose
      />
      <FAButton
        isLoading={isLoading}
        icon="add"
        iconSize={28}
        onPress={() => setIsVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  titleContainer: {
    marginRight: 'auto',
    paddingVertical: 4,
    marginLeft: PADDING.l,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  counterContainer: {
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[100],
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
