import React, { useState, useEffect } from "react";
import CustomCalendar from "./CustomCalendar";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Event from "./Event";
import { EventBaseProps, repeatsEnum } from "@/types";
import { useSelector, useDispatch } from "react-redux";
import { getGlobalState } from "@/redux/globalState";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { changTodoList } from "@/redux/globalState";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface EventBasePropsWithNew extends EventBaseProps {
  new?: boolean;
}

const Main = () => {
  const [id, setId] = useState(0);
  const [events, setEvents] = useState<EventBasePropsWithNew[]>([]);

  const selectedDate = useSelector(getGlobalState).selectedDate;
  const storeEvents = useSelector(getGlobalState).todoList;

  const getDataFromStorage = async () => {
    const dataFromStorage =
      Platform.OS === "web"
        ? await window.localStorage.getItem("ToDoCalendar")
        : await AsyncStorage.getItem("ToDoCalendar");
    if (dataFromStorage) {
      dispatch(changTodoList(JSON.parse(dataFromStorage)));
    }
  };
  useEffect(() => {
    getDataFromStorage();
  }, []);

  useEffect(() => {
    setEvents(
      storeEvents.map((el) => ({
        startDate: new Date(el.startDate),
        startTime: new Date(el.startTime),
        endDate: new Date(el.endDate),
        endTime: new Date(el.endTime),
        id: el.id,
        editable: el.editable,
        eventName: el.eventName,
        repeat: el.repeat,
      }))
    );
    const maxId = Math.max(...storeEvents.map((el) => el.id));
    setId(maxId >= 0 ? maxId + 1 : 0);
  }, [selectedDate, storeEvents]);

  const selectedDateTime = new Date(selectedDate).getTime();
  const timeNow = new Date().getTime();
  const createNewEvent = () => {
    const copyEvents = [
      ...events,
      {
        id,
        editable: true,
        eventName: "",
        startDate: selectedDate ? new Date(selectedDate) : new Date(),
        startTime: selectedDate ? new Date(selectedDate) : new Date(),
        endDate: selectedDate ? new Date(selectedDate) : new Date(),
        endTime: selectedDate ? new Date(selectedDate) : new Date(),
        repeat: repeatsEnum.biWeekly,
        new: true,
      },
    ];
    setEvents(copyEvents);
    setId(id + 1);
  };

  const dispatch = useDispatch();

  const removeEvent = (id: number) => {
    const copyEvents = events.filter((el) => el.id !== id);
    setEvents(copyEvents);
  };

  const save = () => {
    let copyEvents = [...events];
    let err = false;
    let notSave = false;
    events.forEach((el) => {
      const startYear = el.startDate.getFullYear();
      const startMonth = el.startDate.getMonth();
      const startDate = el.startDate.getDate();
      const startHours = el.startTime.getHours();
      const startMinutes = el.startTime.getMinutes();
      const startTime = new Date(
        startYear,
        startMonth,
        startDate,
        startHours,
        startMinutes
      ).getTime();
      const endYear = el.endDate.getFullYear();
      const endMonth = el.endDate.getMonth();
      const endDate = el.endDate.getDate();
      const endHours = el.endTime.getHours();
      const endMinutes = el.endTime.getMinutes();
      const endTime = new Date(
        endYear,
        endMonth,
        endDate,
        endHours,
        endMinutes
      ).getTime();

      events.forEach((el2) => {
        const startYear2 = el2.startDate.getFullYear();
        const startMonth2 = el2.startDate.getMonth();
        const startDate2 = el2.startDate.getDate();
        const startHours2 = el2.startTime.getHours();
        const startMinutes2 = el2.startTime.getMinutes();
        const startTime2 = new Date(
          startYear2,
          startMonth2,
          startDate2,
          startHours2,
          startMinutes2
        ).getTime();
        const endYear2 = el2.endDate.getFullYear();
        const endMonth2 = el2.endDate.getMonth();
        const endDate2 = el2.endDate.getDate();
        const endHours2 = el2.endTime.getHours();
        const endMinutes2 = el2.endTime.getMinutes();
        const endTime2 = new Date(
          endYear2,
          endMonth2,
          endDate2,
          endHours2,
          endMinutes2
        ).getTime();
        if (el.id !== el2.id) {
          if (startTime2 >= startTime && startTime2 < endTime) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Error",
              text2: "Time intersects with other. Data was not saved.",
            });

            notSave = true;
          }

          if (endTime2 >= startTime && endTime2 < endTime) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Error",
              text2: "Time intersects with other. Data was not saved.",
            });
            notSave = true;
          }
        }
      });

      const timeNow = new Date().getTime();
      if (el.new && !el.eventName) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Input event name. Data was not saved.",
        });
        notSave = true;
      }
      if (startTime < timeNow && el.new) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "You can't create events in the past. Data was not saved.",
        });
        notSave = true;
        err = true;
      }

      if (startTime > endTime && el.new) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2:
            "The end date could not be before start date.  Data was not saved.",
        });
        notSave = true;
        err = true;
      }
    });

    if (notSave) {
      return;
    }

    copyEvents.forEach((el, index) => {
      delete copyEvents[index].new;
    });

    setEvents(copyEvents);

    const saveEvents = copyEvents.map((el: EventBaseProps) => ({
      startDate: el.startDate.toISOString(),
      startTime: el.startTime.toISOString(),
      endDate: el.endDate.toISOString(),
      endTime: el.endTime.toISOString(),
      id: el.id,
      editable: el.editable,
      eventName: el.eventName,
      repeat: el.repeat,
    }));

    dispatch(changTodoList(saveEvents));

    if (Platform.OS === "web") {
      window.localStorage.setItem("ToDoCalendar", JSON.stringify(saveEvents));
    } else {
      AsyncStorage.setItem("ToDoCalendar", JSON.stringify(saveEvents));
    }

    if (!err) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Success",
        text2: "Data saved",
      });
    }
  };

  return (
    <>
      <CustomCalendar />

      {events
        .filter((el) => {
          return (
            moment(el.startDate).format("YYYY-MM-DD") ===
              moment(new Date(selectedDate)).format("YYYY-MM-DD") || el.new
          );
        })
        .map((el) => {
          const startYear = el.startDate.getFullYear();
          const startMonth = el.startDate.getMonth();
          const startDate = el.startDate.getDate();
          const startHours = el.startTime.getHours();
          const startMinutes = el.startTime.getMinutes();
          const startTime = new Date(
            startYear,
            startMonth,
            startDate,
            startHours,
            startMinutes
          ).getTime();
          const currentTime = new Date().getTime();

          return (
            <React.Fragment key={el.id}>
              <Event
                eventName={el.eventName}
                setEventName={(name) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                      event.id === el.id ? { ...event, eventName: name, new: true } : event
                    )
                  );
                }}
                startDate={el.startDate}
                setStartDate={(date) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                      event.id === el.id ? { ...event, startDate: date, new: true } : event
                    )
                  );
                }}
                startTime={el.startTime}
                setStartTime={(time) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                      event.id === el.id ? { ...event, startTime: time, new: true } : event
                    )
                  );
                }}
                endDate={el.endDate}
                setEndDate={(date) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                      event.id === el.id ? { ...event, endDate: date, new: true } : event
                    )
                  );
                }}
                endTime={el.endTime}
                setEndTime={(time) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                      event.id === el.id ? { ...event, endTime: time, new: true } : event
                    )
                  );
                }}
                repeat={el.repeat}
                setRepeat={(repeat) => {
                  setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                      event.id === el.id ? { ...event, repeat, new: true } : event
                    )
                  );
                }}
                editable={!!(currentTime < startTime || el.new)}
              />
              <TouchableWithoutFeedback onPress={() => removeEvent(el.id)}>
                <View style={styles.removeButton}>
                  <MaterialIcons name="delete" size={24} color="rgba(255, 0, 0, 0.5 )" />
                </View>
              </TouchableWithoutFeedback>
            </React.Fragment>
          );
        })}

      <View style={styles.container}>
        {(!selectedDateTime ||
          timeNow - 1000 * 60 * 60 * 24 <= selectedDateTime) && (
          <TouchableWithoutFeedback onPress={createNewEvent}>
            <View style={styles.addButtonWrapper}>
              <LinearGradient
                colors={["#ffb52c", "#ffd23f"]}
                start={[0, 1]}
                end={[0, 0]}
                style={styles.addButton}
              >
                <Text style={styles.textAdd}>+</Text>
              </LinearGradient>
              <Text style={styles.createText}>Create New Event</Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        <TouchableWithoutFeedback onPress={save}>
          <LinearGradient
            colors={["#ffb52c", "#ffd23f"]}
            start={[0, 1]}
            end={[0, 0]}
            style={styles.saveButton}
          >
            <Text style={styles.text}>SAVE</Text>
          </LinearGradient>
        </TouchableWithoutFeedback>
        <Toast />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  removeButton: {
    padding: 15,
  },
  container: {
    padding: 15,
    marginTop: 20,
  },
  addButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  createText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#FFC107",
    borderRadius: 50,
    width: 24,
    height: 24,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textAdd: {
    color: "white",
    position: "absolute",
    fontSize: 10,
  },
  saveButton: {
    backgroundColor: "#FFC107",
    borderRadius: 30,
    marginVertical: 60,
    width: "100%",
    alignItems: "center",
    shadowOpacity: 0.2,
    paddingVertical: 10,
  },
  text: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Main;
