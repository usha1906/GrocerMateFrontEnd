import React, { useEffect, useState } from "react";
import { View, Text,Button, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import AddStoreForm from "./AddStoreForm";
import { db } from "../firebase";
import { doc, collection, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"]; // Ensure the Places library is included

const GeofenceScreen = () => {
  const [groceryStores, setGroceryStores] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // Track user's current location
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Message to show in the modal

  // Load Google Maps API for geofencing
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAd9_m1qsCrf1VDDYonyOOOnjuTxSxK3S0", // Replace with your API key
    libraries,
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const userDocRef = doc(db, "users", "alice");
        const storesCollectionRef = collection(userDocRef, "stores");
        const snapshot = await getDocs(storesCollectionRef);

        if (snapshot.empty) {
          console.log("No stores found.");
        } else {
          console.log("Stores fetched successfully.");
        }

        const stores = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setGroceryStores(stores);
      } catch (error) {
        console.error("Error fetching stores from Firestore:", error);
      }
    };

    fetchStores();

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleAddStore = async (newStore) => {
    try {
      const userDocRef = doc(db, "users", "alice");
      const storesCollectionRef = collection(userDocRef, "stores");

      // Fetch the current stores to calculate the next ID
      const snapshot = await getDocs(storesCollectionRef);
      const nextId = snapshot.size; // Use the size of the collection as the next ID

      // Assign the next available ID to the new store
      const storeData = {
        ...newStore,
        id: nextId, // Incremental ID starting at 0
      };

      // Add the store with the ID to Firestore
      const docRef = await addDoc(storesCollectionRef, storeData);

      // Update state with the newly added store
      setGroceryStores((prevStores) => [
        ...prevStores,
        { ...storeData, docId: docRef.id },
      ]);

      // Show modal with success message
      setModalMessage("Store Successfully Added");
      setModalVisible(true);
    } catch (error) {
      console.error("Error adding store to Firestore:", error);
    }
  };

  const removeStore = async (docId, storeName) => {
    if (!docId) {
      console.error("Error: Store ID is undefined");
      return;
    }

    try {
      const userDocRef = doc(db, "users", "alice");
      const storesCollectionRef = collection(userDocRef, "stores");
      const storeDocRef = doc(storesCollectionRef, docId);

      // Remove from Firestore
      await deleteDoc(storeDocRef);

      // Update state
      setGroceryStores((prevStores) =>
        prevStores.filter((store) => store.docId !== docId)
      );

      // Show modal with success message
      setModalMessage("Store Successfully Removed");
      setModalVisible(true);
    } catch (error) {
      console.error("Error removing store:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Geofencing logic: Check distance when location or stores change
  useEffect(() => {
    if (userLocation && groceryStores.length > 0) {
      groceryStores.forEach((store) => {
        const storeLocation = store.location; // store has lat, lng
        const distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          storeLocation.lat,
          storeLocation.lng
        );

        if (distance <= 1609) { // 1 mile = 1609 meters
          // Send notification to Firestore
          sendNotification(store);
          alert(`You are within 1 mile of ${store.name}!`);
        }
      });
    }
  }, [userLocation, groceryStores]);
 // Calculate distance between two lat/lng points (in meters)
 const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const sendNotification = async (store) => {
  try {
    const notificationData = {
      near: store.name,
      msg: `You are near ${store.name}`,
      timestamp: new Date().toISOString(), // Format as ISO 8601 string
      id: store.id, // Store's auto-incremented ID
      type: "geofencing",
    };

    const notificationsCollectionRef = collection(db, "users", "alice", "notifications");
    await addDoc(notificationsCollectionRef, notificationData);
    console.log("Notification sent to Firestore:", notificationData);
  } catch (error) {
    console.error("Error sending notification to Firestore:", error);
  }
};

  if (loadError) return <Text>Error loading Google Maps: {loadError.message}</Text>;
  if (!isLoaded) return <Text>Loading Google Maps...</Text>;

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Geofencing</Text>
      <AddStoreForm onAddStore={handleAddStore} />
      {groceryStores.length > 0 ? (
        <View style={styles.storesListContainer}>
          <Text style={styles.geofencedTitle}>Geofenced Stores</Text>
          {groceryStores.map((store) => (
            store.name !== "Placeholder Store" && (
              <View key={store.docId} style={styles.storeItem}>
                <View style={styles.storeGrid}>
                  <Text style={styles.boldText}>
                    {store.name} ({store.address})
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeStore(store.docId, store.name)}
                  >
                    <Image
                      source={require('../assets/dustbin.png')}
                      style={styles.deleteIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          ))}
        </View>
      ) : (
        <Text>No stores added yet.</Text>
      )}

      {/* Modal Popup */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  geofencedTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  storesListContainer: {
    backgroundColor: "#FFA500",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  storeItem: {
    marginBottom: 8,
  },
  storeGrid: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  boldText: {
    fontWeight: "bold",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
export default GeofenceScreen;
