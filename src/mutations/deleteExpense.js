import { gql } from '@apollo/client';

const DELETE_EXPENSE = gql`
    mutation DeleteExpense($data: DeleteInput!) {
        deleteExpense(data: $data)
    }  
`;

export default DELETE_EXPENSE;
