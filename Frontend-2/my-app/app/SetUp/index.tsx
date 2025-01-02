import React, { useState } from "react";
import { View, Text, Button, ScrollView, TextInput } from "react-native";
import Checkbox from "expo-checkbox";

const SetupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    gender: "",
    exercise: false,
    sleep: "",
  });
  const [preferences, setPreferences] = useState({
    deepBreathing: false,
    meditation: false,
    activity: false,
    walk: false,
    socialInteraction: false,
    other: false,
  });
  const combinedState = { ...formData, ...preferences };

  const handleCheckboxChange = (field: any, value: any) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [field]: value, // Update the corresponding field
    }));
  };

  const handleInputChangeText = (field: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNumericInputChange = (field: string, value: string) => {
    // Parse the numeric value, trimming spaces
    const parsedValue = parseNumericString(value);

    // Update the state with the parsed value (it will be a number)
    setFormData((prevData) => ({
      ...prevData,
      [field]: parsedValue,
    }));
  };

  // Utility function to parse numeric strings
  const parseNumericString = (value: string, defaultValue: any = NaN) => {
    const trimmedValue = value.trim();
    const parsedNumber = parseFloat(trimmedValue);

    // Return parsed number if valid, otherwise return default value
    return isNaN(parsedNumber) ? defaultValue : parsedNumber;
  };

  return (
    <ScrollView style={{ paddingLeft: 10 }}>
      <TextInput
        value={formData.name}
        onChangeText={(text) => handleInputChangeText("name", text)}
        placeholder="Enter your name"
      />
      <TextInput
        value={formData.age.toString()}
        onChangeText={(text) => handleNumericInputChange("age", text)}
        placeholder="Enter your name"
      />
      <TextInput
        value={formData.height.toString()}
        keyboardType="numeric"
        onChangeText={(text) => handleNumericInputChange("name", text)}
        placeholder="Enter your height"
      />
      <TextInput
        value={formData.weight.toString()}
        onChangeText={(text) => handleNumericInputChange("name", text)}
        placeholder="Enter your weight"
      />
      <TextInput
        value={formData.gender}
        onChangeText={(text) => handleInputChangeText("name", text)}
        placeholder="Enter your gender"
      />
      <Text>Exercise</Text>
      <Checkbox
        value={formData.exercise} // Bind checkbox state to formData.exercise
        onValueChange={(newValue) => {
          setFormData((prevData) => ({
            ...prevData,
            exercise: newValue, // Update the exercise state
          }));
        }}
      />

      <TextInput
        value={formData.sleep}
        onChangeText={(text) => handleInputChangeText("name", text)}
        placeholder="How is your sleep"
      />

      <Text>Preferences:</Text>

      <Text>Deep Breathing</Text>

      <Checkbox
        value={preferences.deepBreathing}
        onValueChange={(newValue) =>
          handleCheckboxChange("deepBreathing", newValue)
        }
      />

      <Text>Meditation</Text>

      <Checkbox
        value={preferences.meditation}
        onValueChange={(newValue) =>
          handleCheckboxChange("meditation", newValue)
        }
      />

      <Text>Exercise</Text>

      <Checkbox
        value={preferences.activity}
        onValueChange={(newValue) => handleCheckboxChange("exercise", newValue)}
      />
      <Text>Walk</Text>

      <Checkbox
        value={preferences.walk}
        onValueChange={(newValue) => handleCheckboxChange("walk", newValue)}
      />

      <Text>Social Interaction</Text>

      <Checkbox
        value={preferences.socialInteraction}
        onValueChange={(newValue) =>
          handleCheckboxChange("socialInteraction", newValue)
        }
      />

      <Checkbox
        value={preferences.other}
        onValueChange={(newValue) => handleCheckboxChange("journal", newValue)}
      />

      <Text>Progressive Muscle Relaxation</Text>

      {/* Submit button */}
      {/* <Button title="Submit" onPress={handleSubmit} /> */}
    </ScrollView>
  );
};

export default SetupPage;
