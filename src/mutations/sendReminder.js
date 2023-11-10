import {gql} from '@apollo/client';

const SEND_REMINDER = gql`
  mutation SendReminder($data: ReminderInput!) {
    sendReminder(data: $data)
  }
`;

export default SEND_REMINDER;
