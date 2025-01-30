import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import auth from '@react-native-firebase/auth';

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      if (!email.trim() || !password.trim()) {
        throw new Error("Please fill in both fields.");
      }

      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password.trim());
      
      // Successfully signed in
      console.log('User signed in:', userCredential.user.uid);
      router.replace("/"); // Adjust this route to your app's home screen
      
    } catch (error :any) {
      let message = "An error occurred during sign in.";
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/invalid-email':
          message = "Invalid email address format.";
          break;
        case 'auth/user-disabled':
          message = "This account has been disabled.";
          break;
        case 'auth/user-not-found':
          message = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          message = "Incorrect password.";
          break;
        case 'auth/too-many-requests':
          message = "Too many failed attempts. Please try again later.";
          break;
      }
      
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign In</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <Button
          title="Sign In"
          onPress={handleSignIn}
          disabled={loading}
        />
      )}

      <Text
        style={styles.link}
        onPress={() => !loading && router.push("/SignUp")}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  link: {
    color: "blue",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  loader: {
    marginVertical: 10,
  }
});

export default SignInScreen;
