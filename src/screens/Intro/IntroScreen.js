/* eslint-disable import/no-named-as-default-member */
/* eslint-disable global-require */
import {
  View, StyleSheet, Image, StatusBar,
} from 'react-native';
import React, { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import COLORS from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Button from '../../components/Button';
import PageIndicator from '../../components/PageIndicator';
import AuthModal from '../../components/AuthModal';

export default function IntroScreen() {
  const [pageIndex, setPageIndex] = useState(0);
  const [authVisible, setAuthVisible] = useState(false);
  const pageRef = useRef(null);

  const intro1 = require('../../../assets/images/intro_1.png');
  const intro2 = require('../../../assets/images/intro_2.png');
  const intro3 = require('../../../assets/images/intro_3.png');

  const handleNext = () => {
    if (pageIndex === introData.length - 1) {
      setAuthVisible(true);
    } else {
      const newIndex = pageIndex + 1;
      setPageIndex(newIndex);
      pageRef.current?.setPage(newIndex);
    }
  };

  const introData = [
    {
      title: 'Make it past the groupchat phase',
      subtitle: 'We know how hard it is to plan trips. Skip the groupchat phase, and finally create memories together',
      image: intro1,
    },
    {
      title: 'Organized chaos',
      subtitle: 'Assign roles, find the optimal dates, share tasks and compare accomodations with just a few taps',
      image: intro2,
    },
    {
      title: 'Create memories',
      subtitle: 'We remind everyone of your travelgroup at a random time to snap some pictures. That way you can create memories that last forever',
      image: intro3,
    },
  ];

  const renderItem = (data, index) => (
    <View key={index}>
      <Image
        source={data.image}
        style={styles.imageContainer}
        resizeMode="stretch"
      />
      <View style={styles.innerContainer}>
        <Headline type={1} text={i18n.t(data.title)} />
        <Body
          style={{ marginTop: 30 }}
          type={1}
          color={COLORS.neutral[700]}
          text={i18n.t(data.subtitle)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pageRef}
        scrollEnabled={false}
      >
        {introData.map((data, index) => renderItem(data, index))}
      </PagerView>
      <SafeAreaView style={styles.footer}>
        <Button text={i18n.t('Next')} onPress={handleNext} />
        <PageIndicator
          data={introData}
          pageIndex={pageIndex}
          style={{ alignSelf: 'center', marginTop: 22 }}
        />
      </SafeAreaView>
      <AuthModal
        isVisible={authVisible}
        onRequestClose={() => setAuthVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  footer: {
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 40,
    width: '100%',
  },
  imageContainer: {
    height: '40%',
    width: '100%',
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
