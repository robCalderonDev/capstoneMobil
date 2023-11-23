import React, { useContext, useEffect } from 'react'
import { ActivityIndicator, Button, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RecordContext } from '../context/context';
import { FIRESTORE_DB } from '../FirebaseConfig'
import { collection, getCountFromServer, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore'
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
    const [chartDataPie, setChartDataPie] = useState(null)

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

            }
        );
        return () => unsubscribe();



    }, []);
    const reference = collection(FIRESTORE_DB, 'incidencia-estudiantil');
    const getDocumentCountByCourse = async () => {


        try {
            const querySnapshot = await getDocs(reference);

            // Crear un objeto para almacenar el recuento por curso
            const countByCourseData = {};

            // Iterar sobre los documentos y contar por curso
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
        } catch (error) {
            console.error('Error al obtener datos:', error);
            throw error;
        }
    };
    const getDocumetnsByCategory = async () => {
        const querySnapshot = await getDocs(reference);

        // Crear un objeto para almacenar el recuento por categoría
        const countByCategory = {};

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
        setChartDataPie(countArray)
        // Aquí, countArray contendrá el array con el formato requerido

        // Si necesitas devolver el array countArray, puedes hacerlo
        return countArray;

    }
    useEffect(() => {
        getDocumentCountByCourse();
        getDocumetnsByCategory()
    }, []);
    // Imprimir el recuento por curso

    console.log('Array con formato requerido:', chartDataPie);


    return (
        <ScrollView style={styles.container}>
            {/* <View>
                <Text style={{ color: 'white', marginLeft: 10, fontSize: 15, marginTop: 15 }}>Bienvenido {dataUserDb.nombre} {dataUserDb.apellido} </Text>
            </View> */}
            {/* <View style={styles.cardTotal}>

            </View> */}
            <View style={styles.charts}>

                <Text style={styles.titleChart}>Cantidad de Incidencias por nivel</Text>

                {chartData ? <LineGraph chartData={chartData} /> :
                    <View style={styles.cardTotal}>
                        <ActivityIndicator size='large' color='#0000dff' />
                    </View>
                }

                <Text style={styles.titleChart}>Porcentaje de Incidencia por nivel</Text>
                {chartData ?
                    <BarGraph chartData={chartData} />
                    : <View style={styles.cardTotal}>
                        <ActivityIndicator size='large' color='#0000dff' />
                    </View>}
                <Text style={styles.titleChart}>Cantidad de tipo de incidencias</Text>
                {chartDataPie ? <PieGraph chartDataPie={chartDataPie} /> : <View style={styles.cardTotal}>
                    <ActivityIndicator size='large' color='#0000dff' />
                </View>}


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
    }
})


export default DashBoard