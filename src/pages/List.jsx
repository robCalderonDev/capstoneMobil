import React from 'react'
import { Button, Text, View } from 'react-native'
import { FIREBASE_AUTH } from '../FirebaseConfig'
import { useNavigation } from '@react-navigation/native';

const List = () => {
    const navigation = useNavigation(); // Obtiene el objeto navigation
    return (
        <View>
            <Button title='Details' onPress={() => navigation.navigate('details')} />

            <Button title='LogOut' onPress={() => FIREBASE_AUTH.signOut()} />
        </View>
    )
}

export default List