import { StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import FormIncidence from '../components/FormIncidence'

const Details = () => {
    return (
        <View style={styles.container}>

            <FormIncidence />
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F22',
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    }

})

export default Details