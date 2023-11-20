import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import Maps from '../components/Maps';
import ResumeDashboard from '../components/ResumeDashboard';
import colegios from '../data/colegios.json';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
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

    // const subirColegios = async () => {
    //     colegios.forEach((colegios, index) => {
    //         if (index <= 100) { // manually change this condition to bypass limitations
    //             addDoc(collection(FIRESTORE_DB, "colegios"), {
    //                 'RBD': colegios['RBD'],
    //                 'NOMBRE ESTABLECIMIENTO': colegios['NOMBRE ESTABLECIMIENTO'],
    //                 'RUT SOSTENEDOR': colegios['RUT SOSTENEDOR'],
    //                 'NOMBRE SOSTENEDOR': colegios['NOMBRE SOSTENEDOR'],
    //                 'REGIÓN': colegios['REGIÓN'],
    //                 'COMUNA': colegios['COMUNA'],
    //                 'DIRECCION EES': colegios['DIRECCION EES'],
    //                 'LATITUD': colegios['LATITUD'],
    //                 'LONGITUD': colegios['LONGITUD'],
    //                 'ZONA': colegios['ZONA'],
    //                 'MATRICULA TOTAL': colegios['MATRICULA TOTAL'],
    //             })
    //                 .then(function (docRef) {
    //                     console.log("Document written with ID: ", docRef.id);
    //                 })
    //                 .catch(function (error) {
    //                     console.error("Error adding document: ", error);
    //                 });
    //         }
    //     });
    // };


    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size='large' color='#0000dff' />
            ) : dataUserDb.rol === 'admin' ? (
                <>
                    <ResumeDashboard />

                </>

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
