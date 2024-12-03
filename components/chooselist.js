import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust to match your Firebase config

const ChooseListPage = ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const userListsRef = collection(db, 'users', 'alice', 'lists'); // Change 'alice' to dynamically get the user if needed
        const querySnapshot = await getDocs(userListsRef);

        const fetchedLists = [];
        querySnapshot.forEach((doc) => {
          fetchedLists.push({ id: doc.id, name: doc.data().name });
        });

        setLists(fetchedLists);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lists:', error);
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const deleteList = async (listId) => {
    try {
      const listRef = doc(db, 'users', 'alice', 'lists', listId); // Update user dynamically if needed
      await deleteDoc(listRef);

      // Remove the deleted list from the state
      setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const confirmDelete = (listId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete the list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteList(listId) },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Lists...</Text>
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
      <Text style={styles.title}>Choose a List to Edit</Text>
      {lists.length > 0 ? (
        lists.map((list) => (
          <View key={list.id} style={styles.listContainer}>
            {/* List Button */}
            <TouchableOpacity
              style={styles.listButton}
              onPress={() =>
                navigation.navigate('EditList', { listId: list.id })
              }
            >
              <Text style={styles.listButtonText}>{list.name}</Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(list.id)}
            >
              <Image
                source={require('../assets/dustbin.png')}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noListsText}>No lists found. Create a new one!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'top',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 15,
  },
  listButton: {
    backgroundColor: '#F8B500',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1, // Ensures button takes available space
    marginRight: 10,
  },
  listButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
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
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  noListsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChooseListPage;