import { Text, View } from "react-native";
import UserProfileCheck from '../components/UserProfileCheck';
import IsUserSigned from '../components/IsUserSigned' 

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IsUserSigned />
      <UserProfileCheck />
      
      <Text>Edit home/index.tsx to edit this screen.</Text>
    </View>
  );
}

