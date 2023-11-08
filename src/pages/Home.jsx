import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import Maps from '../components/Maps';

const Home = () => {

    const { loading, setLoading, dataUserDb, getDataUser } = useContext(RecordContext);


    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                await getDataUser();
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size='large' color='#0000dff' />
            ) : dataUserDb.rol === 'admin' ? (
                <Maps />
            ) : (
                <Text style={styles.title}>
                    {dataUserDb.nombre ? `Hola eres ${dataUserDb.nombre}, bienvenido` : <ActivityIndicator size='large' color='#0000dff' />}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F22',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        color: 'white',
    }
});

export default Home;
