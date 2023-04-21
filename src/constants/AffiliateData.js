import HostelWorldLogo from '../../assets/images/hostelworld.png';
import BookingLogo from '../../assets/images/booking.png';
import AirbnbLogo from '../../assets/images/airbnb.png';
import GetYourGuideLogo from '../../assets/images/getyourguide.png';
import ViatorLogo from '../../assets/images/viator.png';
import TripAdvisorLogo from '../../assets/images/tripadvisor.png';
import Rome2RioLogo from '../../assets/images/rome2rio.png';
import GoogleLogo from '../../assets/images/google.png';

export const AFFILIATE_DATA = {
  sleep: [
    {
      title: 'Hostelworld',
      type: 'hostelworld',
      logo: HostelWorldLogo,
    },
    {
      title: 'Airbnb',
      type: 'airbnb',
      logo: AirbnbLogo,
    },
    {
      title: 'Booking',
      type: 'booking',
      logo: BookingLogo,
    },
  ],
  transport: [
    {
      title: 'Rome2Rio',
      type: 'rome2rio',
      logo: Rome2RioLogo,
    },
    {
      title: 'Google',
      type: 'googleTransport',
      logo: GoogleLogo,
    },
  ],
  discover: [
    {
      title: 'Your Guide',
      type: 'yourGuide',
      logo: GetYourGuideLogo,
    },
    {
      title: 'Viator',
      type: 'viator',
      logo: ViatorLogo,
    },
    {
      title: 'Tripadvisor',
      type: 'tripAdvisor',
      logo: TripAdvisorLogo,
    },
  ],
  food: [
    {
      title: 'Google',
      type: 'googleFood',
      logo: GoogleLogo,
    },
  ],
};
