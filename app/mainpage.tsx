import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Feather, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MainPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter(); 

    return (
        <SafeAreaView className="flex-1 bg-bgColor">
            <View className="flex-row items-center mx-4 mt-6">
                <View className="flex-row items-center bg-white rounded-full p-1 flex-1 shadow-md">
                    <TouchableOpacity className="p-2">
                        <Ionicons name="search" size={35} color="#598da5" />
                    </TouchableOpacity>

                    <TextInput
                        className="flex-1 h-10 ml-2 text-black text-lg placeholder:text-[#598da5]"
                        placeholder="Search Passwords"
                        placeholderTextColor="#598da5" 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity className="p-1 ml-2">
                    <Ionicons name="menu" size={35} color="#fbfff5" />
                </TouchableOpacity>
            </View>

            <View className="absolute bottom-0 left-0 right-0 h-[90px] flex-row bg-white justify-around items-center border-t-2 border-[#598da5]">
                <TouchableOpacity className="items-center" onPress={() => router.push("/gallery")}>
                    <Feather name="alert-triangle" size={35} color="#598da5" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Alert</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <MaterialIcons name="add-circle" size={35} color="#598da5" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Add</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center" onPress={() => router.push("/camera")}>
                    <Fontisto name="locked" size={35} color="#598da5" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Vault</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <MaterialIcons name="settings" size={35} color="#598da5" />
                    <Text className="text-[#598da5] text-[15px] mt-1">Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
