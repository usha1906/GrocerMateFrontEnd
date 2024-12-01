import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
  Button
} from "react-native";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TaskScreen({ route }) {
  const { selectedDate } = route.params;
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false); // To track if we're editing
  const [selectedTask, setSelectedTask] = useState(null); // Currently selected task for editing

  // Task form fields
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch tasks for the selected date
  const fetchTasks = async () => {
    try {
      const tasksQuery = query(
        collection(db, "users", "alice", "tasks"),
        where("date", "==", selectedDate)
      );
      const querySnapshot = await getDocs(tasksQuery);
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Save or Edit a Task
  const saveTask = async () => {
    if (!title || !startTime || !endTime) {
      alert("Please fill out all fields!");
      return;
    }
    try {
      if (editMode) {
        // Update existing task
        const taskRef = doc(db, "users", "alice", "tasks", selectedTask.id);
        await updateDoc(taskRef, { title, startTime, endTime, notes });
        alert("Task updated successfully!");
      } else {
        // Add new task
        const newTask = { title, date: selectedDate, startTime, endTime, notes };
        await addDoc(collection(db, "users", "alice", "tasks"), newTask);
        alert("Task added successfully!");
      }
      setModalVisible(false);
      fetchTasks();
      clearForm();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Delete a Task
  const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, "users", "alice", "tasks", taskId);
      await deleteDoc(taskRef);
      alert("Task deleted successfully!");
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open the modal for editing a task
  const openEditModal = (task) => {
    setEditMode(true);
    setSelectedTask(task);
    setTitle(task.title);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setNotes(task.notes);
    setModalVisible(true);
  };

  // Clear the form fields
  const clearForm = () => {
    setEditMode(false);
    setSelectedTask(null);
    setTitle("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks for {selectedDate}</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskTime}>
                {item.startTime} - {item.endTime}
              </Text>
              <Text style={styles.taskNotes}>{item.notes}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Icon name="edit" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Icon name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noTasksText}>No tasks for this date.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Modal for Adding/Editing Task */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editMode ? "Edit Task" : "Add Task"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Time"
              value={startTime}
              onChangeText={setStartTime}
            />
            <TextInput
              style={styles.input}
              placeholder="End Time"
              value={endTime}
              onChangeText={setEndTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.modalButtons}>
              <Button title={editMode ? "Save Changes" : "Save Task"} onPress={saveTask} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => {
                  setModalVisible(false);
                  clearForm();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F3A800",
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: "#F3A800",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  taskTime: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  taskNotes: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888888",
  },
  addButton: {
    backgroundColor: "#F3A800",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F3A800",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F3F3F3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
  },
});

