import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { globalStateInterface, EventPropsStringDates } from "@/types";

const initialState: globalStateInterface = {
  todoList: [],
  selectedDate: ""
};

export const globalStateSlice = createSlice({
  name: "globalStateSlice",
  initialState,
  reducers: {
    changTodoList: (state, action: PayloadAction<EventPropsStringDates[]>) => {
      state.todoList = action.payload;
    },
    changeSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { changTodoList, changeSelectedDate } = globalStateSlice.actions;
export const getGlobalState = (state: { todoList: globalStateInterface }) =>
  state.todoList;

export default globalStateSlice.reducer;
