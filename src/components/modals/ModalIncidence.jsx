import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

const ModalIncidence = ({ modalVisible, setModalVisible, itemSelected }) => {

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
                            <Text style={styles.modalTitle}>{itemSelected.titulo}</Text>
                            {/* <Image
                                source={require('../../img/check.png')}
                                style={{
                                    width: 25, // Ajusta el ancho de la imagen
                                    height: 25, // Ajusta la altura de la imagen
                                    marginTop: -2.5,
                                    marginLeft: 10,

                                }}
                            /> */}
                        </View>

                        <Text style={styles.modalText}>{itemSelected.descripcion}<Text style={styles.mail}></Text> curso: 2B </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.touchableOpacity1} onPress={() => {

                                setModalVisible(!modalVisible);

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
        minHeight: '30%',
        alignItems: 'center',



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
        fontSize: 17,
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

export default ModalIncidence;