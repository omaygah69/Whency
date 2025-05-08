import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";

type PasswordEntry = {
    name: string;
    hashedPassword: string;
    expiryDate: string;
};

export default function Vault() {
    const router = useRouter();
    const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([]);

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

    const clearPasswords = () => {
	Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to clear all stored passwords?",
            [
		{
                    text: "Cancel",
                    style: "cancel",
		},
		{
                    text: "Yes, Clear All",
                    style: "destructive",
                    onPress: async () => {
			try {
                            await AsyncStorage.removeItem("passwords");
                            setPasswordEntries([]);
			} catch (error) {
                            console.error("Error clearing passwords:", error);
			}
                    },
		},
            ],
            { cancelable: true }
	);
    };

    const formatExpiryDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString();
    };

    const isExpired = (isoDate: string) => {
        const now = new Date();
        return new Date(isoDate) < now;
    };

    return (
        <View className="flex-1 justify-center items-center p-6 bg-bgColor">
            <View className="absolute top-4 right-4">
                <TouchableOpacity className="p-2" onPress={() => router.push("/mainpage")}>
                    <Ionicons name="home" size={30} color="#fbfff5" />
                </TouchableOpacity>
            </View>

            <Text className="text-textLight text-center text-[20px] font-bold font-[Cinzel] mt-10 mb-6">
                Passwords Vault
            </Text>

            {passwordEntries.length === 0 ? (
                <Text className="text-white">No passwords stored yet.</Text>
            ) : (
                <ScrollView className="w-full p-2">
                    {passwordEntries.map((entry, index) => (
                        <TouchableOpacity
                            key={index}
                            className="bg-btnLight p-4 my-2 rounded-md"
                            onPress={() =>
                                router.push({
                                    pathname: "/passworddetails",
                                    params: { name: entry.name },
                                })
                            }
                        >
                            <Text className="text-black font-bold">Name: {entry.name}</Text>
                            <Text className="text-black break-all">Hash: {entry.hashedPassword}</Text>
                            <Text className="text-black">
                                Expiry Date: {formatExpiryDate(entry.expiryDate)}
                                {isExpired(entry.expiryDate) && (
                                    <Text className="text-red-600 font-bold"> (Expired)</Text>
                                )}
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
                    <Text className="text-white text-lg font-bold text-center">
                        Clear Passwords
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
