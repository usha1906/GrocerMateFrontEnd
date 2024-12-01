import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(null);

  // Get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Set the current date when the component loads
    setSelectedDate(getCurrentDate());
  }, []);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.logoText}>Please select a date</Text>

      {/* Calendar Tile */}
      <View style={styles.calendarTile}>
        <Calendar
          // Show selected date in the calendar
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#000000', // Black background for selected date
              selectedTextColor: '#FFFFFF', // White text for selected date
            },
          }}
          onDayPress={(day) => {
            console.log('Selected day:', day);
            setSelectedDate(day.dateString); // Update the selected date
          }}
          theme={{
            backgroundColor: '#F3A800', // Yellow background for tile
            calendarBackground: '#F3A800', // Yellow background for calendar
            textSectionTitleColor: '#000000', // Black for section titles
            todayTextColor: '#FFFFFF', // White text for today's date
            dayTextColor: '#000000', // Black text for days
            selectedDayBackgroundColor: '#000000', // Black background for selected day
            selectedDayTextColor: '#FFFFFF', // White text for selected day
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background for the screen
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3A800', // Gold color for title
    marginBottom: 20,
  },
  calendarTile: {
    width: '90%',
    backgroundColor: '#F3A800', // Yellow tile color
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3A800', // Gold color
    marginVertical: 30,
  },
});
