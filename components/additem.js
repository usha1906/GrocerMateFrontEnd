import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you're importing Firebase config

const AddItemPage = ({ route, navigation }) => {
  // Destructure `route.params` with default values to avoid undefined errors
  const { listId, listName = '', selectedCollaborators = [] } = route.params || {};
  const { addedItem } = route.params || {};

  // Map collaborator IDs to profile picture paths
  const profilePictures = {
    '1': require('../assets/alice.png'),
    '2': require('../assets/bob.png'),
    '3': require('../assets/charlie.png'),
    '4': require('../assets/diana.png'),
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from Firestore when the page loads
    const fetchItems = async () => {
      try {
        const itemsCollectionRef = collection(db, 'users', 'alice', 'lists', listId, 'items');
        const querySnapshot = await getDocs(itemsCollectionRef);

        const fetchedItems = querySnapshot.docs.map(doc => doc.data().name); // Getting item names
        setItems(fetchedItems); // Set items to state
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [listId]);

  useEffect(() => {
    // Update items state when a new item is added
    if (addedItem) {
      setItems((prevItems) => [
        ...prevItems,
        addedItem.itemName, // Add the name of the new item
      ]);
    }
  }, [addedItem]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      {/* List Name */}
      <Text style={styles.listName}>{listName}</Text>

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addItemButton}
        onPress={() =>
          navigation.navigate('NewItem', {
            listId,
            listName,
            selectedCollaborators,
          })
        }
      >
        <Image source={require('../assets/add.png')} style={styles.addIcon} />
        <Text style={styles.addItemText}>Add Item</Text>
      </TouchableOpacity>

      {/* Item List or Empty State */}
      <View style={styles.content}>
        {items.length > 0 ? (
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>
                  {index + 1}. {item}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }} // Padding for Add Item Button
          />
        ) : (
          <Text style={styles.emptyText}>
            No items added yet. Press "Add Item" to start!
          </Text>
        )}
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {/* Profile pictures of selected collaborators */}
        <View style={styles.collaboratorPicturesContainer}>
          {selectedCollaborators.map((collaboratorId) => {
            const imageSource = profilePictures[collaboratorId] || require('../assets/defaultProfile.png'); // Fallback image
            return (
              <Image
                key={collaboratorId}
                source={imageSource}
                style={styles.collaboratorPicture}
              />
            );
          })}
        </View>
        <TouchableOpacity style={styles.addCollaboratorButton}>
          <Text style={styles.addCollaboratorText}>+ Add Collaborator</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 50,
  },
  listName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemName: {
    fontSize: 18,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FEE8AB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  addIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  addItemText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'left',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  collaboratorPicturesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collaboratorPicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  addCollaboratorButton: {
    padding: 10,
    backgroundColor: '#F8B500',
    borderRadius: 5,
  },
  addCollaboratorText: {
    color: '#fff',
  },
});

export default AddItemPage;
