import { TouchableOpacity, KeyboardAvoidingView, TextInput, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { Keyboard } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import { REACT_APP_API_IP } from '@env';
const SignupScreen = () => {

    const { token, setToken } = React.useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const navigator = useNavigation();


    const signupHandler = async ({ setToken }) => {
        Keyboard.dismiss();


        if (username === '' || password === '') {
            setError('Please fill all the fields');

            return;
        }

        try {
            const response = await fetch(`http://${REACT_APP_API_IP}:3000/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.msg);

                return;
            }
            setError('');

            const data = await response.json();
            if (data.token) {
                await AsyncStorage.setItem('token', data.token);
                setToken(data.token);
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.heading}>Signup</Text>

            <View style={styles.inputContainer}>
                <TextInput value={username} onChangeText={(text) => { setUsername(text) }} style={styles.input} placeholder="username" />
                <TextInput value={password} onChangeText={(text) => { setPassword(text) }} style={styles.input} secureTextEntry placeholder="Password" />
            </View>

            <View>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={signupHandler}>
                    <Text>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signup} onPress={() => { navigator.navigate('Login') }}>
                    <Text>Go to Login</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        margin: 10
    },
    buttonContainer: {
        width: '80%',

    },
    button: {
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 10,
        margin: 10
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20
    },

    signup: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        padding: 10,
        margin: 10
    }


})