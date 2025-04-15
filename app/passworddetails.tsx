import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import bcrypt from "bcryptjs";
import { Picker } from "@react-native-picker/picker";

const PLATFORMS = ["YouTube", "Twitter", "Facebook", "Instagram", "Snapchat", "Custom"];

export default function PasswordDetails() {
    const router = useRouter();
    const { name } = useLocalSearchParams<{ name: string }>();

    const [entry, setEntry] = useState<any>(null);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newHashedPassword, setNewHashedPassword] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [customPlatform, setCustomPlatform] = useState("");

    useEffect(() => {
        loadEntry();
    }, []);

    const loadEntry = async () => {
        try {
            const storedData = await AsyncStorage.getItem("passwords");
            if (storedData) {
                const entries = JSON.parse(storedData);
                const foundEntry = entries.find((e: any) => e.name === name);
                if (foundEntry) {
                    setEntry(foundEntry);
                    setSelectedPlatforms(foundEntry.platforms || []);
                }
            }
        } catch (error) {
            console.error("Error loading entry:", error);
        }
    };

    const handleAuthenticate = async () => {
        if (!entry) {
            Alert.alert("Error", "Password entry not loaded. Please try again.");
            return;
        }

        if (!entry.hashedPassword) {
            Alert.alert("Error", "No stored password found for this entry.");
            return;
        }

        const isMatch = await bcrypt.compare(enteredPassword, entry.hashedPassword);

        if (isMatch) {
            setIsAuthenticated(true);
            setNewName(entry.name);
            setNewHashedPassword(entry.hashedPassword);
        } else {
            Alert.alert("Incorrect Password", "The entered password is incorrect.");
        }
    };

    const handlePlatformToggle = (platform: string) => {
        if (selectedPlatforms.includes(platform)) {
            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
        } else {
            setSelectedPlatforms([...selectedPlatforms, platform]);
        }
    };

    const handleSaveChanges = async () => {
        try {
            let updatedPassword = newHashedPassword;
            if (newPassword) {
                updatedPassword = await bcrypt.hash(newPassword, 10);
            }

            const storedData = await AsyncStorage.getItem("passwords");
            if (storedData) {
                let entries = JSON.parse(storedData);
                let updatedEntries = entries.map((e: any) =>
                    e.name === entry.name
                    ? { ...e, name: newName, hashedPassword: updatedPassword, platforms: selectedPlatforms }
                    : e
                );
                await AsyncStorage.setItem("passwords", JSON.stringify(updatedEntries));
                Alert.alert("Success", "Password details updated.");
                router.back();
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    return (
        <View className="flex-1 p-20 bg-bgColor jutify-center items-center">
            <TouchableOpacity className="absolute top-4 left-4" onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={40} color="#fbfff5" />
            </TouchableOpacity>

	    
	    {!isAuthenticated ? (
                <View className="w-full items-center">
		    <Text className="text-textLight text-center text-[30px] font-bold font-[Cinzel] mt-40">
			Verify
		    </Text>

		    <TextInput
                        className="mt-6 font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight"
                        secureTextEntry
                        value={enteredPassword}
                        onChangeText={setEnteredPassword}
                        placeholder="Enter password"
                        placeholderTextColor="#598da5"
		    />
		    <TouchableOpacity
                        className="bg-blueish px-6 py-3 rounded-full w-60 mt-6 self-center mt-6"
                        onPress={handleAuthenticate}
		    >
                        <Text className="text-black font-bold text-center">Unlock</Text>
		    </TouchableOpacity>
                </View>
	    ) : (
                <View className="w-full items-center">
		    <Text className="text-textLight text-center text-[25px] font-[Cinzel] mt-35">
			Name:</Text>
		    <TextInput
                        className="my-4 font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight"
                        value={newName}
                        onChangeText={setNewName}
		    />

		    <Text className="text-white text-[15px] my-2">New Password (Leave empty to keep the same):</Text>
		    <TextInput
                        className="my-21 font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#598da5"
		    />

		    <Text className="text-white text-[20px] my-2">Select Platforms:</Text>
		    {PLATFORMS.map((platform) => (
                        <TouchableOpacity
			    key={platform}
			    className="flex-row items-center mb-2"
			    onPress={() => handlePlatformToggle(platform)}
                        >
			    <View
                                className={`w-5 h-5 rounded-sm border ${
                                    selectedPlatforms.includes(platform) ? "bg-blue-500" : "border-gray-500"
                                }`}
			    />
			    <Text className="text-white text-[15] ml-2">{platform}</Text>
                        </TouchableOpacity>
		    ))}

		    {selectedPlatforms.includes("Custom") && (
                        <TextInput
                            className="mt-6 font-bold p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight"
			    placeholder="Enter custom platform"
			    placeholderTextColor="#598da5"
			    value={customPlatform}
			    onChangeText={setCustomPlatform}
                        />
		    )}

		    <TouchableOpacity
                        className="bg-blueish px-6 py-3 rounded-full w-60 mt-6 self-center mt-6"
                        onPress={handleSaveChanges}
		    >
                        <Text className="text-white font-bold text-center">Save Changes</Text>
		    </TouchableOpacity>
                </View>
	    )}

        </View>
    );
}
