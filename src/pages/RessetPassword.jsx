import React from 'react'
import { ActivityIndicator, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import StyledTextInput from '../components/styled/StyledTextInput'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { FIREBASE_AUTH } from '../FirebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth'
import ModalReset from '../components/ModalReset'
import { RecordContext } from '../context/context'
import { useContext } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
const ResetPassword = () => {


    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);


    const triggerResetEmail = async () => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(FIREBASE_AUTH, email);

            setModalVisible(true);

        } catch (error) {
            if (error.code === 'auth/user-not-found') ToastAndroid.show('Correo invalido ', ToastAndroid.SHORT);
            if (error.code === 'auth/missing-email') ToastAndroid.show('Ingrese un correo porfavor ', ToastAndroid.SHORT);
            if (error.code === 'auth/invalid-email') ToastAndroid.show('Ingrese un correo valido porfavor ', ToastAndroid.SHORT);
            console.log(error.code)
        }

        setLoading(false);
    }

    return (
        <View style={styles.container}>

            {modalVisible ?


                <ModalReset modalVisible={modalVisible} email={email} setEmail={setEmail} setModalVisible={setModalVisible} /> :
                <View>
                    <View style={styles.containerLogo}>
                        <Octicons name="key" size={80} color="white" />
                    </View>

                    <Text style={styles.title}>Ingresa el correo electronico asociado a tu cuenta </Text>
                    <StyledTextInput onChangeText={(email) => setEmail(email)} placeholder='Correo' value={email} />
                    {loading ? <ActivityIndicator size='large' color='#0000dff' /> :

                        <TouchableOpacity style={styles.buttonReset} onPress={triggerResetEmail}>
                            <Text style={styles.buttonResetText}>Olvide la contraseña</Text>
                        </TouchableOpacity>
                    }

                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1E1F22',
        padding: 30,

    },
    containerLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -140,
        marginBottom: 100,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 50,
        marginTop: -80,
    },
    buttonReset: {
        width: '100%',
        height: 50,
        backgroundColor: '#56AF84',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonResetText: {
        color: '#fff',
        fontSize: 15,
    },
})

export default ResetPassword
