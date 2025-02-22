import { configureStore } from "@reduxjs/toolkit";
import todoListReducer from "./globalState";

export const store = configureStore({
  reducer: {
    todoList: todoListReducer
  },
});


