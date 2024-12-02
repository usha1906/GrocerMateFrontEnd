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
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { collection, doc, getDoc, getDocs, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditListPage = ({ route }) => {
  const { listId } = route.params || {};
  const [listName, setListName] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);

  const stores = [
    { id: '1', name: 'Jewel Osco', icon: require('../assets/jewel.jpeg') },
    { id: '2', name: 'Target', icon: require('../assets/target.jpg') },
    { id: '3', name: 'Walmart', icon: require('../assets/walmart.png') },
    { id: '4', name: 'Costco', icon: require('../assets/costco.png') },
    { id: '5', name: "Sam's Club", icon: require('../assets/sams.png') },
    { id: '6', name: "Pete's Fresh Market", icon: require('../assets/petes.png') },
  ];

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const itemsRef = collection(db, 'users', 'alice', 'lists', listId, 'items');
        const querySnapshot = await getDocs(itemsRef);

        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedItems.push({ id: doc.id, name: data.name, stores: data.stores || [] });
        });

        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching list details:', error);
      }
    };

    const fetchListName = async () => {
      try {
        const listRef = doc(db, 'users', 'alice', 'lists', listId);
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

  const editItem = async () => {
    try {
      const itemRef = doc(db, 'users', 'alice', 'lists', listId, 'items', currentItem.id);
      await updateDoc(itemRef, { name: editedName, stores: selectedStores });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === currentItem.id ? { ...item, name: editedName, stores: selectedStores } : item
        )
      );

      setEditModalVisible(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId, itemName) => {
    try {
      // Delete the item
      await deleteDoc(doc(db, 'users', 'alice', 'lists', listId, 'items', itemId));
  
      // Fetch the list document to get collaborators
      const listRef = doc(db, 'users', 'alice', 'lists', listId);
      const listDoc = await getDoc(listRef);
  
      if (listDoc.exists()) {
        const listData = listDoc.data();
        const collaborators = listData.collaborators || [];
  
        // Create a notification for each collaborator
        for (const collaboratorId of collaborators) {
          if (collaboratorId !== 'alice') { // Skip the current user
            const notificationsRef = collection(db, 'users', collaboratorId, 'notifications');
            await addDoc(notificationsRef, {
              type: 'item_deleted',
              message: `Alice deleted "${itemName}" from the list "${listData.name}".`,
              timestamp: new Date().toISOString(),
              listId: listId,
              deletedItemName: itemName,
            });
          }
        }
      }
  
      // Update the state to reflect item deletion
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };  

  const addItem = async () => {
    try {
      const newItem = { name: newItemName, stores: selectedStores };
      const itemsRef = collection(db, 'users', 'alice', 'lists', listId, 'items');
      const docRef = await addDoc(itemsRef, newItem);

      setItems((prevItems) => [...prevItems, { id: docRef.id, ...newItem }]);
      setAddModalVisible(false);
      setNewItemName('');
      setSelectedStores([]);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const toggleStoreSelection = (storeId) => {
    setSelectedStores((prevSelected) =>
      prevSelected.includes(storeId)
        ? prevSelected.filter((id) => id !== storeId)
        : [...prevSelected, storeId]
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
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.listName}>{listName}</Text>
      {items.length > 0 ? (
        items.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setCurrentItem(item);
                setEditedName(item.name);
                setSelectedStores(item.stores || []);
                setEditModalVisible(true);
              }}
            >
              <Image source={require('../assets/pen.png')} style={styles.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id,item.name)}>
              <Image source={require('../assets/dustbin.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No items in this list.</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      {editModalVisible && (
        <Modal transparent={true} animationType="slide" visible={editModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={editedName}
                onChangeText={setEditedName}
              />
              <Text style={styles.modalSubtitle}>Preferred Stores</Text>
              {stores.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  style={styles.storeOption}
                  onPress={() => toggleStoreSelection(store.id)}
                >
                  <Image source={store.icon} style={styles.storeIcon} />
                  <Text style={styles.storeName}>{store.name}</Text>
                  {selectedStores.includes(store.id) && <Text style={styles.selected}>✔</Text>}
                </TouchableOpacity>
              ))}
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
                <Button title="Save" onPress={editItem} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Modal */}
      {addModalVisible && (
        <Modal transparent={true} animationType="slide" visible={addModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TextInput
                style={styles.input}
                placeholder="Item Name"
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <Text style={styles.modalSubtitle}>Preferred Stores</Text>
              {stores.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  style={styles.storeOption}
                  onPress={() => toggleStoreSelection(store.id)}
                >
                  <Image source={store.icon} style={styles.storeIcon} />
                  <Text style={styles.storeName}>{store.name}</Text>
                  {selectedStores.includes(store.id) && <Text style={styles.selected}>✔</Text>}
                </TouchableOpacity>
              ))}
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
                <Button title="Add" onPress={addItem} />
              </View>
            </View>
          </View>
        </Modal>
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
    marginLeft: 10,
  },
  deleteIcon: {
    width: 25,
    height: 25,
    tintColor: '#000',
  },
  editButton: {
    marginLeft: 10,
  },
  editIcon: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  storeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storeIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  storeName: {
    flex: 1,
    fontSize: 16,
  },
  selected: {
    fontSize: 18,
    color: 'green',
  },
  addButton: {
    backgroundColor: '#F8B500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditListPage;
