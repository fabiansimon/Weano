import {gql} from '@apollo/client';

const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($expense: ExpenseInput!) {
    updateExpense(expense: $expense)
  }
`;

export default UPDATE_EXPENSE;
