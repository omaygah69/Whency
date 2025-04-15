import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
    return (
        <>
            <StatusBar barStyle="light-content" />
            
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="mainpage" options={{ headerShown: false }} />
                <Stack.Screen name="addpage" options={{ headerShown: false }} />
                <Stack.Screen name="vault" options={{ headerShown: false }} />
                <Stack.Screen name="alertpage" options={{ headerShown: false }} />
                <Stack.Screen name="passworddetails" options={{ headerShown: false }} />
            </Stack>

            <Toast />
        </>
    );
}
