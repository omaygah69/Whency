import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import logo from "../assets/images/_logo.png";

export default function MainPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter(); 
    const [password, setPassword] = useState("");
    const [reType, retypePassword] = useState("");

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

	    <View className="flex-row items-center mt-10">
	        <Image source={logo} style={styles.image} />
		<View className="flex-1">
		    <Text className="text-btnLight text-[14px] font-bold">Store, generate, and manage your passwords securely with</Text>
		    <Text className="text-textLight text-[30px] font-bold mt-1">Password Encryption</Text>
		</View>
	    </View>

	    <View className="flex-1 px-20 mt-10">
		<TextInput
		    className="font-bold p-3 px-8 w-100 text-base text-black dark:text-red rounded-full bg-textLight"
		    placeholder="Enter password"
		    placeholderTextColor="#598da5"
		    value={password}
       		/>

		<Text className="text-btnLight text-[14px] font-bold text-center my-3">PASSWORD GENERATOR</Text>

		<TextInput
		    className="font-bold p-3 px-8 w-100 text-base text-black dark:text-red rounded-full bg-textLight"
		    placeholder="Hash password output"
		    placeholderTextColor="#598da5"
		    value={password}
       		/>

	    </View>
	    
            <View className="absolute bottom-0 left-0 right-0 h-[90px] flex-row bg-darkinBlue justify-around items-center border-t-2 border-[#598da5]">
                <TouchableOpacity className="items-center" onPress={() => router.push("/gallery")}>
                    <Feather name="alert-triangle" size={40} color="#e8c6bc" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => router.push("/addpage") }>
                    <MaterialIcons name="add-circle" size={40} color="#e8c6bc" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Add</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => router.push("/camera")}>
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
    }
});
