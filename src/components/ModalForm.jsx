import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

const ModalForm = ({ setIsStudent, modalVisible, setModalVisible }) => {

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Eres estudiante?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.touchableOpacity1} onPress={() => {
                                setIsStudent(false);
                                setModalVisible(!modalVisible);
                            }}>
                                <Text style={styles.text}>Si</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touchableOpacity} onPress={() => {
                                setIsStudent(true);
                                setModalVisible(!modalVisible);
                            }}>
                                <Text style={styles.text}>No</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
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
        height: '20%',
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    touchableOpacity1: {
        backgroundColor: '#56AF84',
        marginRight: 20,
        height: 40,
        width: '25%',
        borderRadius: 2,

    },
    touchableOpacity: {
        backgroundColor: '#2F5A73',
        borderRadius: 2,
        height: 40,
        width: '25%',
        borderRadius: 2,


    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default ModalForm;