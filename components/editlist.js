import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { collection, doc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this points to your Firebase configuration

const EditListPage = ({ route }) => {
  const { listId } = route.params || {}; // Get the listId passed from chooselist.js
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        // Fetch items under the list
        const itemsRef = collection(db, 'users', 'alice', 'lists', listId, 'items'); // Update 'alice' dynamically if needed
        const querySnapshot = await getDocs(itemsRef);

        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedItems.push({ id: doc.id, name: data.name });
        });

        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching list details:', error);
      }
    };

    const fetchListName = async () => {
      try {
        const listRef = doc(db, 'users', 'alice', 'lists', listId); // Update 'alice' dynamically if needed
        const listDoc = await getDoc(listRef);

        if (listDoc.exists()) {
          setListName(listDoc.data().name);
        }
      } catch (error) {
        console.error('Error fetching list name:', error);
      }
    };

    const fetchData = async () => {
      await fetchListName();
      await fetchListDetails();
      setLoading(false);
    };

    fetchData();
  }, [listId]);

  const deleteItem = async (itemId) => {
    try {
      // Delete the item from Firebase
      await deleteDoc(doc(db, 'users', 'alice', 'lists', listId, 'items', itemId));

      // Update UI after deletion
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const confirmDelete = (itemId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(itemId) },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading List Details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.listName}>{listName}</Text>
      {items.length > 0 ? (
        items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
              <Image
                source={require('../assets/dustbin.png')}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No items in this list.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 80,
    marginTop: 30,
  },
  listName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 25,
    height: 25,
    tintColor: '#000',
  },
  itemText: {
    fontSize: 18,
    flex: 1,
  },
  noItemsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditListPage;
