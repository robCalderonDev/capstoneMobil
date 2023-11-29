import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';

const CardIncidence = ({ item, }) => {
    const fechaFormateada = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
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

    )
}
const styles = StyleSheet.create({

    cardIncidence: {
        margin: 5,
        padding: 10,
        backgroundColor: '#272b34',
        borderRadius: 10,
        marginHorizontal: 20,
        height: '90%',
        flexDirection: 'row',
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

})

export default CardIncidence