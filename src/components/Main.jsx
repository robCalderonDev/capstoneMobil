import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { FIREBASE_AUTH } from '../FirebaseConfig';

const Main = () => {
    const navigation = useNavigation(); // Obtiene el objeto navigation
    return (
        <View style={styles.container}>

            <Text >Hola este es el main</Text>
            <Button title='Boton main Details' onPress={() => navigation.navigate('details')} />

            <Button title='BOTON MAIN LOGOUT' onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',

    },
});

export default Main