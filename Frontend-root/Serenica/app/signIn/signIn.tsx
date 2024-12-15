import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      setLoading(false);
      return;
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button
        title={loading ? "Signing in..." : "Sign In"}
        onPress={handleSignIn}
        disabled={loading}
      />
      <Text
        style={styles.link}
        onPress={() => router.push("./sign-up")} // Navigate to Sign Up screen
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
    paddingLeft: 8,
    borderRadius: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  link: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default SignInScreen;
