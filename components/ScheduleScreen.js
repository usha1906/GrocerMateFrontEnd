import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

export default function ScheduleScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Handle date selection and navigate to TaskScreen
  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    navigation.navigate("TaskScreen", { selectedDate: day.dateString });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Please select a date</Text>
      <View style={styles.calendarTile}>
        <Calendar
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#000000",
              selectedTextColor: "#FFFFFF",
            },
          }}
          onDayPress={handleDateSelect}
          theme={{
            backgroundColor: "#F3A800",
            calendarBackground: "#F3A800",
            textSectionTitleColor: "#000000",
            todayTextColor: "#FFFFFF",
            dayTextColor: "#000000",
            selectedDayBackgroundColor: "#000000",
            selectedDayTextColor: "#FFFFFF",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  calendarTile: {
    width: "90%",
    backgroundColor: "#F3A800",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F3A800",
    marginVertical: 30,
  },
});
