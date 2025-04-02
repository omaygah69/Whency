import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return(
	<Stack>
	    <Stack.Screen name="index" options={{headerShown: false}} />
	    <Stack.Screen name="mainpage" options={{headerShown: false}} />
	    <Stack.Screen name="addpage" options={{headerShown: false}} />
	    <Stack.Screen name="vault" options={{headerShown: false}} />
	    <Stack.Screen name="alertpage" options={{headerShown: false}} />
	    <Stack.Screen name="passworddetails" options={{headerShown: false}} />
	</Stack>
    );
}
