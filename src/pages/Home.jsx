import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import { addDoc, collection, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { FlashList } from '@shopify/flash-list';
import CardIncidence from '../components/CardIncidence';
import ModalIncidence from '../components/modals/ModalIncidence';
import ResumeDashboard from '../components/ResumeDashboard'
const Home = () => {
    const { loading, setLoading, dataUserDb, getDataUser, userId, reload } = useContext(RecordContext);
    const [docs, setdocs] = useState([]);
    const [count, setCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState({});

    const fechaFormateada = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });

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
    }, [reload,]);

    useEffect(() => {
        console.log(userId, 'userid')
        setdocs('')
        if (userId) {
            const q = query(
                collection(FIRESTORE_DB, 'incidencias'),
                where('idEstudiante', '==', userId),
                orderBy('fecha', 'desc')
            );

            const unsubscribe = onSnapshot(
                q,
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
        }
    }, [userId, reload]);

    const renderItem = ({ item }) => {
        // Limitar la longitud máxima de la descripción
        const maxLength = 45; // Puedes ajustar este valor según tus necesidades
        // Obtener una versión truncada de la descripción
        const truncatedDescription = item.descripcion && item.descripcion.length > maxLength
            ? item.descripcion.substring(0, maxLength - 3) + '...'
            : item.descripcion;

        const fechItemFormat = `${item.fecha.toDate().getDate().toString().padStart(2, '0')}/${(item.fecha.toDate().getMonth() + 1).toString().padStart(2, '0')}`;

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
            {loading ? (
                <ActivityIndicator size='large' color='#0000dff' />
            ) : dataUserDb.rol === 'directorgeneral' || dataUserDb.rol === 'directorescuela' || dataUserDb.rol === 'directorcomunidad' ? (
                <>
                    {/* Agrega aquí el componente ResumeDashboard */}
                    <ResumeDashboard />
                </>
            ) : (
                <>
                    <Text style={styles.title}>
                        {dataUserDb.nombre ? `Hola ${dataUserDb.nombre}, bienvenido` : <ActivityIndicator size='large' color='#0000dff' />}

                    </Text>

                    <ModalIncidence modalVisible={modalVisible} setModalVisible={setModalVisible} itemSelected={itemSelected} />
                    {docs.length > 0 ?
                        <View style={styles.flatList}>
                            <Text style={{ color: 'white', marginLeft: 15, fontSize: 18, marginBottom: 15, fontWeight: 'bold' }}>Tus incidencias</Text>
                            <FlashList
                                data={docs}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                estimatedItemSize={200}
                            />
                        </View>
                        : ''}
                </>
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
        marginTop: 200
    },
    cardIncidence: {
        margin: 5,
        padding: 20,
        backgroundColor: '#272b34',
        borderRadius: 10,
        marginHorizontal: 20,
        height: '90%',
        flexDirection: 'row',

    },
    titleCardIncidence: {
        // Estilos para el título de la incidencia
    },
    descripcionCardIncidence: {
        // Estilos para la descripción de la incidencia
    },
    flatList: {


        height: '68%',
        width: '100%',
        marginTop: 10,
        marginBottom: 40,



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
});

export default Home;
