
import { SignIn } from "@clerk/clerk-expo";
import { Text, View } from 'react-native';

export default function SignInScreen() {
  console.log('Clerk SignIn component:', SignIn);
  if (!SignIn) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: Clerk SignIn component is undefined.</Text>
      </View>
    );
  }
  return <SignIn />;
}
