import {
  View, StyleSheet, ScrollView, Dimensions, FlatList,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Divider from '../../components/Divider';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import CheckboxTile from '../../components/Trip/CheckboxTile';
import Button from '../../components/Button';
import AddTaskModal from '../../components/Trip/AddTaskModal';
import Body from '../../components/typography/Body';

export default function ChecklistScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [mutualTasks, setMutualTasks] = useState([]);
  const [privateTasks, setPrivateTasks] = useState([]);
  const mockTasks = {
    privateTasks: [
      {
        title: 'Bring towels',
        isDone: false,
        id: 0,
      },
      {
        title: 'Get passport renewed',
        isDone: false,
        id: 1,
      },
    ],
    mutualTasks: [
      {
        title: 'Bring speakers 🎧',
        isDone: false,
        assignee: 'Julia Chovo',
      },
      {
        title: 'Check Clubscene 🎉',
        isDone: false,
        assignee: 'Clembo',
      },
      {
        title: 'Pay for Airbnb',
        isDone: false,
        assignee: 'Jennelie',
      },
    ],
  };

  useEffect(() => {
    setMutualTasks(mockTasks.mutualTasks);
    setPrivateTasks(mockTasks.privateTasks);
  }, []);

  const taskCount = (isDone) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const length = privateTasks?.filter((task) => task.isDone === isDone).length + mutualTasks?.filter((task) => task.isDone === isDone).length;
    return length || 0;
  };

  const handleInput = (data) => {
    setIsVisible(false);
    const isPrivate = data.type === 'PRIVATE';

    const task = {
      title: data.task,
      isDone: false,
      assignee: isPrivate ? `${data.assignee.firstName} ${data.assignee.lastName}` : null,
    };

    if (isPrivate) {
      setPrivateTasks([...privateTasks, task]);
    }
    if (!isPrivate) {
      setMutualTasks([...mutualTasks, task]);
    }
  };

  const headerChips = (
    <View style={{ flexDirection: 'row', paddingHorizontal: PADDING.m, marginTop: 20 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.chipContainer, { backgroundColor: COLORS.success[500] }]}
      >
        <Headline
          type={4}
          text={i18n.t('Done')}
          color={COLORS.shades[0]}
        />
        <View style={[styles.innerCircle, { backgroundColor: COLORS.success[700] }]}>
          <Headline
            type={4}
            text={taskCount(true)}
            color={COLORS.shades[0]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.chipContainer, { backgroundColor: COLORS.error[500], marginLeft: 10 }]}
      >
        <Headline
          type={4}
          text={i18n.t('Open')}
          color={COLORS.shades[0]}
        />
        <View style={[styles.innerCircle, { backgroundColor: COLORS.error[700] }]}>
          <Headline
            type={4}
            text={taskCount(false)}
            color={COLORS.shades[0]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Checklist')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        {headerChips}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 30 }}
        >
          <View style={{
            justifyContent: 'flex-start', borderRightColor: COLORS.neutral[100], borderRightWidth: 1, width: Dimensions.get('window').width * 0.75,
          }}
          >
            <Headline
              type={3}
              style={{ marginLeft: PADDING.l }}
              text={i18n.t('Mutual list')}
            />
            <Divider top={12} style={{ flex: 1, marginLeft: PADDING.l }} />
            <FlatList
              style={{ paddingLeft: PADDING.l }}
              scrollEnabled={false}
              data={mutualTasks}
              ListEmptyComponent={() => (
                <Body
                  style={{ alignSelf: 'center', marginTop: 10 }}
                  type={1}
                  text={i18n.t('No task added yet')}
                  color={COLORS.neutral[300]}
                />
              )}
              renderItem={({ item }) => (
                <CheckboxTile
                  style={{ marginVertical: 10, marginRight: 30 }}
                  item={item}
                  onPress={(isChecked) => console.log(isChecked)}
                />
              )}
            />
          </View>
          <View style={{ justifyContent: 'flex-start', width: Dimensions.get('window').width * 0.75, marginRight: 40 }}>
            <Headline
              type={3}
              text={i18n.t('Private list')}
              style={{ marginLeft: 16 }}
            />
            <Divider top={12} />
            <FlatList
              style={{ paddingLeft: PADDING.l }}
              scrollEnabled={false}
              data={privateTasks}
              ListEmptyComponent={() => (
                <Body
                  style={{ alignSelf: 'center', marginTop: 10 }}
                  type={1}
                  text={i18n.t('No task added yet')}
                  color={COLORS.neutral[300]}
                />
              )}
              renderItem={({ item }) => (
                <CheckboxTile
                  style={{ marginVertical: 10, marginRight: 30 }}
                  item={item}
                  disableLabel
                  onPress={(isChecked) => console.log(isChecked)}
                />
              )}
            />
          </View>
        </ScrollView>

      </HybridHeader>
      <SafeAreaView style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Button
          style={{ marginHorizontal: PADDING.l }}
          text={i18n.t('Add Task')}
          onPress={() => setIsVisible(true)}
          fullWidth
        />
      </SafeAreaView>
      <AddTaskModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        onPress={(data) => handleInput(data)}
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
