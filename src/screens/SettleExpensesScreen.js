import {useRef} from 'react';
import activeTripStore from '../stores/ActiveTripStore';
import userStore from '../stores/UserStore';
import Animated from 'react-native-reanimated';
import HybridHeader from '../components/HybridHeader';
import {StyleSheet, View} from 'react-native';
import i18n from '../utils/i18n';
import INFORMATION from '../constants/Information';
import COLORS, {PADDING} from '../constants/Theme';

export default function SettleExpensesScreen() {
  const {
    expenses,
    activeMembers: users,
    id: tripId,
    title,
    currency,
    type,
  } = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const {id, firstName, isProMember} = userStore(state => state.user);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <HybridHeader title={i18n.t('Settle Expenses')} scrollY={scrollY}>
        <View style={{marginHorizontal: PADDING.l}} />
      </HybridHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
});
