import React, { useContext, useEffect } from 'react'
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RecordContext } from '../context/context';
import { FIRESTORE_DB } from '../FirebaseConfig'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useState } from 'react';
import ModalIncidence from '../components/modals/ModalIncidence';
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const ResumeDashboard = () => {

    const navigation = useNavigation()


    const { dataUserDb } = useContext(RecordContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState({});
    const [docs, setdocs] = useState([]);
    const [count, setCount] = useState(0)





    const fechaFormateada = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });


    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(FIRESTORE_DB, 'incidencia-estudiantil'), orderBy('fecha', 'desc')),
            (querySnapshot) => {
                const documents = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setdocs(documents);

                // Reiniciar el contador
                let newCount = 0;
                documents.forEach((item) => {
                    const fechItemFormat = `${item.fecha.toDate().getDate().toString().padStart(2, '0')}/${(item.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}`;
                    if (fechaFormateada === fechItemFormat) {
                        newCount += 1;
                    }
                });

                setCount(newCount);
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


        const fechItemFormat = `${item.fecha.toDate().getDate().toString().padStart(2, '0')}/${(item.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}`



        return (
            <TouchableOpacity
                style={styles.cardIncidence}
                onPress={() => {
                    setModalVisible(true);
                    setItemSelected(item);

                }}
                key={item.id}
            >
                <View style={{ width: '80%' }}>
                    <Text style={styles.titleCardIncidence}>{item.titulo}</Text>
                    <Text style={styles.descripcionCardIncidence}>{truncatedDescription}</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', paddingLeft: 10 }}>
                    {fechaFormateada === fechItemFormat ? (
                        <Text style={{ color: '#D14747', fontWeight: 'bold' }}>{fechItemFormat}</Text>
                    ) : (
                        <Text style={{ color: '#2F5A73', fontWeight: 'bold' }}>{fechItemFormat}</Text>
                    )}
                </View>


            </TouchableOpacity>
        );
    };



    return (
        <View style={styles.container}>
            <View style={styles.subcontainer1}>
                <View>
                    <Text style={{ color: 'white', marginLeft: 10, fontSize: 15, marginTop: 15 }}>Bienvenido {dataUserDb.nombre} {dataUserDb.apellido} </Text>
                </View>

                <View style={styles.cardTotal}>
                    <View style={{ borderRightWidth: 1, borderRightColor: '#62cfb4', width: '50%', marginVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.total}>
                            <Text style={styles.totalNumber}>{docs?.length}</Text>
                            <Text style={styles.descripcionCardIncidence}>Total</Text>
                        </View>
                    </View>
                    <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#D14747', fontWeight: 'bold', fontSize: 25, marginVertical: 10 }}>+ {count}</Text>

                        <Text style={styles.descripcionCardIncidence}>Incidencias</Text>


                    </View>


                </View>
                <View style={{
                    flexDirection: 'row', padding: 10, justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    <TouchableOpacity style={styles.cardOptions} onPress={() => navigation.navigate('Dashboard')}>
                        <Image
                            source={require('../img/dashboard.png')}
                            style={{
                                width: 40, // Ajusta el ancho de la imagen
                                height: 40, // Ajusta la altura de la imagen
                                marginRight: 6,
                            }}
                        />
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.textCardOptions}> Ver</Text>
                            <Text style={styles.textCardOptions}> dashboard</Text>

                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardOptions} onPress={() => navigation.navigate('Maps')}>
                        <Image
                            source={require('../img/maps.png')}
                            style={{
                                width: 45, // Ajusta el ancho de la imagen
                                height: 45, // Ajusta la altura de la imagen
                                marginRight: 10,


                            }}
                        />
                        <Text style={styles.textCardOptions}>ver Mapa</Text>

                    </TouchableOpacity>

                </View>
            </View>
            <View style={styles.subcontainer2}>

                <View style={styles.flatList}>
                    <Text style={{ color: 'white', marginLeft: 15, fontSize: 18, marginBottom: 15, fontWeight: 'bold' }}>Incidencias Recientes</Text>
                    <FlashList
                        data={docs}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        estimatedItemSize={200}
                    />
                </View>
            </View>




            <ModalIncidence modalVisible={modalVisible} setModalVisible={setModalVisible} itemSelected={itemSelected} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F22',
    },
    subcontainer1: {

        height: '50%'
    },
    subcontainer2: {

        height: '50%'
    },
    flatList: {


        height: '100%',
        marginTop: 10,


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
        height: 180,
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
        fontWeight: 'bold',
        fontSize: 12,
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


export default ResumeDashboard