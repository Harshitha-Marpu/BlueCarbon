import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Waves, Lock, Mail } from 'lucide-react-native';
import { api } from '@/utils/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('demo@bluecarbon.org');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login({ email, password });
      
      await AsyncStorage.setItem('authToken', response.token);
      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Waves size={80} color="#ffffff" />
        <Text style={styles.title}>Blue Carbon Registry</Text>
        <Text style={styles.subtitle}>Coastal Ecosystem Carbon Credits</Text>
      </View>

      <View style={styles.loginCard}>
        <Text style={styles.cardTitle}>Welcome Back</Text>
        <Text style={styles.cardSubtitle}>Sign in to manage carbon credits</Text>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.demoInfo}>
          <Text style={styles.demoLabel}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Email: demo@bluecarbon.org</Text>
          <Text style={styles.demoText}>Password: demo123</Text>
          <Text style={styles.demoNote}>
            Note: Backend at localhost:8000 (start with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000)
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Powered by Celo Blockchain • SIH 2025
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f766e',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccfbf1',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 40,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#134e4a',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#134e4a',
  },
  loginButton: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  demoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d9488',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#134e4a',
    marginBottom: 2,
  },
  demoNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    textAlign: 'center',
    color: '#ccfbf1',
    fontSize: 12,
    paddingVertical: 20,
  },
});