import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { FIRESTORE_DB } from '../FirebaseConfig'
import { collection, onSnapshot } from 'firebase/firestore'

const getAllIncidence = async () => {
    const collectionRef = FIRESTORE_DB('nombre_de_tu_coleccion');

    // Realiza la consulta para obtener todos los documentos de la colección
    collectionRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Accede a los datos de cada documento
                const data = doc.data();
                console.log('Documento ID:', doc.id);
                console.log('Datos:', data);
            });
        })
        .catch((error) => {
            console.error('Error al obtener los documentos:', error);
        });
}



let locationsOfInterest = [
    {
        title: 'Casa',
        location: {
            latitude: -33.5230525,
            longitude: -70.65371052,
        },
        description: 'Prueba1',

    },
    {
        title: 'colegio',
        location: {
            latitude: -33.55178,
            longitude: -70.64509,
        },
        description: 'Prueba2',

    }, {
        title: 'otro colegio',
        location: {
            latitude: -33.67046,
            longitude: -70.93788,
        },
        description: 'Prueba3',

    }
]


const Maps = () => {

    const [docs, setdocs] = useState([])

    useEffect(() => {
        const unsub = onSnapshot(collection(FIRESTORE_DB, 'incidencia-estudiantil'), (querySnapshot) => {
            const documents = querySnapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            });
            setdocs(documents);
        });
        return () => unsub();
    }, [])

    const showLocationsOfInterest = () => {


        return docs.map((item, index) => {
            return (
                <Marker
                    key={item.id}
                    title={item.titulo}
                    description={item.descripcion}
                    coordinate={{
                        longitude: item.ubicacion.longitude ? item.ubicacion.longitude : 0,
                        latitude: item.ubicacion.latitude ? item.ubicacion.latitude : 0
                    }}
                />
            )
        })
    }


    const onRegionChange = (region) => {
        console.log(region);
    }

    return (

        <MapView
            style={style.map}

            initialRegion={{
                latitude: -33.45468201063936,
                longitude: -70.65908985212445,
                latitudeDelta: 0.25080673141022913,
                longitudeDelta: 0.15615183860064974,
            }}
        >
            {showLocationsOfInterest()}

        </MapView>

    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: '100%',
        height: '100%'
    }

})

export default Maps