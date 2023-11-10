import i18n from '../utils/i18n';
import COLORS from './Theme';

const EXPENSES_CATEGORY = [
  {
    title: i18n.t('Accomodation'),
    id: 'accomodation',
    color: COLORS.secondary[700],
  },
  {
    title: i18n.t('Transport'),
    id: 'transport',
    color: COLORS.primary[700],
  },
  {
    title: i18n.t('Activites'),
    id: 'activites',
    color: COLORS.success[900],
  },
  {
    title: i18n.t('Food & Drinks'),
    id: 'food',
    color: COLORS.warning[900],
  },
  {
    title: i18n.t('Other'),
    id: 'other',
    color: COLORS.neutral[700],
  },
];

export default EXPENSES_CATEGORY;
