export enum repeatsEnum {
  weekly="Weekly",
  biWeekly="Bi-weekly",
  monthly="Monthly"
}

export interface EventBaseProps {
  id: number;
  editable: boolean;
  eventName: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  repeat: repeatsEnum;
}

export interface globalStateInterface {
  todoList: EventPropsStringDates[];
  selectedDate: string;
}

export interface EventProps {
  eventName: string;
  setEventName: (value: string) => void;
  startDate: Date;
  setStartDate:(value: Date) => void;
  startTime: Date;
  setStartTime:(value: Date) => void;
  endDate: Date;
  setEndDate:(value: Date) => void;
  endTime: Date;
  setEndTime:(value: Date) => void;
  repeat: repeatsEnum;
  setRepeat: (value: repeatsEnum) => void;
  editable: boolean
}

export interface EventPropsStringDates {
  eventName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  repeat: repeatsEnum;
  editable: boolean;
  id: number
}

