import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you've exported your Firestore instance

const NewItemPage = ({ route, navigation }) => {
  const { listId, listName, selectedCollaborators } = route.params;

  // Stores data
  const stores = [
    { id: '1', name: 'Jewel Osco', icon: require('../assets/jewel.jpeg') },
    { id: '2', name: 'Target', icon: require('../assets/target.jpg') },
    { id: '3', name: 'Walmart', icon: require('../assets/walmart.png') },
    { id: '4', name: 'Costco', icon: require('../assets/costco.png') },
    { id: '5', name: 'Sam\'s Club', icon: require('../assets/sams.png') },
    { id: '6', name: 'Pete\'s Fresh Market', icon: require('../assets/petes.png') },
  ];

  const [itemName, setItemName] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);

  const toggleStoreSelection = (storeId) => {
    if (selectedStores.includes(storeId)) {
      setSelectedStores(selectedStores.filter((id) => id !== storeId));
    } else {
      setSelectedStores([...selectedStores, storeId]);
    }
  };

  const handleDone = async () => {
    if (!itemName || selectedStores.length === 0) {
      alert('Please enter an item name and select at least one store.');
      return;
    }

    console.log('Item Name:', itemName); // Debugging
    console.log('Selected Stores:', selectedStores); // Debugging

    try {
      // Ensure the listId is valid before proceeding
      if (!listId) {
        alert('Invalid List ID. Please try again.');
        return;
      }

      // Reference to the `items` collection under the specific listId
      const itemsCollectionRef = collection(db, 'users', 'alice', 'lists', listId, 'items');
      
      // Add the new item to the `items` collection
      await addDoc(itemsCollectionRef, {
        name: itemName,
        stores: selectedStores, // Stores will be an array of selected store IDs
      });

      console.log('Item added successfully!');
      
      // Reset the input fields
      setItemName('');
      setSelectedStores([]);

      // Navigate back to AddItemPage
      navigation.navigate('AddItems', {
        listId,
        listName,
        selectedCollaborators,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Grocery Item"
        value={itemName}
        onChangeText={setItemName}
      />

      <Text style={styles.selectStoresText}>Select Stores</Text>

      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedStores.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.storeItem, isSelected && styles.selectedStore]}
              onPress={() => toggleStoreSelection(item.id)}
            >
              <Image source={item.icon} style={styles.storeIcon} />
              <Text style={styles.storeName}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  selectStoresText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  storeIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  storeName: {
    fontSize: 16,
  },
  selectedStore: {
    backgroundColor: '#d1ffd6', // Light green when selected
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default NewItemPage;