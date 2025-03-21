import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import bcrypt from "bcryptjs";
import zxcvbn from "zxcvbn";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [reType, setRetype] = useState("");
    const [strength, setStrength] = useState({ score: 0, feedback: {} });

    const handlePasswordChange = (text: string) => {
	setPassword(text);
	const result = zxcvbn(text);
	setStrength(result);
    };

    const getStrengthLabel = (score: number) => {
	switch (score) {
	    case 0:
	    case 1:
		return { label: "Weak", color: "red" };
	    case 2:
		return { label: "Fair", color: "orange" };
	    case 3:
		return { label: "Good", color: "white" };
	    case 4:
		return { label: "Strong", color: "green" };
	    default:
		return { label: "Unknown", color: "gray" };
	}
    };

    const strengthInfo = getStrengthLabel(strength.score);

    // Utility to calculate 60 days from now in ISO format
    const getExpiryDate = () => {
	const now = new Date();
	// Add 60 days
	now.setDate(now.getDate() + 60);
	return now.toISOString();
    };

    const storePassword = async () => {
	if (!name.trim()) {
	    Alert.alert("Error", "Please enter a name or label for your password.");
	    return;
	}

	if (password !== reType) {
	    Alert.alert("Error", "Passwords do not match!");
	    return;
	}

	try {
	    // Retrieve any previously stored passwords
	    const existingData = await AsyncStorage.getItem("passwords");
	    const passwordEntries = existingData ? JSON.parse(existingData) : [];

	    // Hash the password
	    const hashedPassword = await bcrypt.hash(password, 10);

	    // Check if a similar password under the same name already exists
	    // Here, we compare by name and also use bcrypt.compareSync to verify the password against the hash
	    const isDuplicate = passwordEntries.some(
		(entry: { name: string; hashedPassword: string }) =>
		    entry.name === name && bcrypt.compareSync(password, entry.hashedPassword)
	    );

	    if (isDuplicate) {
		Alert.alert("Error", "This password already exists for this label.");
		return;
	    }

	    // Prepare the new entry with name, hashed password and expiryDate (60 days from now)
	    const newEntry = {
		name,
		hashedPassword,
		expiryDate: getExpiryDate(),
	    };

	    // Append the new entry and store it back in AsyncStorage
	    passwordEntries.push(newEntry);
	    await AsyncStorage.setItem("passwords", JSON.stringify(passwordEntries));

	    Alert.alert("Success", "Password stored securely with label and expiry date!");
	    // Reset form fields
	    setName("");
	    setPassword("");
	    setRetype("");
	    setStrength({ score: 0, feedback: {} });
	} catch (error) {
	    console.error("Error saving password:", error);
	    Alert.alert("Error", "Failed to store the password.");
	}
    };

    return (
	<View className="flex-1 justify-center items-center p-20 bg-bgColor">
	    <View className="absolute top-4 right-4">
		<TouchableOpacity className="p-2" onPress={() => router.push("/mainpage")}>
		    <Ionicons name="home" size={40} color="#fbfff5" />
		</TouchableOpacity>
	    </View>

	    <View className="flex-row items-center mx-4 p-1 ml-2">
		<FontAwesome name="plus" size={55} color="#fbfff5" />
	    </View>

	    <Text className="text-textLight text-center text-[30px] font-bold font-[Cinzel] mb-9">
		ADD PASSWORD
	    </Text>

	    <TextInput
		className="font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight"
		placeholder="Enter label or name"
		placeholderTextColor="#598da5"
		value={name}
		onChangeText={setName}
	    />

	    <TextInput
		className="font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight mt-6"
		placeholder="Enter password"
		placeholderTextColor="#598da5"
		value={password}
		onChangeText={handlePasswordChange}
		secureTextEntry={true}
	    />

	    <TextInput
		className="font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight mt-6"
		placeholder="Retype password"
		placeholderTextColor="#598da5"
		value={reType}
		onChangeText={setRetype}
		secureTextEntry={true}
	    />

	    {password.length > 0 && (
		<Text className="text-[15px] font-bold mt-4" style={{ color: strengthInfo.color }}>
		    Strength: {strengthInfo.label}
		</Text>
	    )}

	    <TouchableOpacity
		className="bg-blueish px-6 py-3 rounded-full w-60 mt-6 self-center"
		onPress={storePassword}
	    >
		<Text className="text-bgColor text-lg font-bold text-center">Save Password</Text>
	    </TouchableOpacity>
	</View>
    );
}
