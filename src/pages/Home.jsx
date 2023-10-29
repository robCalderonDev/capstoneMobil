
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Details from './Details';
import { useContext } from 'react';
import { RecordContext } from '../context/context';



const Home = () => {
    const navigation = useNavigation(); // Obtiene el objeto navigation
    const { regiones, choosedItem, loanding, setLoading, setDataUserDb, dataUserDb } = useContext(RecordContext);
    useEffect(() => {
        console.log(dataUserDb)

    }, [])
    return (
        <View style={styles.container}>
            <Text>Hola este es el main</Text>
            <Button title="Boton main Details" onPress={() => navigation.navigate('details')} />
            <Button title="BOTON MAIN LOGOUT" onPress={() => FIREBASE_AUTH.signOut()} />
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home;
