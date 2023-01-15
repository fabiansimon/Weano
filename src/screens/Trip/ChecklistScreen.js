import {
  View, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import React, {
  useEffect, useRef, useState,
} from 'react';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS, { PADDING } from '../../constants/Theme';
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
import FilterModal from '../../components/FilterModal';
import Utils from '../../utils';
import DELETE_TASK from '../../mutations/deleteTask';
import FAButton from '../../components/FAButton';
import UPDATE_TASK from '../../mutations/updateTask';

export default function ChecklistScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { mutualTasks, privateTasks, id: tripId } = activeTripStore((state) => state.activeTrip);

  const [addTask, { error }] = useMutation(ADD_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  const { id: userId } = userStore((state) => state.user);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const [filterOption, setFilterOption] = useState(0);
  const [taskSelected, setSelectedTask] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const emptyString = filterOption === 0 ? i18n.t('No task added yet') : filterOption === 1 ? i18n.t('No done tasks') : i18n.t('No open tasks');

  const inputOptions = {
    title: `${i18n.t('Task')}: ${taskSelected?.title}`,
    options: [
      {
        name: 'Delete Task',
        value: 'deleteTask',
        deleteAction: true,
      },
    ],
  };

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

  const taskCount = (isDone) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const length = privateTasks?.filter((task) => task.isDone === isDone).length + mutualTasks?.filter((task) => task.isDone === isDone).length;
    return length || 0;
  };

  const handleInput = (operation, task) => {
    if (operation === 'deleteTask') {
      Utils.showConfirmationAlert(
        i18n.t('Delete Task'),
        i18n.t('Are you sure you want to delete your task?'),
        i18n.t('Yes'),
        async () => {
          const { _id, isPrivate } = task;

          const oldPrivateTasks = privateTasks;
          const oldMutualTasks = mutualTasks;

          if (isPrivate) {
            updateActiveTrip({ privateTasks: privateTasks.filter((p) => p._id !== _id) });
          } else {
            updateActiveTrip({ mutualTasks: mutualTasks.filter((p) => p._id !== _id) });
          }

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
                text2: i18n.t('Poll was succeessfully deleted!'),
              });
            })
            .catch((e) => {
              Toast.show({
                type: 'error',
                text1: i18n.t('Whoops!'),
                text2: e.message,
              });

              if (isPrivate) {
                updateActiveTrip({ privateTasks: oldPrivateTasks });
              } else {
                updateActiveTrip({ mutualTasks: oldMutualTasks });
              }
              console.log(`ERROR: ${e.message}`);
            });
        },
      );
    }
  };

  const handleChange = async (data) => {
    let oldPrivateTasks;
    let oldMutualTasks;
    setIsVisible(false);
    const isPrivate = data.type === 'PRIVATE';

    if (isPrivate) {
      oldPrivateTasks = privateTasks;
      const newTask = {
        creatorId: userId,
        isDone: false,
        title: data.task,
      };
      updateActiveTrip({ privateTasks: [...privateTasks, newTask] });
    } else {
      oldMutualTasks = mutualTasks;
      const newTask = {
        assignee: data.assignee.id,
        creatorId: userId,
        isDone: false,
        title: data.task,
      };
      updateActiveTrip({ mutualTasks: [...mutualTasks, newTask] });
    }

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
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      if (isPrivate) {
        updateActiveTrip({ privateTasks: oldPrivateTasks });
      } else {
        updateActiveTrip({ mutualTasks: oldMutualTasks });
      }
      console.log(`ERROR: ${e.message}`);
    });
  };

  // const delayedUpdate = useCallback(
  //   debounce((isDone, item) => handleUpdate(isDone, item), 250),
  //   [],
  // );

  const handleUpdate = async (isDone, item) => {
    const { _id: taskId } = item;

    await updateTask({
      variables: {
        data: {
          isDone,
          taskId,
        },
      },
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      // updateActiveTrip({ mutualTasks: oldMutualTasks });
      console.log(`ERROR: ${e.message}`);
    });
  };

  const HeaderChips = () => (
    <View style={{ flexDirection: 'row', paddingHorizontal: PADDING.m, marginTop: 20 }}>
      {filterOption !== 2 && (
        <TouchableOpacity
          onPress={() => setFilterOption((prev) => (prev === 1 ? 0 : 1))}
          activeOpacity={0.9}
          style={[styles.chipContainer, { backgroundColor: COLORS.success[500] }]}
        >
          <Headline
            type={4}
            text={i18n.t('Done')}
            color={COLORS.shades[0]}
          />
          {filterOption !== 1
            ? (
              <View style={[styles.innerCircle, { backgroundColor: COLORS.success[700] }]}>
                <Headline
                  type={4}
                  text={taskCount(true)}
                  color={COLORS.shades[0]}
                />
              </View>
            )
            : (
              <Icon
                name="closecircle"
                color={COLORS.shades[0]}
                size={18}
                style={{ marginLeft: 20, marginRight: 4 }}
                onPress={() => setFilterOption(0)}
                suppressHighlighting
              />
            )}
        </TouchableOpacity>
      )}
      {filterOption !== 1 && (
      <TouchableOpacity
        onPress={() => setFilterOption((prev) => (prev === 2 ? 0 : 2))}
        activeOpacity={0.9}
        style={[styles.chipContainer, { backgroundColor: COLORS.error[500], marginLeft: filterOption !== 2 ? 10 : 0 }]}
      >
        <Headline
          type={4}
          text={i18n.t('Open')}
          color={COLORS.shades[0]}
        />
        {filterOption !== 2
          ? (
            <View style={[styles.innerCircle, { backgroundColor: COLORS.error[700] }]}>
              <Headline
                type={4}
                text={taskCount(false)}
                color={COLORS.shades[0]}
              />
            </View>
          )
          : (
            <Icon
              name="closecircle"
              color={COLORS.shades[0]}
              size={18}
              style={{ marginLeft: 20, marginRight: 4 }}
              onPress={() => setFilterOption(0)}
              suppressHighlighting
            />
          )}
      </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Checklist')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <HeaderChips />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 30 }}
        >
          <View style={{
            marginHorizontal: PADDING.l,
          }}
          >
            <Headline
              type={3}
              text={i18n.t('Mutual list')}
            />
            <Divider top={12} />
            <FlatList
              scrollEnabled={false}
              data={filterOption === 0 ? mutualTasks : filterOption === 1
                ? mutualTasks.filter((task) => task.isDone)
                : mutualTasks.filter((task) => !task.isDone)}
              ListEmptyComponent={() => (
                <Body
                  style={{ alignSelf: 'center', marginTop: 10 }}
                  type={1}
                  text={emptyString}
                  color={COLORS.neutral[300]}
                />
              )}
              renderItem={({ item }) => (
                <CheckboxTile
                  onMorePress={() => setSelectedTask({
                    ...item,
                    isPrivate: false,
                  })}
                  style={{ marginVertical: 10, paddingLeft: 5 }}
                  item={item}
                  onPress={(isChecked) => handleUpdate(isChecked, item)}
                />
              )}
            />
          </View>
          <View style={{ marginTop: 20, marginHorizontal: PADDING.l }}>
            <Headline
              type={3}
              text={i18n.t('Private list')}
            />
            <Divider top={12} />
            <FlatList
              scrollEnabled={false}
              data={filterOption === 0 ? privateTasks : filterOption === 1
                ? privateTasks.filter((task) => task.isDone)
                : privateTasks.filter((task) => !task.isDone)}
              ListEmptyComponent={() => (
                <Body
                  style={{ alignSelf: 'center', marginTop: 10 }}
                  type={1}
                  text={emptyString}
                  color={COLORS.neutral[300]}
                />
              )}
              renderItem={({ item }) => (
                <CheckboxTile
                  onMorePress={() => setSelectedTask({
                    ...item,
                    isPrivate: true,
                  })}
                  style={{ marginVertical: 10, paddingLeft: 5 }}
                  item={item}
                  disableLabel
                  onPress={(isChecked) => handleUpdate(isChecked, item)}
                />
              )}
            />
          </View>
        </ScrollView>
      </HybridHeader>
      <AddTaskModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onPress={(data) => handleChange(data)}
      />
      <FilterModal
        isVisible={taskSelected !== null}
        onRequestClose={() => setSelectedTask(null)}
        data={inputOptions}
        onPress={(m) => handleInput(m.value, taskSelected)}
      />
      <FAButton
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
    paddingRight: 8,
    flexDirection: 'row',
    height: 40,
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
});
