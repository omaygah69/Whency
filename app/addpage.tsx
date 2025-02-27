import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import "../global.css";
import zxcvbn from "zxcvbn";

export default function addPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [reType, retypePassword] = useState("");
    const [strength, setStrength] = useState({ score: 0, feedback: {} });

    const handlePasswordChange = (text) => {
	setPassword(text);
	const result = zxcvbn(text);
	setStrength(result);
    };

    const getStrengthLabel = (score) => {
	switch (score) {
	    case 0:
	    case 1:
		return { label: "Weak", color: "red" };
	    case 2:
		return { label: "Fair", color: "orange" };
	    case 3:
		return { label: "Good", color: "yellow" };
	    case 4:
		return { label: "Strong", color: "green" };
	    default:
		return { label: "Unknown", color: "gray" };
	}
    };

    const strengthInfo = getStrengthLabel(strength.score);

    return (
	<View className="flex-1 justify-center items-center p-20 bg-bgColor">
	    
	    <Text className="text-textLight text-center text-[30px] text-bold font-[Cinzel] mb-9">ADD PASSWORD</Text>
	    <TextInput
		className="p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight"
		placeholder="Enter password"
		placeholderTextColor="#598da5"
		value={password}
		onChangeText={handlePasswordChange}
       	    />

            <TextInput
		className="p-3 px-6 w-200 text-base text-black dark:text-red rounded-full bg-btnLight mt-6"
		placeholder="Retype Password"
		placeholderTextColor="#598da5"
		value={reType}
		onChangeText={retypePassword}
	    />

	    <Text style={[styles.strengthText, { color: strengthInfo.color }]}>
		Strength: {strengthInfo.label}
	    </Text>

	    <TouchableOpacity className="bg-btnLight px-6 py-3 rounded-full w-60 mt-6 self-center">
		<Text className="text-bgColor text-lg font-bold text-center">Send to Server</Text>
	    </TouchableOpacity>
	    
	    <TouchableOpacity className="bg-btnLight p-1 rounded-full w-60 mt-6 self-center items-center"
			      onPress={() => router.push("/mainpage")}>
		<Feather name="arrow-left" size={40} color="#598da5" />
	    </TouchableOpacity>

 	    {strength.feedback?.suggestions?.length > 0 && (
		<View style={styles.feedbackContainer}>
		    <Text className="text-bold">Suggestions:</Text>
		    {strength.feedback.suggestions.map((suggestion, index) => (
			<Text key={index} style={styles.feedbackText}>- {suggestion}</Text>
		    ))}
		</View>
	    )}
	</View>
    );
}

const styles = StyleSheet.create({
    strengthText: {
	marginTop: 10,
	fontSize: 14,
	fontWeight: "bold",
    },
    feedbackContainer: {
	marginTop: 10,
	backgroundColor: "#fff",
	padding: 10,
	borderRadius: 5,
	width: "100%",
    },
    feedbackText: {
	fontSize: 14,
	color: "#555",
    },
});
