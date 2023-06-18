import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { REACT_APP_API_IP } from '@env';
const LoadingScreen = () => {
    return (
        <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})