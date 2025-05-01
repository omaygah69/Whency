import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Animated,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Ionicons,
    MaterialIcons,
    Feather,
    Fontisto,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/images/_logo.png";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

const generatePassword = (length = 16) => {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};

export default function MainPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [passwordEntries, setPasswordEntries] = useState<any[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Security tips for the user
    const securityTips = [
        "Use unique passwords for every account.",
        "Enable 2FA wherever possible.",
        "Never reuse old passwords.",
        "Avoid using real words in your passwords.",
    ];

    const [tip, setTip] = useState("");

    useEffect(() => {
        setTip(securityTips[Math.floor(Math.random() * securityTips.length)]);
    }, []);

    useEffect(() => {
        loadPasswords();
    }, []);

    useEffect(() => {
        filterSuggestions();
    }, [searchQuery]);

    useEffect(() => {
        if (password.trim() !== "") {
            const newPassword = generatePassword(16);
            setRetypePassword(newPassword);
        } else {
            setRetypePassword("");
        }
    }, [password]);

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

    const handleCopy = async () => {
        await Clipboard.setStringAsync(retypePassword);
        Toast.show({ type: "success", text1: "Password copied!" });

        fadeAnim.setValue(1);
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    };

    // Password strength checker
    const getStrength = (pwd) => {
        if (pwd.length > 12 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) return "Strong";
        if (pwd.length > 8) return "Medium";
        return "Weak";
    };

    return (
        <SafeAreaView className="flex-1 bg-bgColor">
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                setIsSearching(false);
            }}>
                <View className="flex-1">
                    {isSearching && (
                        <View style={styles.overlay} pointerEvents="none" />
                    )}

                    <View className="flex-row items-center mx-6 mt-8 z-10">
                        <View className="flex-row items-center bg-white rounded-full flex-1 shadow-md">
                            <TextInput
                                className="px-6 py-2 font-bold flex-1 h-10 w-60 ml-2 text-black text-lg placeholder:text-[#598da5]"
                                placeholder="Search Passwords"
                                placeholderTextColor="#598da5"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={() => setIsSearching(true)}
                            />
                        </View>

                        <TouchableOpacity className="p-1 ml-2">
                            <Ionicons name="search" size={25} color="#fbfff5" />
                        </TouchableOpacity>
                    </View>

                    {searchQuery.trim() !== "" && (
                        <View style={styles.suggestionsContainer}>
                            <ScrollView keyboardShouldPersistTaps="handled">
                                {filteredSuggestions.length > 0 ? (
                                    filteredSuggestions.map((entry, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.suggestionItem}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/passworddetails",
                                                    params: { name: entry.name },
                                                })
                                            }
                                        >
                                            <Ionicons
                                                name="key-outline"
                                                size={20}
                                                color="#598da5"
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text style={styles.suggestionText}>
                                                {entry.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.noResult}>
                                        <Feather name="search" size={20} color="#888" />
                                        <Text style={styles.noResultText}>
                                            No matches found
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    )}

                    <View className="flex-row items-center mt-20 px-4">
                        <Image source={logo} style={styles.image} />
                        <View className="flex-1">
                            <Text className="text-btnLight text-[14px] font-bold pr-3">
                                Store, generate, and manage your passwords securely with
                            </Text>
                            <Text className="text-textLight text-[25px] font-bold mt-1">
                                Password Encryption
                            </Text>
                        </View>
                    </View>

                    <View className="flex-1 px-12 mt-9">
                        <TextInput
                            className="font-bold py-2 px-6 w-90 text-base text-black rounded-full bg-textLight shadow-md"
                            placeholder="Enter password"
                            placeholderTextColor="#598da5"
                            value={password}
                            onChangeText={setPassword}
                        />

                        {/* Password Strength */}
                        {password.length > 0 && (
                            <Text className="text-right mt-1 text-sm text-[#598da5] font-bold">
                                Strength: {getStrength(password)}
                            </Text>
                        )}

                        <Text className="text-btnLight text-[12px] font-bold text-center my-3">
                            PASSWORD GENERATOR
                        </Text>

                        <View className="flex-row items-center bg-textLight rounded-full shadow-md px-4 mt-2">
                            <TextInput
                                style={{ flex: 1 }}
                                className="font-bold py-2 px-6 w-90 text-base text-black rounded-full bg-textLight shadow-md"
                                placeholder="Generated password"
                                placeholderTextColor="#598da5"
                                value={retypePassword}
                                editable={false}
                            />
                            <TouchableOpacity onPress={handleCopy}>
                                <Feather name="copy" size={20} color="#598da5" />
                            </TouchableOpacity>
                        </View>

                        <Animated.Text
                            style={{
                                opacity: fadeAnim,
                                textAlign: "center",
                                color: "#598da5",
                                fontWeight: "bold",
                                marginTop: 10,
                            }}
                        >
                            Copied to clipboard!
                        </Animated.Text>

			{/* Security Tip */}
			<View className="bg-[#2e3a59] rounded-lg mb-4">
                            <Text className="text-white text-center text-sm font-semibold px-12 py-2 ">🔐 {tip}</Text>
			</View>
			
                        {/* Recent Passwords */}
                        {passwordEntries.length > 0 && (
                            <View className="mt-8">
                                <Text className="text-btnLight font-bold text-sm mb-2">Recent Passwords</Text>
                                {passwordEntries.slice(-3).reverse().map((entry, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => router.push({
                                            pathname: "/passworddetails",
                                            params: { name: entry.name },
                                        })}
                                    >
                                        <Text className="text-white font-semibold mb-1">• {entry.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="absolute bottom-0 left-0 right-0 h-[75px] flex-row bg-darkinBlue justify-around items-center border-t-2 border-[#598da5]">
                        <TouchableOpacity
                            className="items-center"
                            onPress={() => router.push("/alertpage")}
                        >
                            <Feather name="alert-triangle" size={25} color="#e8c6bc" />
                            <Text className="text-[#598da5] text-[15px] mt-1">
                                Alert
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center"
                            onPress={() => router.push("/addpage")}
                        >
                            <MaterialIcons name="add-circle" size={25} color="#e8c6bc" />
                            <Text className="text-[#598da5] text-[15px] mt-1">Add</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center"
                            onPress={() => router.push("/vault")}
                        >
                            <Fontisto name="locked" size={25} color="#e8c6bc" />
                            <Text className="text-[#598da5] text-[15px] mt-1">Vault</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="items-center"
                            onPress={() => router.push("/settingspage")}
                        >
                            <MaterialIcons name="settings" size={25} color="#e8c6bc" />
                            <Text className="text-[#598da5] text-[15px] mt-1">Settings</Text>
                        </TouchableOpacity>
                    </View>

                    <Toast />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 125,
        height: 125,
        justifyContent: "center",
    },
    suggestionsContainer: {
        position: "absolute",
        top: 75,
        left: 20,
        right: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 1000,
        maxHeight: 180,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    suggestionText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "600",
    },
    noResult: {
        alignItems: "center",
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "center",
    },
    noResultText: {
        fontSize: 14,
        marginLeft: 6,
        color: "#999",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 5,
    },
});
