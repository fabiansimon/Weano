import {
  StyleSheet, SafeAreaView, View, Dimensions, TextInput,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import BackButton from '../../components/BackButton';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import i18n from '../../utils/i18n';
import KeyboardView from '../../components/KeyboardView';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [footerExpanded, setFooterExpanded] = useState(false);
  const attachHeight = useRef(new Animated.Value(0)).current;
  const duration = 300;

  useEffect(() => {
    if (footerExpanded) {
      console.log('first');
      Animated.spring(attachHeight, {
        toValue: 120,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      console.log('second');
      Animated.spring(attachHeight, {
        toValue: 10,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [footerExpanded]);

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
    <View style={styles.chatContainer} />
  );

  const getFooter = () => (
    <SafeAreaView>
      <View style={styles.footerContainer}>
        <Animated.View style={{ height: footerExpanded ? 100 : 0 }} />
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={() => setFooterExpanded(!footerExpanded)}
            style={{
              marginBottom: 12,
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            <Icon
              name="paperclip"
              size={32}
              color={COLORS.primary[300]}
            />
          </TouchableOpacity>
          <View style={styles.textField}>
            <TextInput
              style={styles.textInput}
              value={message || null}
              onChangeText={(val) => setMessage(val)}
              placeholder={i18n.t('Type a message...')}
              placeholderTextColor={COLORS.neutral[300]}
            />
            {message.length > 0 && (
            <TouchableOpacity style={styles.sendButton}>
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
    backgroundColor: COLORS.primary[700],
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
    backgroundColor: COLORS.primary[500],
    height: 50,
    flex: 1,
    paddingHorizontal: 15,
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
  sendButton: {
    marginRight: -4,
    alignItems: 'center',
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.xl,
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
});
