import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Animated from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/AntDesign';
import {MenuView} from '@react-native-menu/menu';
import COLORS, {PADDING} from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Divider from '../../components/Divider';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import CheckboxTile from '../../components/Trip/CheckboxTile';
import AddTaskModal from '../../components/Trip/AddTaskModal';
import Body from '../../components/typography/Body';
import activeTripStore from '../../stores/ActiveTripStore';
import ADD_TASK from '../../mutations/addTask';
import userStore from '../../stores/UserStore';
import Utils from '../../utils';
import DELETE_TASK from '../../mutations/deleteTask';
import FAButton from '../../components/FAButton';
import UPDATE_TASK from '../../mutations/updateTask';
import SEND_REMINDER from '../../mutations/sendReminder';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';

const asyncStorageDAO = new AsyncStorageDAO();

export default function ChecklistScreen() {
  // MUTATIONS
  const [addTask, {error}] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [sendReminder] = useMutation(SEND_REMINDER);

  // STORES
  const {
    mutualTasks,
    privateTasks,
    id: tripId,
    dateRange,
  } = activeTripStore(state => state.activeTrip);
  const {id: userId, isProMember} = userStore(state => state.user);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [filterOption, setFilterOption] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emptyString =
    filterOption === 0
      ? i18n.t('No tasks added yet')
      : filterOption === 1
      ? i18n.t('No done tasks')
      : i18n.t('No open tasks');

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

  const taskCount = isDone => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const length =
      privateTasks?.filter(task => task.isDone === isDone).length +
      mutualTasks?.filter(task => task.isDone === isDone).length;
    return length || 0;
  };

  const handleMenuOption = (task, {event}) => {
    if (event === 'delete') {
      handleDeletion(task);
    }

    if (event === 'reminder') {
      handleReminder(task);
    }
  };

  const handleReminder = async task => {
    const {assignee, title} = task;
    const now = Date.now() / 1000;
    const difference = ((dateRange.startDate - now) / 86400).toFixed(0);

    let addString = '';
    if (difference > 0) {
      // eslint-disable-next-line eqeqeq
      addString = `\n${i18n.t('Only')} ${difference} ${
        difference == 1 ? i18n.t('day left') : i18n.t('days left')
      }⏳`;
    }
    await sendReminder({
      variables: {
        data: {
          receivers: [assignee],
          title: i18n.t("Don't forget! 💭"),
          description: `${i18n.t(
            'You still have to finish your task:',
          )} "${title}"${addString}`,
          tripId,
          type: 'task_reminder',
        },
      },
    })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('Success!'),
          text2: i18n.t('Reminder was sent out'),
        });
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const handleDeletion = task => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Task'),
      i18n.t('Are you sure you want to delete your task?'),
      i18n.t('Yes'),
      async () => {
        const {_id, isPrivate} = task;

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

            if (isPrivate) {
              updateActiveTrip({
                privateTasks: privateTasks.filter(p => p._id !== _id),
              });
            } else {
              updateActiveTrip({
                mutualTasks: mutualTasks.filter(p => p._id !== _id),
              });
            }
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

  const handleChange = async data => {
    setIsVisible(false);

    const usageLimit = JSON.parse(
      isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).checklist;
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
        task: isPrivate
          ? {
              title: data.task,
              tripId,
              isPrivate: true,
            }
          : {
              title: data.task,
              tripId,
              assignee: data.assignee.id,
            },
      },
    })
      .then(res => {
        const id = res.data.createTask;
        if (isPrivate) {
          const newTask = {
            creatorId: userId,
            isDone: false,
            title: data.task,
            _id: id,
          };
          updateActiveTrip({privateTasks: [...privateTasks, newTask]});
        } else {
          const newTask = {
            assignee: data.assignee.id,
            creatorId: userId,
            isDone: false,
            title: data.task,
            _id: id,
          };
          updateActiveTrip({mutualTasks: [...mutualTasks, newTask]});
        }
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const handleUpdate = async (item, isPrivate) => {
    const {_id: taskId, isDone} = item;

    let oldData;
    if (isPrivate) {
      oldData = privateTasks;
      updateActiveTrip({
        privateTasks: privateTasks.map(task => ({
          ...task,
          isDone: task._id === taskId ? !task.isDone : task.isDone,
        })),
      });
    } else {
      oldData = mutualTasks;
      updateActiveTrip({
        mutualTasks: mutualTasks.map(task => ({
          ...task,
          isDone: task._id === taskId ? !task.isDone : task.isDone,
        })),
      });
    }

    await updateTask({
      variables: {
        data: {
          isDone: !isDone,
          taskId,
        },
      },
    }).catch(e => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });

      if (isPrivate) {
        updateActiveTrip({privateTasks: oldData});
      } else {
        updateActiveTrip({mutualTasks: oldData});
      }
      console.log(`ERROR: ${e.message}`);
    });
  };

  const getActions = (isPrivate, isCreator) => {
    const deleteAction = {
      id: 'delete',
      attributes: {
        destructive: true,
      },
      title: i18n.t('Delete Task'),
      image: Platform.select({
        ios: 'trash',
        android: 'ic_menu_delete',
      }),
    };
    const reminder = {
      id: 'reminder',
      title: i18n.t('Remind assignee'),
    };

    if (isPrivate) {
      return [deleteAction];
    }

    if (isCreator) {
      return [reminder, deleteAction];
    }

    return [reminder];
  };

  const getHeaderChips = () => (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: PADDING.m,
        marginTop: 20,
      }}>
      {filterOption !== 2 && (
        <Pressable
          onPress={() => setFilterOption(prev => (prev === 1 ? 0 : 1))}
          style={[
            styles.chipContainer,
            {backgroundColor: COLORS.success[500]},
          ]}>
          <Body type={1} text={i18n.t('Done')} color={COLORS.shades[0]} />
          {filterOption !== 1 ? (
            <View
              style={[
                styles.innerCircle,
                {backgroundColor: COLORS.success[700]},
              ]}>
              <Body type={1} text={taskCount(true)} color={COLORS.shades[0]} />
            </View>
          ) : (
            <Icon
              name="closecircle"
              color={COLORS.shades[0]}
              size={16}
              style={{marginLeft: 20, marginRight: 4}}
              onPress={() => setFilterOption(0)}
              suppressHighlighting
            />
          )}
        </Pressable>
      )}
      {filterOption !== 1 && (
        <Pressable
          onPress={() => setFilterOption(prev => (prev === 2 ? 0 : 2))}
          style={[
            styles.chipContainer,
            {
              backgroundColor: COLORS.error[500],
              marginLeft: filterOption !== 2 ? 10 : 0,
            },
          ]}>
          <Body type={1} text={i18n.t('Open')} color={COLORS.shades[0]} />
          {filterOption !== 2 ? (
            <View
              style={[
                styles.innerCircle,
                {backgroundColor: COLORS.error[700]},
              ]}>
              <Body type={1} text={taskCount(false)} color={COLORS.shades[0]} />
            </View>
          ) : (
            <Icon
              name="closecircle"
              color={COLORS.shades[0]}
              size={16}
              style={{marginLeft: 20, marginRight: 4}}
              onPress={() => setFilterOption(0)}
              suppressHighlighting
            />
          )}
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Checklist')}
        scrollY={scrollY}
        info={INFORMATION.checklistScreen}>
        {getHeaderChips()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 30}}>
          <View
            style={{
              marginHorizontal: PADDING.l,
            }}>
            <Headline type={4} text={i18n.t('Mutual list')} />
            <Divider top={12} />
            <FlatList
              scrollEnabled={false}
              data={
                filterOption === 0
                  ? mutualTasks
                  : filterOption === 1
                  ? mutualTasks.filter(task => task.isDone)
                  : mutualTasks.filter(task => !task.isDone)
              }
              ListEmptyComponent={() => (
                <Body
                  style={{marginBottom: 10}}
                  type={2}
                  text={emptyString}
                  color={COLORS.neutral[300]}
                />
              )}
              renderItem={({item}) => {
                const {creatorId, assignee} = item;
                const isCreator = creatorId === userId;
                const isAssignee = assignee === userId;

                return (
                  <CheckboxTile
                    trailing={
                      <MenuView
                        style={styles.addIcon}
                        onPressAction={({nativeEvent}) =>
                          handleMenuOption(item, nativeEvent)
                        }
                        actions={getActions(false, isCreator)}>
                        <FeatherIcon
                          name="more-vertical"
                          size={20}
                          color={COLORS.neutral[700]}
                        />
                      </MenuView>
                    }
                    disabled={!isAssignee && !isCreator}
                    isCreator={isCreator}
                    style={{marginVertical: 4, paddingLeft: 5}}
                    item={{
                      ...item,
                      isPrivate: false,
                    }}
                    onPress={() => handleUpdate(item, false)}
                  />
                );
              }}
            />
          </View>
          <View style={{marginTop: 20, marginHorizontal: PADDING.l}}>
            <Headline type={4} text={i18n.t('Private list')} />
            <Divider top={12} />
            <FlatList
              contentContainerStyle={{marginBottom: 100}}
              scrollEnabled={false}
              data={
                filterOption === 0
                  ? privateTasks
                  : filterOption === 1
                  ? privateTasks.filter(task => task.isDone)
                  : privateTasks.filter(task => !task.isDone)
              }
              ListEmptyComponent={() => (
                <Body
                  style={{marginBottom: 10}}
                  type={2}
                  text={emptyString}
                  color={COLORS.neutral[300]}
                />
              )}
              renderItem={({item}) => (
                <CheckboxTile
                  trailing={
                    <MenuView
                      style={styles.addIcon}
                      onPressAction={({nativeEvent}) =>
                        handleMenuOption(
                          {
                            ...item,
                            isPrivate: true,
                          },
                          nativeEvent,
                        )
                      }
                      actions={getActions(true)}>
                      <FeatherIcon
                        name="more-vertical"
                        size={20}
                        color={COLORS.neutral[700]}
                      />
                    </MenuView>
                  }
                  style={{paddingLeft: 5}}
                  item={{
                    ...item,
                    isPrivate: true,
                  }}
                  disableLabel
                  onPress={() => handleUpdate(item, true)}
                />
              )}
            />
          </View>
        </ScrollView>
      </HybridHeader>
      <AddTaskModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onPress={data => handleChange(data)}
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
  chipContainer: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
    flexDirection: 'row',
    height: 38,
    borderRadius: 100,
  },
  innerCircle: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    marginLeft: 12,
  },
  addIcon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
  },
});
