import React, { useContext, useEffect } from 'react'
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RecordContext } from '../context/context';
import { FIRESTORE_DB } from '../FirebaseConfig'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useState } from 'react';
import ModalIncidence from '../components/modals/ModalIncidence';
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from '@expo/vector-icons';
const DashBoard = () => {
    const { docs, setdocs, dataUserDb } = useContext(RecordContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState({});
    useEffect(() => {
        // Almacenar la función de limpieza para desregistrar el observador
        const unsubscribe = onSnapshot(
            query(collection(FIRESTORE_DB, 'incidencia-estudiantil'), orderBy('fecha', 'desc')),
            (querySnapshot) => {
                const documents = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setdocs(documents);
                console.log(dataUserDb, 'aqui');
            }
        );

        // Devolver la función de limpieza para desregistrar el observador cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => {
        // Limitar la longitud máxima de la descripción
        const maxLength = 45; // Puedes ajustar este valor según tus necesidades
        // Obtener una versión truncada de la descripción
        const truncatedDescription = item.descripcion && item.descripcion.length > maxLength
            ? item.descripcion.substring(0, maxLength - 3) + '...'
            : item.descripcion;

        return (
            <TouchableOpacity
                style={styles.cardIncidence}
                onPress={() => {
                    setModalVisible(true);
                    setItemSelected(item);
                }}
                key={item.id}
            >
                <View style={{}}>
                    <Text style={styles.titleCardIncidence}>{item.titulo}</Text>
                    <Text style={styles.descripcionCardIncidence}>{truncatedDescription}</Text>

                </View>
                <View>
                    <Text style={styles.descripcionCardIncidence}>18/12</Text>
                </View>


            </TouchableOpacity>
        );
    };



    return (
        <View style={styles.container}>
            <View>
                <Text style={{ color: 'white', marginLeft: 10, fontSize: 15, marginTop: 15 }}>Bienvenido {dataUserDb.nombre} {dataUserDb.apellido} </Text>
            </View>

            <View style={styles.cardTotal}>



            </View>



        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F22',
    },
    flatList: {

        height: '45%',

    },
    cardIncidence: {
        margin: 5,
        padding: 10,
        backgroundColor: '#272b34',
        borderRadius: 10,
        marginHorizontal: 20,
        height: '90%',
        flexDirection: 'row',
    },
    cardTotal: {
        margin: 10,
        padding: 10,
        backgroundColor: '#272b34',
        height: 200,
        borderRadius: 10,
        flexDirection: 'row',
        marginHorizontal: 20,

    },
    cardOptions: {
        width: '40%',
        height: 80,
        backgroundColor: '#272b34',
        borderRadius: 10,
        marginHorizontal: 25,
        flexDirection: 'row', // Configura la dirección del contenedor como "row"
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCardOptions: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,

    },
    totalNumber: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    titleCardIncidence: {
        color: 'white',
        fontWeight: 'bold',
    },
    descripcionCardIncidence: {
        color: 'white',
    },
    total: {


        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 120,
        borderRadius: 80,
        borderWidth: 2, // Ancho del borde
        borderColor: '#3498db', // Color del borde
    }
})


export default DashBoard