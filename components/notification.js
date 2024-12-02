import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to import your Firestore config

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications for Bob
    const fetchNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'users', 'Bob', 'notifications');
        const querySnapshot = await getDocs(notificationsRef);

        const fetchedNotifications = [];
        querySnapshot.forEach((doc) => {
          fetchedNotifications.push({ id: doc.id, ...doc.data() });
        });

        setNotifications(fetchedNotifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'users', 'Bob', 'notifications', notificationId));
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Notifications...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationContainer}>
            <Text style={styles.notificationText}>{notification.message}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNotification(notification.id)}
            >
              <Image source={require('../assets/cross.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noNotificationsText}>No notifications available.</Text>
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
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#f00',
    borderRadius: 20,
    padding: 5,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  noNotificationsText: {
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

export default NotificationPage;