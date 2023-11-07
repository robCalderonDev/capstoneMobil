
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
    const { regiones, choosedItem, loanding, setLoading, dataUserDb, setDataUserDb, getDataUser } = useContext(RecordContext);
    const signOut = () => {


        FIREBASE_AUTH.signOut()
        setDataUserDb({})

    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(dataUserDb, 'colegio');
                await getDataUser();
                console.log(dataUserDb, 'este es home');
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        fetchData();

    }, [])
    return (
        <View style={styles.container}>
            {dataUserDb.rol === 'admin' ? <Text>Hola eres admin</Text> : <Text>Hola eres estudiante</Text>}
            <Text>Hola este tu correo {dataUserDb.email} </Text>


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
