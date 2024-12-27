import { Text, View } from "react-native";
import UserProfileCheck from '../../components/UserProfileCheck'; 

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <UserProfileCheck />
      
      <Text>Edit home/index.tsx to edit this screen.</Text>
    </View>
  );
}

