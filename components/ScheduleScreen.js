import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      {/* Title */}
     
      {/* Calendar Tile */}
      <View style={styles.calendarTile}>
        <Calendar
          onDayPress={(day) => console.log('Selected day:', day)}
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
});
