import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Navigation Icons */}
      <View style={styles.topIcons}>
        <Icon name="home-outline" size={40} style={styles.icon} />
        <Icon name="account-outline" size={40} style={styles.icon} />
      </View>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/grocermatelogo.png')} style={styles.logo} />
      </View>

      {/* Button Grid */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateList')}>
          <Icon name="playlist-edit" size={30} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Create Shared List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChooseList')}>
          <Icon name="note-edit-outline" size={30} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Edit / Add Item on List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Schedule')}>
          <Icon name="calendar-clock-outline" size={30} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => console.log('Geofence Pressed')}>
          <Icon name="map-marker-radius-outline" size={30} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Geofence</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  icon: {
    color: '#000', // Black color for icons
    marginVertical:30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 150,
    height: 125,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3A800', // Gold color
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '90%',
  },
  button: {
    width: '40%',
    height: 120,
    backgroundColor: '#F3A800', // Gold button color
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonIcon: {
    color: '#000', // Black icon color
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
