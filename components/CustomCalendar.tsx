import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGlobalState } from "@/redux/globalState";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { changeSelectedDate } from "@/redux/globalState";

const dateWithEvent = {
  selected: true,
  selectedColor: "rgba(255,193,7, 0.2)",
  customStyles: {
    text: {
      color: "#FFC107",
    },
  },
};
const dateNow = new Date();
const dateNowText = moment(dateNow).format("YYYY-MM-DD");

const CustomCalendar = () => {
  const [dateWithEvents, setdateWithEvents] = useState<any>({});
  const selectedDate = useSelector(getGlobalState).selectedDate;
  const storeEvents = useSelector(getGlobalState).todoList;
  const dispatch = useDispatch();

  useEffect(() => {
    const eventsObj: Record<string, typeof dateWithEvent> = storeEvents.reduce(
      (acc, el) => {
        acc[moment(el.startDate).format("YYYY-MM-DD")] = dateWithEvent;
        return acc;
      },
      {} as Record<string, typeof dateWithEvent>
    );

    setdateWithEvents(eventsObj);
  }, [storeEvents]);

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrapper}>
        <Calendar
          markingType="custom"
          current={dateNowText}
          onDayPress={(day: {
            dateString: string;
            day: number;
            month: number;
            year: number;
          }) => {
            dispatch(changeSelectedDate(day.dateString));
          }}
          markedDates={{
            [dateNowText]: {
              selected: true,
              selectedColor: "#eaf0f5",
              customStyles: {
                text: {
                  color: "black",
                  fontWeight: "bold",
                },
              },
            },
            ...dateWithEvents,
            [selectedDate]: { selected: true, selectedColor: "#FFC107" },
          }}
          hideExtraDays={true}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#FFC107",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#000000",
            dayTextColor: "#a39fb6",
            textDisabledColor: "#d9e1e8",
            dotColor: "#FFC107",
            selectedDotColor: "#ffffff",
            arrowColor: "#2d4150",
            monthTextColor: "#2d4150",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  calendarWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
});

export default CustomCalendar;
