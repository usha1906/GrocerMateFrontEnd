import React, { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView } from "react-native";

const AddStoreForm = ({ onAddStore }) => {
  const [name, setName] = useState("");
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "us" }, // Restrict to the US
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !value) {
      alert("Please enter both name and address");
      return;
    }

    try {
      // Get geocode information
      const results = await getGeocode({ address: value });
      const { lat, lng } = await getLatLng(results[0]);

      // Create new store object
      const newStore = { name, address: value, location: { lat, lng } };

      // Pass the new store data to parent component
      onAddStore(newStore);

      // Reset form and clear suggestions
      setName("");
      setValue("");
      clearSuggestions();
    } catch (error) {
      console.error("Error handling geocode:", error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Add Store</Text>
      <TextInput
        style={styles.input}
        placeholder="Store Name"
        value={name}
        onChangeText={setName}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Store Address"
        value={value}
        onChangeText={setValue}
        editable={ready}
        required
      />
      {status === "OK" && (
        <ScrollView style={styles.suggestionsContainer}>
          {data.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.place_id}
              onPress={() => {
                setValue(suggestion.description);
                clearSuggestions();
              }}
              style={styles.suggestionItem}
            >
              <Text>{suggestion.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Store</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 16,
    padding: 20,
    backgroundColor: "#f8f8f8", // Light background color
    borderRadius: 8,
    alignItems: "center", // Center the content horizontally
    justifyContent: "center", // Center content vertically if needed
  },
  formTitle: {
    fontSize: 24, // Bigger font size for the title
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    fontSize: 18, // Increase font size for inputs
    padding: 12,
    width: "100%", // Make inputs full-width
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  suggestionsContainer: {
    width: "100%", // Make suggestions container full width
    maxHeight: 150, // Limit the max height of suggestions
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 5,
    marginBottom: 16,
  },
  suggestionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#FFA500", // Orange button color
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18, // Increase font size for the button text
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddStoreForm;
