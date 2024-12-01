import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore setup

const CheckingFirebase = () => {
  const createUser = async () => {
    try {
      // Reference to the `users` collection
      const userRef = doc(db, 'users', 'user1'); // 'user1' is the document ID

      // Set data in Firestore
      await setDoc(userRef, {
        name: 'meds',
      });

      console.log('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Firestore Testing</Text>
      <Button title="Create User" onPress={createUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default CheckingFirebase;