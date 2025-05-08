import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Animated,
    Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import zxcvbn from "zxcvbn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function AddPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [reType, setRetype] = useState("");
    const [strength, setStrength] = useState({ score: 0, feedback: {} });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [retypeVisible, setRetypeVisible] = useState(false);

    const successAnim = useRef(new Animated.Value(0)).current;

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        const result = zxcvbn(text);
        setStrength(result);
    };

    const getStrengthLabel = (score: number) => {
        switch (score) {
            case 0:
            case 1:
                return { label: "Weak", color: "red" };
            case 2:
                return { label: "Fair", color: "orange" };
            case 3:
                return { label: "Good", color: "white" };
            case 4:
                return { label: "Strong", color: "green" };
            default:
                return { label: "Unknown", color: "gray" };
        }
    };

    const strengthInfo = getStrengthLabel(strength.score);

    const getExpiryDate = () => {
        const now = new Date();
        now.setDate(now.getDate() + 60);
        return now.toISOString();
    };

    const showSuccessAnimation = () => {
        successAnim.setValue(0);
        Animated.timing(successAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                successAnim.setValue(0);
            }, 1500);
        });
    };

    const storePassword = async () => {
        if (!name.trim()) {
            Toast.show({
                type: "error",
                text1: "Missing Label",
                text2: "Please enter a name or label.",
            });
            return;
        }

        if (!password || !reType) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Both password fields must be filled.",
            });
            return;
        }

        if (password !== reType) {
            Toast.show({
                type: "error",
                text1: "Mismatch",
                text2: "Passwords do not match!",
            });
            return;
        }

        if (strength.score < 2) {
            Toast.show({
                type: "error",
                text1: "Weak Password",
                text2: "Please use a stronger password.",
            });
            return;
        }

        try {
            const existingData = await AsyncStorage.getItem("passwords");
            const passwordEntries = existingData ? JSON.parse(existingData) : [];

            const hashedPassword = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                password
            );

            const isDuplicate = passwordEntries.some(
                (entry: { name: string; hashedPassword: string }) =>
                    entry.name === name &&
                    entry.hashedPassword === hashedPassword
            );

            if (isDuplicate) {
                Toast.show({
                    type: "error",
                    text1: "Duplicate",
                    text2: "Password already exists for this label.",
                });
                return;
            }

            const newEntry = {
                name,
                hashedPassword,
                expiryDate: getExpiryDate(),
            };

            passwordEntries.push(newEntry);
            await AsyncStorage.setItem("passwords", JSON.stringify(passwordEntries));

            Toast.show({
                type: "success",
                text1: "Password saved!",
                text2: "Stored securely with an expiry.",
            });

            showSuccessAnimation();
            setName("");
            setPassword("");
            setRetype("");
            setStrength({ score: 0, feedback: {} });
        } catch (error) {
            console.error("Error saving password:", error);
            Toast.show({
                type: "error",
                text1: "Storage Error",
                text2: "Something went wrong. Try again.",
            });
        }
    };

    return (
        <View className="flex-1 justify-center items-center p-20 bg-bgColor">
            <View className="absolute top-4 right-4">
                <TouchableOpacity className="p-2" onPress={() => router.push("/mainpage")}>
                    <Ionicons name="home" size={30} color="#fbfff5" />
                </TouchableOpacity>
            </View>

            <View className="flex-row items-center mx-4 p-1 ml-2">
                <FontAwesome name="plus" size={40} color="#fbfff5" />
            </View>

            <Text className="text-textLight text-center text-[30px] font-bold font-[Cinzel] mb-9">
                Add Password
            </Text>

            <TextInput
                className="font-bold py-2 px-6 w-60 text-base text-black dark:text-red rounded-full bg-btnLight"
                placeholder="Enter label or name"
                placeholderTextColor="#598da5"
                value={name}
                onChangeText={setName}
            />

	    <View className="flex-row items-center bg-btnLight rounded-full w-60 mt-5 px-3">
		<TextInput
		    className="flex-1 font-bold py-2 px-3 text-base text-black dark:text-red"
		    placeholder="Enter password"
		    placeholderTextColor="#598da5"
		    value={password}
		    onChangeText={handlePasswordChange}
		    secureTextEntry={!passwordVisible}
		/>
		<TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
		    <Ionicons
			name={passwordVisible ? "eye-off" : "eye"}
			     size={22}
			     color="#598da5"
		    />
		</TouchableOpacity>
	    </View>

	    <View className="flex-row items-center bg-btnLight rounded-full w-60 mt-5 px-3">
		<TextInput
		    className="flex-1 font-bold py-2 px-3 text-base text-black dark:text-red"
		    placeholder="Retype password"
		    placeholderTextColor="#598da5"
		    value={reType}
		    onChangeText={setRetype}
		    secureTextEntry={!retypeVisible}
		/>
		<TouchableOpacity onPress={() => setRetypeVisible(!retypeVisible)}>
		    <Ionicons
			name={retypeVisible ? "eye-off" : "eye"}
			     size={22}
			     color="#598da5"
		    />
		</TouchableOpacity>
	    </View>

            {password.length > 0 && (
                <Text className="text-[15px] font-bold mt-4" style={{ color: strengthInfo.color }}>
                    Strength: {strengthInfo.label}
                </Text>
            )}

            <TouchableOpacity
                className="bg-blueish px-6 py-3 rounded-full w-60 mt-6 self-center"
                onPress={storePassword}
            >
                <Text className="text-bgColor text-lg font-bold text-center">Save Password</Text>
            </TouchableOpacity>

            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 100,
                    transform: [{ scale: successAnim }],
                    opacity: successAnim,
                }}
            >
                <Text style={{ fontSize: 24, color: "lightgreen", fontWeight: "bold" }}>✔️ Saved!</Text>
            </Animated.View>

            <Toast position="top" />
        </View>
    );
}
