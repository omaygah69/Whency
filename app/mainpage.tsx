import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/images/_logo.png";

export default function MainPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter(); 
    const [password, setPassword] = useState("");
    const [passwordEntries, setPasswordEntries] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    useEffect(() => {
        loadPasswords();
    }, []);

    useEffect(() => {
        filterSuggestions();
    }, [searchQuery]);

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

    const filterSuggestions = () => {
        if (searchQuery.trim() === "") {
            setFilteredSuggestions([]);
            return;
        }

        const filtered = passwordEntries.filter((entry) =>
            entry.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredSuggestions(filtered);
    };

    return (
        <SafeAreaView className="flex-1 bg-bgColor">
            <View className="flex-row items-center mx-4 mt-6">
                <View className="flex-row items-center bg-white rounded-full flex-1 shadow-md">
                    <TouchableOpacity className="p-1">
                        <Ionicons name="search" size={35} color="#598da5" />
                    </TouchableOpacity>

                    <TextInput
                        className="font-bold flex-1 h-10 ml-2 text-black text-lg placeholder:text-[#598da5]"
                        placeholder="Search Passwords"
                        placeholderTextColor="#598da5" 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity className="p-1 ml-2">
                    <Ionicons name="menu" size={55} color="#fbfff5" />
                </TouchableOpacity>
            </View>

            {filteredSuggestions.length > 0 && (
                <ScrollView className="bg-white mx-6 mt-2 rounded-md shadow-md max-h-40">
                    {filteredSuggestions.map((entry, index) => (
                        <TouchableOpacity
                            key={index}
                            className="p-2 border-b border-gray-200"
                            onPress={() => setSearchQuery(entry.name)}
                        >
                            <Text className="text-black font-bold">{entry.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <View className="flex-row items-center mt-10">
                <Image source={logo} style={styles.image} />
                <View className="flex-1">
                    <Text className="text-btnLight text-[14px] font-bold">Store, generate, and manage your passwords securely with</Text>
                    <Text className="text-textLight text-[30px] font-bold mt-1">Password Encryption</Text>
                </View>
            </View>

            <View className="flex-1 px-10 mt-10">
                <TextInput
                    className="font-bold p-3 px-8 w-100 text-base text-black rounded-full bg-textLight"
                    placeholder="Enter password"
                    placeholderTextColor="#598da5"
                    value={password}
                    onChangeText={setPassword}
                />

                <Text className="text-btnLight text-[14px] font-bold text-center my-3">PASSWORD GENERATOR</Text>

                <TextInput
                    className="font-bold p-3 px-6 w-100 text-base text-black rounded-full bg-textLight"
                    placeholder="Hash password output"
                    placeholderTextColor="#598da5"
                    value={password}
                />
            </View>

            <View className="absolute bottom-0 left-0 right-0 h-[90px] flex-row bg-darkinBlue justify-around items-center border-t-2 border-[#598da5]">
                <TouchableOpacity className="items-center" onPress={() => router.push("/alertpage")}>
                    <Feather name="alert-triangle" size={40} color="#e8c6bc" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => router.push("/addpage")}>
                    <MaterialIcons name="add-circle" size={40} color="#e8c6bc" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Add</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => router.push("/vault")}>
                    <Fontisto name="locked" size={40} color="#e8c6bc" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Vault</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <MaterialIcons name="settings" size={40} color="#e8c6bc" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        justifyContent: "center",
    },
});
