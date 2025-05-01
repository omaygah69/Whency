import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { digestStringAsync, CryptoDigestAlgorithm } from "expo-crypto";
import Toast from "react-native-toast-message";

const PLATFORMS = ["YouTube", "Twitter", "Facebook", "Instagram", "Snapchat", "Custom"];

type PasswordEntry = {
    name: string;
    hashedPassword: string;
    expiryDate: string;
    platforms?: string[];
};

export default function PasswordDetails() {
    const router = useRouter();
    const { name } = useLocalSearchParams<{ name: string }>();

    const [entry, setEntry] = useState<PasswordEntry | null>(null);
    const [enteredPassword, setEnteredPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newHashedPassword, setNewHashedPassword] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [customPlatform, setCustomPlatform] = useState("");
    const [lastClickTime, setLastClickTime] = useState<number | null>(null);

    useEffect(() => {
        loadEntry();
    }, []);

    const loadEntry = async () => {
        try {
            const storedData = await AsyncStorage.getItem("passwords");
            if (storedData) {
                const entries = JSON.parse(storedData);
                const foundEntry = entries.find((e: PasswordEntry) => e.name === name);
                if (foundEntry) {
                    setEntry(foundEntry);
                    setSelectedPlatforms(foundEntry.platforms || []);
                } else {
                    console.warn("No entry found for:", name);
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

        try {
            const hashedEnteredPassword = await digestStringAsync(
                CryptoDigestAlgorithm.SHA256,
                enteredPassword.trim()
            );

            if (hashedEnteredPassword === entry.hashedPassword) {
                setIsAuthenticated(true);
                setNewName(entry.name);
                setNewHashedPassword(entry.hashedPassword);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Mismatch",
                    text2: "Password does not match.",
                });
            }
        } catch (err) {
            console.error("Authentication error:", err);
        }
    };

    const handlePlatformToggle = (platform: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
        );
    };

    const handleSaveChanges = async () => {
        try {
            let updatedPassword = newHashedPassword;
            if (newPassword) {
                updatedPassword = await digestStringAsync(
                    CryptoDigestAlgorithm.SHA256,
                    newPassword.trim()
                );
            }

            let updatedPlatforms = [...selectedPlatforms];
            if (
                selectedPlatforms.includes("Custom") &&
                customPlatform.trim() &&
                !updatedPlatforms.includes(customPlatform.trim())
            ) {
                updatedPlatforms.push(customPlatform.trim());
            }

            const storedData = await AsyncStorage.getItem("passwords");
            if (storedData) {
                const entries = JSON.parse(storedData);
                const updatedEntries = entries.map((e: PasswordEntry) =>
                    e.name === entry!.name
                        ? {
                              ...e,
                              name: newName,
                              hashedPassword: updatedPassword,
                              platforms: updatedPlatforms,
                          }
                        : e
                );
                await AsyncStorage.setItem("passwords", JSON.stringify(updatedEntries));
                Alert.alert("Success", "Password details updated.");
                router.push("/vault");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleDeletePassword = async () => {
        const currentTime = new Date().getTime();

        if (lastClickTime && currentTime - lastClickTime < 500) {
            try {
                const storedData = await AsyncStorage.getItem("passwords");
                if (storedData) {
                    const entries = JSON.parse(storedData);
                    const updatedEntries = entries.filter((e: PasswordEntry) => e.name !== entry?.name);
                    await AsyncStorage.setItem("passwords", JSON.stringify(updatedEntries));
                    Toast.show({
                        type: "success",
                        text1: "Deleted",
                        text2: "Password entry deleted successfully.",
                    });
                    router.push("/vault");
                }
            } catch (error) {
                console.error("Error deleting password:", error);
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to delete password.",
                });
            }
        } else {
            setLastClickTime(currentTime);
            Toast.show({
                type: "info",
                text1: "Double-click to confirm deletion",
            });
        }
    };

    return (
        <View className="flex-1 p-10 bg-bgColor items-center">
            <TouchableOpacity className="absolute top-4 left-4" onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={30} color="#fbfff5" />
            </TouchableOpacity>

            {!isAuthenticated ? (
                <View className="w-full items-center">
                    <Text className="text-textLight text-center text-[30px] font-bold font-[Cinzel] mt-60">
                        Verify
                    </Text>

                    <TextInput
                        className="mt-6 font-bold py-2 px-6 w-60 text-base text-black rounded-full bg-btnLight"
                        secureTextEntry
                        value={enteredPassword}
                        onChangeText={setEnteredPassword}
                        placeholder="Enter password"
                        placeholderTextColor="#598da5"
                    />
                    <TouchableOpacity
                        className="bg-blueish px-6 py-2 rounded-full w-60 mt-5 self-center"
                        onPress={handleAuthenticate}
                    >
                        <Text className="text-black font-bold text-center">Unlock</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="w-full items-center">
                    <Text className="text-textLight text-center text-[15px] font-[Cinzel] font-bold mt-8">
                        NAME
                    </Text>
                    <TextInput
                        className="my-4 font-bold py-2 px-6 w-60 text-base text-black rounded-full bg-btnLight"
                        value={newName}
                        onChangeText={setNewName}
                    />

                    <Text className="text-white text-[15px] my-2 font-bold">
                        NEW PASSWORD
                    </Text>
                    <TextInput
                        className="my-2 font-bold py-2 px-6 w-60 text-base text-black rounded-full bg-btnLight"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor="#598da5"
                    />

                    <Text className="text-white text-[15px] font-bold my-2">SELECT PLATFORMS:</Text>
                    {PLATFORMS.map((platform) => (
                        <TouchableOpacity
                            key={platform}
                            className="flex-row items-center mb-2"
                            onPress={() => handlePlatformToggle(platform)}
                        >
                            <View
                                className={`w-5 h-5 rounded-sm border ${
                                    selectedPlatforms.includes(platform)
                                        ? "bg-blue-500"
                                        : "border-gray-500"
                                }`}
                            />
                            <Text className="text-white text-[15px] ml-2">{platform}</Text>
                        </TouchableOpacity>
                    ))}

                    {selectedPlatforms.includes("Custom") && (
                        <TextInput
                            className="mt-6 font-bold p-3 px-6 w-200 text-base text-black rounded-full bg-btnLight"
                            placeholder="Enter custom platform"
                            placeholderTextColor="#598da5"
                            value={customPlatform}
                            onChangeText={setCustomPlatform}
                        />
                    )}

                    <TouchableOpacity
                        className="bg-blueish px-6 py-2 rounded-full w-60 mt-5 self-center"
                        onPress={handleSaveChanges}
                    >
                        <Text className="text-white font-bold text-center">Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-red-500 px-6 py-2 rounded-full w-60 mt-5 self-center"
                        onPress={handleDeletePassword}
                    >
                        <Text className="text-white font-bold text-center">Delete Password</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Toast position="top" />
        </View>
    );
}
