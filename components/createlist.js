import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore setup

const CreateListPage = ({ navigation }) => {
  const [listName, setListName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'Alice', profilePicture: require('../assets/alice.png') },
    { id: '2', name: 'Bob', profilePicture: require('../assets/bob.png') },
    { id: '3', name: 'Charlie', profilePicture: require('../assets/charlie.png') },
    { id: '4', name: 'Diana', profilePicture: require('../assets/diana.png') },
  ]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);

  const filteredCollaborators = collaborators.filter((collaborator) =>
    collaborator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id) => {
    if (selectedCollaborators.includes(id)) {
      setSelectedCollaborators(selectedCollaborators.filter((collabId) => collabId !== id));
    } else {
      setSelectedCollaborators([...selectedCollaborators, id]);
    }
  };

  const handleCreateList = async () => {
    if (!listName || selectedCollaborators.length === 0) {
      alert('Please enter a list name and select at least one collaborator.');
      return;
    }
  
    try {
      // Reference to the `lists` subcollection under `users/alice`
      const listsCollectionRef = collection(db, 'users', 'alice', 'lists');
  
      // Add a new document to the `lists` collection
      const newListRef = await addDoc(listsCollectionRef, {
        name: listName,
        collaborators: selectedCollaborators.map((id) => {
          // Safely find collaborator names
          const collaborator = collaborators.find((collab) => collab.id === id);
          return collaborator?.name || 'Unknown'; // Provide a default value if not found
        }),
      });
  
      console.log('List created successfully!');
  
      // Log the new document ID and name
      console.log('Navigating to AddItems with:', {
        listId: newListRef.id,
        listName: listName,
        selectedCollaborators: selectedCollaborators,
      });
  
      // Reset states
      setListName('');
      setSelectedCollaborators([]);
  
      // Navigate to AddItems page
      navigation.navigate('AddItems', {
        listId: newListRef.id,
        listName: listName,
        selectedCollaborators: selectedCollaborators,
      });
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Failed to create list. Please try again.');
    }
  };  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter list name"
        value={listName}
        onChangeText={setListName}
      />

      <View style={styles.searchBarContainer}>
        <Image source={require('../assets/search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for collaborators..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredCollaborators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.collaboratorItem,
              selectedCollaborators.includes(item.id) && styles.selectedItem,
            ]}
            onPress={() => toggleSelection(item.id)}
          >
            <Image source={item.profilePicture} style={styles.profilePicture} />
            <Text style={styles.collaboratorName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No collaborators found</Text>}
      />

      {selectedCollaborators.length > 0 && (
        <View style={styles.selectedCollaboratorsContainer}>
          {selectedCollaborators.map((id) => {
            const collaborator = collaborators.find((collab) => collab.id === id);
            return (
              <Image
                key={id}
                source={collaborator?.profilePicture}
                style={styles.selectedProfilePicture}
              />
            );
          })}
        </View>
      )}

      <Button
        title="Create List"
        onPress={handleCreateList}
        disabled={!listName || selectedCollaborators.length === 0}
        color="#F8B500"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  collaboratorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedItem: {
    backgroundColor: '#FEE8AB',
    borderColor: '#F8B500',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  collaboratorName: {
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  selectedCollaboratorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  selectedProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
});

export default CreateListPage;