import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import moment from "moment";
import { repeatsEnum, EventProps } from "@/types";

const Event: React.FC<EventProps> = ({
  eventName,
  setEventName,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  repeat,
  setRepeat,
  editable,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={Platform.OS === "web" ? styles.inputWeb : styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
        readOnly={!editable}
      />

      {/* Start Date & Time */}
      <Text style={styles.label}>Starts</Text>
      <View style={styles.row}>
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            disabled={!editable}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            style={styles.inputWeb}
          />
        ) : (
          <TouchableOpacity
            onPress={() => editable && setShowStartDatePicker(true)}
            style={styles.dateTimeInput}
          >
            <Text>{moment(startDate).format("MMM D, YYYY")}</Text>
          </TouchableOpacity>
        )}
        {Platform.OS === "web" ? (
          <input
            type="time"
            value={startTime.toTimeString().split(" ")[0]}
            disabled={!editable}
            onChange={(e) =>
              setStartTime(
                new Date(startDate.toDateString() + " " + e.target.value)
              )
            }
            style={styles.inputWeb}
          />
        ) : (
          <TouchableOpacity
            onPress={() => editable && setShowStartTimePicker(true)}
            style={styles.dateTimeInput}
          >
            <Text>{moment(startTime).format("hh:mm A")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* End Date & Time */}
      <Text style={styles.label}>Ends</Text>
      <View style={styles.row}>
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            disabled={!editable}
            style={styles.inputWeb}
          />
        ) : (
          <TouchableOpacity
            onPress={() => editable && setShowEndDatePicker(true)}
            style={styles.dateTimeInput}
          >
            <Text>{moment(endDate).format("MMM D, YYYY")}</Text>
          </TouchableOpacity>
        )}
        {Platform.OS === "web" ? (
          <input
            type="time"
            value={endTime.toTimeString().split(" ")[0]}
            onChange={(e) =>
              setEndTime(
                new Date(endDate.toDateString() + " " + e.target.value)
              )
            }
            disabled={!editable}
            style={styles.inputWeb}
          />
        ) : (
          <TouchableOpacity
            onPress={() => editable && setShowEndTimePicker(true)}
            style={styles.dateTimeInput}
          >
            <Text>{moment(endTime).format("hh:mm A")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Repeat */}
      <Text style={styles.label}>Repeat</Text>
      {Platform.OS === "web" ? (
        <select
          id="repeat"
          onChange={(e) => setRepeat(e.target.value as repeatsEnum)}
          style={styles.inputWeb}
        >
          <option>{repeatsEnum.biWeekly}</option>
          <option>{repeatsEnum.monthly}</option>
          <option>{repeatsEnum.weekly}</option>
        </select>
      ) : (
        <View style={styles.dropdownWrapper}>
          <RNPickerSelect
            disabled={!editable}
            value={repeat}
            onValueChange={(value) => setRepeat(value)}
            items={Object.values(repeatsEnum).map((item) => ({
              label: item,
              value: item,
            }))}
            style={{
              inputIOS: styles.inputDropdown,
              inputAndroid: styles.inputDropdown,
            }}
          />
        </View>
      )}

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          disabled={!editable}
          value={startDate}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          disabled={!editable}
          value={startTime}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          disabled={!editable}
          value={endDate}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          disabled={!editable}
          value={endTime}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  dropdownWrapper: {
    overflow: "hidden",
    borderRadius: 12,
  },
  inputWeb: {
    // @ts-ignore  
    border: "2px solid rgb(255, 181, 44)",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    marginBottom: 20,
    outline: "none",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3c3c3c",
    marginBottom: 5,
  },
  inputDropdown: {
    backgroundColor: "#ffffff",
    padding: 5,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 8,
  },
  dateTimeInput: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
  },
  dropdown: {
    width: "50%",
    borderRadius: 10,
  },
});

export default Event;
