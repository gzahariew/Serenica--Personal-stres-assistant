// /app/sign-up/index.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
      setLoading(false);
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      router.push('./home'); // Navigate to home screen after successful sign-up
    } catch (error : any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
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
      <Button title={loading ? 'Signing up...' : 'Sign Up'} onPress={handleSignUp} disabled={loading} />
      <Text
        style={styles.link}
        onPress={() => router.push('./sign-in')} // Navigate to Sign In screen
      >
        Already have an account? Sign In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
