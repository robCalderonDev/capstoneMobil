import React, { useContext, useEffect } from 'react'
import { ActivityIndicator, Button, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RecordContext } from '../context/context';
import { FIRESTORE_DB } from '../FirebaseConfig'
import { collection, getCountFromServer, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useState } from 'react';
import ModalIncidence from '../components/modals/ModalIncidence';
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import BarGraph from '../components/charts/BarGraph';
import LineGraph from '../components/charts/LineGraph';
import PieGraph from '../components/charts/PieGraph';
const DashBoard = () => {
    const { dataUserDb } = useContext(RecordContext);
    const [docs, setdocs] = useState([]);
    const [countByCourse, setCountByCourse] = useState({})
    const [chartData, setChartData] = useState(null);
    const [chartDataDate, setChartDataDate] = useState()
    const [chartDataPie, setChartDataPie] = useState(null)
    const [countByMonth, setCountByMonth] = useState()
    const [countByComuna, setCountByComuna] = useState()
    useEffect(() => {
        // Almacenar la función de limpieza para desregistrar el observador
        const unsubscribe = onSnapshot(
            query(collection(FIRESTORE_DB, 'incidencias'), orderBy('fecha', 'desc')),
            (querySnapshot) => {
                const documents = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setdocs(documents);

            }
        );
        return () => unsubscribe();



    }, []);

    const q = dataUserDb.rol === 'directorescuela' ? query(collection(FIRESTORE_DB, 'incidencias'),
        where('ubicacion', '==', dataUserDb.ubicacion),
    ) : dataUserDb.rol === 'directorcomunidad' ? query(collection(FIRESTORE_DB, 'incidencias'), where('incidenceType', '==', 'Comunitaria')) :
        query(collection(FIRESTORE_DB, 'incidencias'), where('incidenceType', '==', 'Academica'))

    const getDocumentCountByCourse = async () => {
        try {
            onSnapshot(
                q,
                (querySnapshot) => {
                    const countByCourseData = {}; // Objeto para almacenar el recuento por curso

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const curso = data.curso;

                        // Incrementar el contador para el curso correspondiente
                        countByCourseData[curso] = (countByCourseData[curso] || 0) + 1;
                    });
                    // Actualizar el estado con el recuento por curso
                    setCountByCourse(countByCourseData);
                    const labels = Object.keys(countByCourseData);
                    const data = labels.map((label) => countByCourseData[label]);

                    // Actualizar el estado con el recuento por curso y los nuevos labels
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                            },
                        ],
                    });
                    return countByCourseData;
                    // Hacer algo con countByCourseData, por ejemplo, imprimirlo

                },
                (error) => {
                    console.error('Error getting documents: ', error);
                }
            );


        } catch (error) {
            console.error('Error al obtener datos:', error);
            throw error;
        }
    };
    const getDocumentCountByMonth = async () => {
        try {
            const querySnapshot = await getDocs(q);
            const countByMonth = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const incidenceDate = data.fecha.toDate(); // Assuming incidenceDate is a Date object

                // Get month information
                const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(incidenceDate);

                // Increment the counter for the corresponding month
                countByMonth[monthName] = (countByMonth[monthName] || 0) + 1;
            });

            // Create a sorted array of month names
            const sortedMonths = Object.keys(countByMonth).sort((a, b) => {
                const monthOrder = {
                    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
                    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
                };

                return monthOrder[a.toLowerCase()] - monthOrder[b.toLowerCase()];
            });

            // Update the state with the count by month
            setCountByMonth(countByMonth);
            const labels = sortedMonths;
            const data = labels.map((label) => countByMonth[label]);

            // Actualizar el estado con el recuento por mes y los nuevos labels
            setChartDataDate({
                labels: labels,
                datasets: [
                    {
                        data: data,
                    },
                ],
            });

            // Do something with countByMonth, e.g., log it
            console.log('Count by Month:', countByMonth);

            // You can return countByMonth if needed for further processing
            return countByMonth;
        } catch (error) {
            console.error('Error getting data:', error);
            throw error;
        }
    };


    const getDocumentCountByComuna = async () => {
        try {
            const querySnapshot = await getDocs(q);
            const countByComuna = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const comuna = data.comuna; // Assuming "comuna" is the field in your data

                // Increment the counter for the corresponding comuna
                countByComuna[comuna] = (countByComuna[comuna] || 0) + 1;
            });

            // Update the state with the count by comuna
            setCountByComuna(countByComuna);

            // Do something with countByComuna, e.g., log it
            console.log('Count by Comuna:', countByComuna);

            // You can return countByComuna if needed for further processing
            return countByComuna;
        } catch (error) {
            console.error('Error getting data:', error);
            throw error;
        }
    };

    const getDocumetnsByCategory = async () => {
        onSnapshot(
            q,
            (querySnapshot) => {
                const countByCategory = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const categoriaIncidencia = data.categoriaIncidencia;

                    // Incrementar el contador para la categoría correspondiente
                    countByCategory[categoriaIncidencia] = (countByCategory[categoriaIncidencia] || 0) + 1;
                });

                const predefinedColors = ["#264653", "#2a9d8f", "#f4a261", "#ff3366", "#e9c46a"];

                // Convertir el objeto countByCategory a un array con el formato requerido
                const countArray = Object.entries(countByCategory).map((labels, index) => {
                    const color = predefinedColors[index % predefinedColors.length];
                    return {
                        name: labels[0],
                        population: labels[1],
                        color: color,
                        legendFontColor: "#7F7F7F",
                        legendFontSize: 15
                    };
                });

                setChartDataPie(countArray);


                // Si necesitas devolver el array countArray, puedes hacerlo
                return countArray;
            }
        );
    }



    useEffect(() => {
        getDocumentCountByCourse();
        getDocumetnsByCategory()
        getDocumentCountByMonth()
        getDocumentCountByComuna()
    }, []);
    // Imprimir el recuento por curso
    const renderItem = ({ item }) => {
        console.log(item, 'item');

        return (
            <TouchableOpacity
                style={styles.cardIncidence}
                key={item.comuna}  // Usa el identificador único (comuna) como clave
            >
                <View style={{ width: '80%' }}>
                    <Text style={styles.titleCardIncidence}>{item.comuna}</Text>
                    <Text style={styles.descripcionCardIncidence}>{item.count}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* <View>
                <Text style={{ color: 'white', marginLeft: 10, fontSize: 15, marginTop: 15 }}>Bienvenido {dataUserDb.nombre} {dataUserDb.apellido} </Text>
            </View> */}
            {/* <View style={styles.cardTotal}>

            </View> */}
            <View style={styles.charts}>
                {dataUserDb.rol === 'directorcomunidad' ? <>


                    <Text style={styles.titleChart}>Cantidad de incidencias por mes</Text>
                    {chartDataDate ?
                        <BarGraph chartData={chartDataDate} />
                        : <View style={styles.cardTotal}>
                            <ActivityIndicator size='large' color='#0000dff' />
                        </View>}

                    <Text style={styles.titleChart}>Cantidad de tipo de incidencias</Text>
                    {chartDataPie ? <PieGraph chartDataPie={chartDataPie} /> : <View style={styles.cardTotal}>
                        <ActivityIndicator size='large' color='#0000dff' />
                    </View>}
                    <Text style={styles.titleChart}> cantidad de incidencias por comuna comunidad</Text>


                    <View style={styles.flatList}>


                        {countByComuna ? (
                            Object.keys(countByComuna).map((comuna) => (
                                <TouchableOpacity
                                    style={styles.cardIncidence}
                                    key={comuna}  // Usa el nombre de la comuna como clave
                                >
                                    <View style={{ width: '80%' }}>
                                        <Text style={styles.titleCardIncidence}>{comuna}</Text>
                                        <Text style={styles.descripcionCardIncidence}>{countByComuna[comuna]}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <ActivityIndicator size='large' color='#0000dff' />
                        )}


                    </View>




                </> : dataUserDb.rol === 'directorgeneral' ?
                    <>
                        <Text style={styles.titleChart}> cantidad de incidencias por comuna director general</Text>
                        <Text style={styles.titleChart}> Cantidad de Incidencias por nivel</Text>

                        {chartData ? <LineGraph chartData={chartData} /> :
                            <View style={styles.cardTotal}>
                                <ActivityIndicator size='large' color='#0000dff' />
                            </View>
                        }
                        <Text style={styles.titleChart}>Cantidad de incidencias por mes</Text>
                        {chartDataDate ?
                            <BarGraph chartData={chartDataDate} />
                            : <View style={styles.cardTotal}>
                                <ActivityIndicator size='large' color='#0000dff' />
                            </View>}

                        <Text style={styles.titleChart}>Cantidad de tipo de incidencias</Text>
                        {chartDataPie ? <PieGraph chartDataPie={chartDataPie} /> : <View style={styles.cardTotal}>
                            <ActivityIndicator size='large' color='#0000dff' />
                        </View>}

                        <View style={styles.flatList}>

                            <Text style={styles.titleChart}> cantidad de incidencias por comuna comunidad</Text>
                            {countByComuna ? (
                                Object.keys(countByComuna).map((comuna) => (
                                    <TouchableOpacity
                                        style={styles.cardIncidence}
                                        key={comuna}  // Usa el nombre de la comuna como clave
                                    >
                                        <View style={{ width: '80%' }}>
                                            <Text style={styles.titleCardIncidence}>{comuna}</Text>
                                            <Text style={styles.descripcionCardIncidence}>{countByComuna[comuna]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <ActivityIndicator size='large' color='#0000dff' />
                            )}


                        </View>


                    </> : <>
                        <Text style={styles.titleChart}> Cantidad de Incidencias por nivel</Text>

                        {chartData ? <LineGraph chartData={chartData} /> :
                            <View style={styles.cardTotal}>
                                <ActivityIndicator size='large' color='#0000dff' />
                            </View>
                        }
                        <Text style={styles.titleChart}>Cantidad de incidencias por mes</Text>
                        {chartDataDate ?
                            <BarGraph chartData={chartDataDate} />
                            : <View style={styles.cardTotal}>
                                <ActivityIndicator size='large' color='#0000dff' />
                            </View>}

                        <Text style={styles.titleChart}>Cantidad de tipo de incidencias</Text>
                        {chartDataPie ? <PieGraph chartDataPie={chartDataPie} /> : <View style={styles.cardTotal}>
                            <ActivityIndicator size='large' color='#0000dff' />
                        </View>}


                    </>}





            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F22',

    },
    titleChart: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 15
    },

    flatList: {
        marginTop: 30,
        height: '70%',
        width: '90%',
        flex: 1,


    },
    cardIncidence: {
        margin: 5,
        padding: 10,
        backgroundColor: '#272b34',
        borderRadius: 10,
        marginHorizontal: 20,
        height: '100',
        flexDirection: 'row',
    },
    cardTotal: {

        backgroundColor: '#272b34',
        height: 220,
        width: '95%',
        borderRadius: 16,
        marginVertical: 8,

        justifyContent: 'center',
        alignItems: 'center',


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
    },
    charts: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    subcontainer2: {

        height: '50%'
    },
})


export default DashBoard