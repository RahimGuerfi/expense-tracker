import { createSlice } from "@reduxjs/toolkit";

export const CATEGORIES = [
  "housing",
  "food",
  "transportation",
  "utilities",
  "clothing",
  "healthcare",
  "personal",
  "education",
  "entertainment",
];
const initialState = CATEGORIES.map((category) => ({
  category: category,
  amount: 0,
}));

const budgetsSlice = createSlice({
  name: "budgets",
  initialState: initialState,
  reducers: {
    editBudget: (state, action) => {
      const { category, amount } = action.payload;
      const budgetToEdit = state.find((budget) => budget.category === category);
      budgetToEdit.amount = amount;
    },
  },
});

//actions
export const { editBudget } = budgetsSlice.actions;
//reducer
export default budgetsSlice.reducer;
//selectors
export const selectBudgets = (state) => state.budgets;

//helper function
export const calculateTotalExpenses = (transactions, category) => {
  return transactions[category]
    .map((transaction) => transaction.amount)
    .reduce((amount1, amount2) => amount1 + amount2, 0);
};
