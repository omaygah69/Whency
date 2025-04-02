import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AlertPage() {
    const router = useRouter();
    const [passwordEntries, setPasswordEntries] = useState([]);

    useEffect(() => {
	loadPasswords();
    }, []);

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

    const getExpiredPasswords = () => {
	const now = new Date();
	return passwordEntries.filter(entry => new Date(entry.expiryDate) < now);
    };


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
		Expired Passwords
	    </Text>

	    {passwordEntries.length === 0 ? (
		<Text className="text-white">No passwords stored yet.</Text>
	    ) : (
		<View className="mt-4">
		    {getExpiredPasswords().map((entry, index) => (
			<TouchableOpacity key={index} className="bg-red-200 p-4 my-2 rounded-md">
			    <Text className="text-black font-bold">Name: {entry.name}</Text>
			    <Text className="text-black break-all">Hash: {entry.hashedPassword}</Text>
			    <Text className="text-black">
				Expiry Date: {formatExpiryDate(entry.expiryDate)}
			    </Text>
			</TouchableOpacity>
		    ))}
		</View>
	    )}
	</View>
    );
}
