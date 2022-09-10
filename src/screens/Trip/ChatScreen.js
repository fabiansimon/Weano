import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import BackButton from '../../components/BackButton';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import i18n from '../../utils/i18n';
import KeyboardView from '../../components/KeyboardView';
import Divider from '../../components/Divider';
import AttachmentContainer from '../../components/Trip/Chat/AttachmentContainer';
import ATTACHMENTS from '../../constants/Attachments';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [footerExpanded, setFooterExpanded] = useState(false);
  const animatedValues = useSharedValue({ height: 0, opacity: 0 });
  const duration = 250;

  const attachmentData = [
    {
      string: i18n.t("To-Do's"),
      icon: <MatIcon name="clipboard-check-outline" />,
      type: ATTACHMENTS.checkList,
    },
    {
      string: i18n.t('Expense'),
      icon: <FontIcon name="dollar" />,
      type: ATTACHMENTS.expense,
    },
    {
      string: i18n.t('Poll'),
      icon: <MatIcon name="poll" />,
      type: ATTACHMENTS.poll,
    },
    {
      string: i18n.t('Timer'),
      icon: <MatIcon name="timer-outline" />,
      type: ATTACHMENTS.countdown,
    },

  ];

  const animationStyle = useAnimatedStyle(() => ({
    height: !footerExpanded
      ? withTiming(animatedValues.value.height, {
        duration,
      })
      : withSpring(animatedValues.value.height, {
        duration,
        mass: 0.3,
      }),

    opacity: withSpring(animatedValues.value.opacity, {
      duration,
    }),
  }));

  const toggleExpand = (val) => {
    if (!val) {
      setFooterExpanded(false);
      animatedValues.value = { height: 0, opacity: 0 };
      return;
    }

    setFooterExpanded(!footerExpanded);
    animatedValues.value = { height: !footerExpanded ? 130 : 0, opacity: !footerExpanded ? 1 : 0 };
  };

  const getHeader = () => (
    <View style={styles.header}>
      <BackButton />
      <View style={styles.title}>
        <Headline
          type={3}
          text="Maturareise 2022"
        />
        <Body
          type={2}
          text="2 members"
          color={COLORS.neutral[300]}
        />
      </View>
    </View>
  );

  const getChatContainer = () => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.chatContainer}
      onPress={() => toggleExpand(false)}
    />
  );

  const getFooter = () => (
    <SafeAreaView>
      <View style={styles.footerContainer}>
        <Animated.View style={animationStyle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleExpand}
            style={[styles.roundButton, styles.swipeDownButton]}
          >
            <Icon
              name="chevron-down"
              color={COLORS.shades[0]}
              style={{ marginTop: -2 }}
              size={35}
            />
          </TouchableOpacity>
          <ScrollView
            horizontal
            alwaysBounceHorizontal
            scrollEnabled
            style={{ marginTop: 16 }}
          >
            {attachmentData.map((attachment) => (
              <AttachmentContainer
                style={{ marginRight: 8 }}
                onPress={() => console.log('tap')}
                data={attachment}
              />
            ))}
          </ScrollView>
          <Divider
            style={{ marginHorizontal: -20, marginBottom: 16 }}
            bottom={12}
            color={COLORS.primary[700]}
          />
        </Animated.View>
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              marginBottom: 12,
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            <Icon
              name="paperclip"
              size={32}
              style={{ opacity: 0.3 }}
              color={COLORS.shades[0]}
            />
          </TouchableOpacity>
          <View style={styles.textField}>
            <TextInput
              style={styles.textInput}
              selectionColor={COLORS.shades[0]}
              value={message || null}
              onChangeText={(val) => setMessage(val)}
              placeholder={i18n.t('Type a message...')}
              placeholderTextColor={COLORS.neutral[100]}
            />
            {message.length > 0 && (
            <TouchableOpacity style={[styles.roundButton, { marginRight: -4 }]}>
              <AntIcon
                name="arrowright"
                size={20}
                color={COLORS.shades[0]}
              />
            </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <KeyboardView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: COLORS.shades[0] }}>
          {getHeader()}
        </SafeAreaView>
        {getChatContainer()}
        {getFooter()}
      </View>
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary[500],
  },
  footerContainer: {
    paddingTop: 10,
    paddingHorizontal: PADDING.m,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    alignItems: 'center',
    bottom: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[0],
  },
  textField: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.primary[300],
    height: 50,
    flex: 1,
    paddingHorizontal: 15,
  },
  swipeDownButton: {
    position: 'absolute',
    top: -25,
    right: 10,
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.08,
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    flexDirection: 'row',
    paddingHorizontal: PADDING.s,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chatContainer: {
    flex: 1,
    height: 100,
    backgroundColor: COLORS.neutral[50],
    borderBottomRightRadius: RADIUS.m,
    borderBottomLeftRadius: RADIUS.m,
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.xl,
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
});
