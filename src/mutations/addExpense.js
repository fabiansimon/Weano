import { gql } from '@apollo/client';

const ADD_EXPENSE = gql`
    mutation CreateExpense($expense: ExpenseInput!) {
        createExpense(expense: $expense)
    }  
`;

export default ADD_EXPENSE;
