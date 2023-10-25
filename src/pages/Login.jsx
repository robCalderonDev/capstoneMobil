import { View, Text, StyleSheet, ActivityIndicator, Button, ToastAndroid, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_APP, FIREBASE_AUTH } from '../FirebaseConfig';
import { TextInput } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import StyledTextInput from '../components/styled/StyledTextInput';



const Login = () => {

    const { loanding, setLoading } = useContext(RecordContext);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation(); // Obtiene el objeto navigation

    const auth = FIREBASE_AUTH;
    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            ToastAndroid.show('Login Exitoso', ToastAndroid.SHORT);

        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                ToastAndroid.show('usuario no encontrado', ToastAndroid.SHORT);
            }
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
                ToastAndroid.show('La cuenta o la contrasena es incorrecta', ToastAndroid.SHORT);
            }

        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <View style={styles.inputLogin}>
                    <StyledTextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}

                        placeholder='Email'
                        autoCapitalize='none' />
                    <StyledTextInput
                        value={password}
                        onChangeText={(text) => setPassword(text)}

                        placeholder='Password'
                        autoCapitalize='none'
                        secureTextEntry={true} />
                </View>

                {
                    loanding ? <ActivityIndicator size='large' color='#0000dff' />
                        : <>
                            <Button title='Login' onPress={signIn} />



                        </>
                }
                <Button title='Create account' onPress={() => navigation.navigate('SignUp')} />
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

        backgroundColor: '#dedede'

    },
    inputLogin: {
        paddingVertical: 10,
        backgroundColor: 'red',
        alignItems: 'center',
    }


})

export default Login