import { Text, View, TouchableOpacity, StatusBar } from "react-native";
import { Link, useRouter } from "expo-router";
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function getStarted(){
    const router = useRouter();
    return(
	<SafeAreaView className="flex-1 bg-bgColor items-center justify-center">
	    <Text className="text-textLight text-center text-[50px] text-bold font-[Cinzel]">Welcome!</Text>
	    <Text className="text-textLight text-center text-[15px] px-20">
		Protecting your digital life, one password at a time.
	    </Text>

	    <TouchableOpacity className="bg-btnLight px-6 py-3 mt-20 rounded-full w-60 self-center"
			      onPress={() => router.push("/mainpage")}>
		<Text className="text-bgColor text-lg font-bold text-center">Get Started</Text>
	    </TouchableOpacity>

	    <StatusBar backgroundColor="#011121" />
	</SafeAreaView>
    )
}
