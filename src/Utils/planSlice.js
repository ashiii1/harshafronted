import { createSlice } from "@reduxjs/toolkit";

const planSlice = createSlice({
  name: "plan",
  initialState: {
    selectedPlan: null,
    isAnnual: false,
  },
  reducers: {
    setPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    setIsAnnualPlan: (state, action) => {
      state.isAnnual = action.payload;
    },
  },
});

export const { setPlan, setIsAnnualPlan } = planSlice.actions;
export default planSlice.reducer;
