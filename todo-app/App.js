import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './screens/LoadingScreen';
import { AuthContext } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      setToken(token);
      setLoading(false);
    }
    getToken();
  }, []);


  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <NavigationContainer>
        <Stack.Navigator>
          {
            loading ? <Stack.Screen name="Loading" options={{ headerShown: false }} component={LoadingScreen} />
              : token ? <Stack.Screen name="Home" options={{ headerBackVisible: true }} component={HomeScreen} /> :
                <>
                  <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                  <Stack.Screen name="Signup" options={{ headerShown: false }} component={SignupScreen} />
                </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
