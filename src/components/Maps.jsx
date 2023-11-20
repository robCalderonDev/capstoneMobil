import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { FIRESTORE_DB } from '../FirebaseConfig'
import { collection, onSnapshot } from 'firebase/firestore'
import { useContext } from 'react'
import { RecordContext } from '../context/context'
import ModalIncidence from './modals/ModalIncidence'





const Maps = () => {
    const { docs, setdocs } = useContext(RecordContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState({});

    useEffect(() => {

        const dataIncidences = onSnapshot(collection(FIRESTORE_DB, 'incidencia-estudiantil'), (querySnapshot) => {
            const documents = querySnapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            });
            setdocs(documents);
            console.log("bu2g")
        });
        () => dataIncidences();
    }, [])

    const showLocationsOfInterest = () => {


        return docs.map((item, index) => {
            return (
                <Marker
                    onPress={() => {
                        setModalVisible(true);
                        setItemSelected(item);
                    }}
                    key={item.id}

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
        <>
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
            <ModalIncidence modalVisible={modalVisible} setModalVisible={setModalVisible} itemSelected={itemSelected} />
        </>


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