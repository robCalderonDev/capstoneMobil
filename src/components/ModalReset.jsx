import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

const ModalReset = ({ modalVisible, setModalVisible, email, setEmail }) => {

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.modalTitle}>Correo de recuperacion enviado</Text>
                            <Image
                                source={require('./../img/check.png')}
                                style={{
                                    width: 25, // Ajusta el ancho de la imagen
                                    height: 25, // Ajusta la altura de la imagen
                                    marginTop: -2.5,
                                    marginLeft: 10,

                                }}
                            />
                        </View>

                        <Text style={styles.modalText}>Hemos enviado instrucciones para cambiar la contraseña a <Text style={styles.mail}>{email}</Text>. Revisa tu bandeja de entrada</Text>
                        <View style={styles.buttonContainer} testID='modal-container' >
                            <TouchableOpacity style={styles.touchableOpacity1} testID='myButton:button:ClickMe' onPress={() => {

                                setModalVisible(!modalVisible);
                                setEmail('');
                            }}>
                                <Text style={styles.text}>Vale</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    mail: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        paddingTop: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#313338',
        borderRadius: 15,
        padding: 35,
        width: '80%',
        height: '30%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    touchableOpacity1: {
        backgroundColor: '#56AF84',

        height: 40,
        width: '40%',
        borderRadius: 2,

    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 15,
        color: 'white',

    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }

});

export default ModalReset;