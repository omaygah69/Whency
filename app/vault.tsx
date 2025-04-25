import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function Vault() {
    const router = useRouter();
    // Set the type to match the stored object properties
    const [passwordEntries, setPasswordEntries] = useState([]);

    useFocusEffect(
	useCallback(() => {
	    loadPasswords();
	}, [])
    );

    const loadPasswords = async () => {
	try {
	    const storedData = await AsyncStorage.getItem("passwords");
	    if (storedData) {
		setPasswordEntries(JSON.parse(storedData));
	    }
	} catch (error) {
	    console.error("Error loading passwords:", error);
	}
    };

    const clearPasswords = async () => {
	try {
	    await AsyncStorage.removeItem("passwords");
	    setPasswordEntries([]);
	} catch (error) {
	    console.error("Error clearing passwords:", error);
	}
    };

    // A helper to format the expiry date string into a nicer format
    const formatExpiryDate = (isoDate) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString();
    };

    return (
	<View className="flex-1 justify-center items-center p-6 bg-bgColor">
	    <View className="absolute top-4 right-4">
		<TouchableOpacity className="p-2" onPress={() => router.push("/mainpage")}>
		    <Ionicons name="home" size={40} color="#fbfff5" />
		</TouchableOpacity>
	    </View>

	    <Text className="text-textLight text-center text-[30px] font-bold font-[Cinzel] mb-6">
		Passwords Vault
	    </Text>

	    {passwordEntries.length === 0 ? (
		<Text className="text-white">No passwords stored yet.</Text>
	    ) : (
		<ScrollView className="w-full">
		    {passwordEntries.map((entry, index) => (
			<TouchableOpacity key={index} className="bg-btnLight p-4 my-2 rounded-md"
			onPress={() => router.push({ pathname: "/passworddetails", params: { name: entry.name } })}>
			    <Text className="text-black font-bold">Name: {entry.name}</Text>
			    <Text className="text-black break-all">Hash: {entry.hashedPassword}</Text>
			    <Text className="text-black">
				Expiry Date: {formatExpiryDate(entry.expiryDate)}
			    </Text>
			</TouchableOpacity>
		    ))}
		</ScrollView>
	    )}

	    {passwordEntries.length > 0 && (
		<TouchableOpacity
		    className="bg-red-500 px-6 py-3 rounded-full w-60 mt-6"
		    onPress={clearPasswords}
		>
		    <Text className="text-white text-lg font-bold text-center">Clear Passwords</Text>
		</TouchableOpacity>
	    )}
	</View>
    );
}
