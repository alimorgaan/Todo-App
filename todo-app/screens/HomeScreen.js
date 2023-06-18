import { Image, Keyboard, ScrollView, StyleSheet, TouchableOpacity, Text, TextInput, View, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';

import { REACT_APP_API_IP } from '@env';

const HomeScreen = () => {

    const { token, setToken } = React.useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const navigator = useNavigation();

    const getTodos = async () => {
        console.log(token);
        try {
            const response = await fetch(`http://${REACT_APP_API_IP}:3000/todo`, {
                method: 'GET',
                headers: {
                    authorization: token
                }
            });
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            const todos = await response.json();
            setTodos(todos);
        } catch (error) {
            console.log(error);
        }
    }

    const addTodoHandler = async () => {
        Keyboard.dismiss();
        setNewTodo('');
        try {

            const response = await fetch(`http://${REACT_APP_API_IP}:3000/todo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                },
                body: JSON.stringify({ title: newTodo })
            });
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            getTodos();
        } catch (error) {

            console.log(error);
        }
    }


    const deleteTodoHandler = async (id, index) => {
        let newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
        try {

            const response = await fetch(`http://${REACT_APP_API_IP}:3000/todo/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: token
                }
            });
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            getTodos();
        } catch (error) {

            console.log(error);
        }
    }

    const doneTodoHandler = async (id, index) => {
        let newTodos = [...todos];
        newTodos[index].completed = true;
        setTodos(newTodos);
        try {

            const response = await fetch(`http://${REACT_APP_API_IP}:3000/todo/completed/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token
                },

            });
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            getTodos();
        } catch (error) {

            console.log(error);
        }

    }

    const logoutHandler = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
    }


    useEffect(() => {
        getTodos();
    }, []);

    return (
        <>
            <KeyboardAvoidingView style={styles.inputContainer}>
                <TextInput value={newTodo} onChangeText={(text) => { setNewTodo(text) }} style={styles.input} placeholder="Enter Todo" />
                <TouchableOpacity style={styles.button} onPress={addTodoHandler}>
                    <Text style={styles.buttonText}>Add Todo</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <ScrollView style={styles.container}>
                {
                    todos.map((todo, index) =>
                        <View key={todo.id} style={styles.todoContainer}>
                            <View style={styles.todo}>
                                {
                                    todo.completed ?
                                        <Text style={styles.doneTodoText}>{todo.title}</Text> :
                                        <Text style={styles.todoText}>{todo.title}</Text>
                                }
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => { deleteTodoHandler(todo.id, index) }}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.doneButton} onPress={() => { doneTodoHandler(todo.id, index) }}>
                                        <Text style={styles.doneText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }
            </ScrollView>
            <TouchableOpacity
                onPress={logoutHandler}
                activeOpacity={0.7}
                style={styles.touchableOpacityStyle}>
                <Image
                    source={require('../assets/logout.png')}
                    style={styles.floatingButtonStyle}
                />
            </TouchableOpacity>
        </>

    )
}

export default HomeScreen

const styles = StyleSheet.create({
    todoContainer: {
        marginVertical: 8,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        elevation: 3
    },

    todo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    todoText: {
        fontSize: 20,
    },

    doneTodoText: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        fontSize: 18,
    },

    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10
    },

    input: {
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        padding: 5,
        marginHorizontal: 5,
        borderRadius: 10
    },

    button: {
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        backgroundColor: '#eaeaea',
        padding: 10,
        borderRadius: 10
    },

    deleteButton: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 10
    },

    deleteText: {
        color: 'white'
    },

    doneButton: {
        backgroundColor: '#00ff00',
        padding: 10,
        borderRadius: 10,
        marginLeft: 5
    },

    doneText: {
        color: 'black'
    },

    touchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
    },


})