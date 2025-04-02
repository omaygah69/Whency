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
    const [retypePassword, setRetypePassword] = useState("");
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
            <View className="flex-row items-center mx-4 mt-8">
                <View className="flex-row items-center bg-white rounded-full flex-1 shadow-md">
                    {/* <View className="p-1">
                        <Ionicons name="search" size={35} color="#598da5" />
			</View>
		      */}
                    <TextInput
                        className="px-8 font-bold flex-1 h-12 ml-2 text-black text-lg placeholder:text-[#598da5]"
                        placeholder="Search Passwords"
                        placeholderTextColor="#598da5" 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity className="p-1 ml-2">
                    <Ionicons name="search" size={35} color="#fbfff5" />
                </TouchableOpacity>
            </View>

	    {filteredSuggestions.length > 0 && (
		<View style={styles.suggestionsContainer} className="mt-2">
		    <ScrollView>
			{filteredSuggestions.map((entry, index) => (
			    <TouchableOpacity
				key={index}
				    style={styles.suggestionItem}
				    onPress={() => router.push({ pathname: "/passworddetails", params: { name: entry.name } })}
			    >
				<Text style={styles.suggestionText}>{entry.name}</Text>
			    </TouchableOpacity>
			))}
		    </ScrollView>
		</View>
	    )}

            <View className="flex-row items-center mt-6">
                <Image source={logo} style={styles.image} />
                <View className="flex-1">
                    <Text className="text-btnLight text-[14px] font-bold">Store, generate, and manage your passwords securely with</Text>
                    <Text className="text-textLight text-[30px] font-bold mt-1">Password Encryption</Text>
                </View>
            </View>

            <View className="flex-1 px-10 mt-6">
                <TextInput
                    className="font-bold p-3 px-8 w-100 text-base text-black rounded-full bg-textLight shadow-md"
                    placeholder="Enter password"
                    placeholderTextColor="#598da5"
                    value={password}
                    onChangeText={setPassword}
                />

                <Text className="text-btnLight text-[14px] font-bold text-center my-3">PASSWORD GENERATOR</Text>

                <TextInput
                    className="font-bold p-3 px-6 w-100 text-base text-black rounded-full bg-textLight shadow-md"
                    placeholder="Hash password output"
                    placeholderTextColor="#598da5"
                    value={retypePassword}
		    onChangeText={setRetypePassword}
                />

		<Text className="bg-white text-bgColor font-bold text-sm text-center p-1 mt-6">Passwords unchanged after 60 days are flagged expired. Regulary update your passwords to avoid account lockout. Durations of the passwords can be changed in the settings.</Text>


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

                <TouchableOpacity className="items-center" onPress={() => router.push("/settingspage")}>
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
    suggestionsContainer: {
	position: "absolute",
	top: 80, // Adjust this to position it right below the search bar
	left: 20,
	right: 20,
	backgroundColor: "white",
	borderRadius: 8,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.3,
	shadowRadius: 4,
	elevation: 5,
	maxHeight: 150, // Limit the height to prevent excessive scrolling
	zIndex: 1000, // Ensures it stays above other elements
	padding: 5,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    suggestionText: {
        color: "#000",
        fontWeight: "bold",
    },
});
