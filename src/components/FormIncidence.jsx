
import { useNavigation } from '@react-navigation/native';
import { Formik, useField } from 'formik';
import React, { useEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView, Image, Alert, ToastAndroid } from 'react-native';
import { formIncidenceschema, } from '../validationSchemas/validationsForm';
import * as DocumentPicker from 'expo-document-picker';
import { getFirestore, Timestamp, GeoPoint, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { Dropdown } from 'react-native-element-dropdown';
import StyledTextInput from './styled/StyledTextInput';
import { useState } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useContext } from 'react';
import { RecordContext } from '../context/context';
import { obtenerDataColegios } from '../helpers/parsinData';
import colegios from '../data/colegios.json';
import { collection } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from '../FirebaseConfig';
import * as FileSystem from 'expo-file-system';



const incidencesType = [{ label: 'Academica', value: 'Academica' }]
// , { label: 'comunitaria', value: 'comuntaria' },
initialValues = {
    incidenceTytpe: '',
    subject: '',
    description: '',
    fecha: '',
    idEstudiante: '',
    file: ''
}

const FormikInputValueIncidence = ({ name, ...props }) => {
    const [field, meta, helpers] = useField(name)

    return (
        <>
            <StyledTextInput
                error={meta.error}
                value={field.value}
                onChangeText={value => helpers.setValue(value)}
                {...props}
            />
            {meta.error && <Text style={styles.error}>{meta.error}</Text>}
        </>
    )
}


const FormIncidence = () => {
    const [location, setLocation] = useState({})
    const [image, setImage] = useState(null);
    const [urlImage, setUrlImage] = useState('')
    const [loanding, setLoading] = useState(false)
    const { colegiosParseado, setColegiosParseado, dataUserDb } = useContext(RecordContext);
    const [cordenadas, setCordenadas] = useState({ latitud: 0, longitud: 0 })
    const auth = FIREBASE_AUTH;
    useEffect(() => {
        const getPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please dar permisos para acceder a la ubica`cion');
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            //console.log('Location: ', currentLocation)
        }
        getPermission()
        const colegioParseado = obtenerDataColegios(colegios)
        setColegiosParseado(colegioParseado)


    }, [])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,

        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadMediaFile = async () => {
        setLoading(true);
        try {
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = () => {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null); // This line sends the HTTP request.
            });

            const filepath = 'evidencia/' + image.substring(image.lastIndexOf('/') + 1);
            const reference = ref(FIREBASE_STORAGE, filepath);

            const uploadTask = uploadBytes(reference, blob).then(snapshot => {
                return getDownloadURL(snapshot.ref)
            })
                .then(downloadURL => {
                    setUrlImage(downloadURL)
                }) // Utiliza uploadBytes para cargar el blob.

            await uploadTask;

            setLoading(false);
            console.log('Archivo subido', 'El archivo se subió correctamente');
            setImage(null);
        } catch (error) {
            setLoading(false);
            console.log('error', error);
        }
    };


    const selectSchool = (colegiosParseado) => {
        const colegioStudent = colegiosParseado.find(colegio => colegio['NOMBRE ESTABLECIMIENTO'] === dataUserDb.colegio)

        setCordenadas({ latitud: parseFloat(colegioStudent['LATITUD'].replace(',', '.')), longitud: parseFloat(colegioStudent['LONGITUD'].replace(',', '.')) })
    }




    const navigation = useNavigation();

    const sentIncidence = async ({ incidenceTytpe, subject, description }) => {
        await uploadMediaFile()
        const collectionRef = collection(FIRESTORE_DB, 'incidencia-estudiantil');
        const fechaTimestamp = Timestamp.fromDate(new Date());
        //console.log('enviar', cordenadas, fechaTimestamp, incidenceTytpe, subject, description, auth.currentUser.uid)
        const newUser = {
            idEstudiante: auth.currentUser.uid,
            titulo: subject,
            fecha: fechaTimestamp,
            ubicacion: new GeoPoint(cordenadas['latitud'], cordenadas['longitud']),
            evidencia: urlImage,
            descripcion: description,
            curso: dataUserDb.curso,




        };

        await addDoc(collectionRef, newUser);

        ToastAndroid.show('Incidencia enviada correctamente', ToastAndroid.LONG);
    }

    return (
        <Formik
            validationSchema={formIncidenceschema}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
                selectSchool(colegiosParseado)
                sentIncidence(values)
                resetForm();



            }}>

            {(props) => {
                return (
                    <ScrollView style={styles.container}>
                        <Text>Formulario de Incidencia</Text>
                        <Text style={styles.HeaderInput}>Tipo de Incidencia</Text>
                        <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            name='incidenceTytpe'
                            data={incidencesType}
                            maxHeight={300}
                            placeholder="..."
                            searchPlaceholder="Buscar..."
                            valueField="value"
                            labelField="label"
                            onChange={(item) => {
                                props.setFieldValue('incidenceTytpe', item.label);

                            }}

                        />
                        {props.errors.incidenceTytpe && props.touched.incidenceTytpe && (
                            <Text style={styles.error}>{props.errors.incidenceTytpe}</Text>
                        )}


                        <FormikInputValueIncidence name='subject' placeholder='Asunto' onChangeText={props.handleChange('subject')} value={props.values.subject} />
                        <FormikInputValueIncidence
                            name='description'
                            placeholder='Describe lo que sucedio'
                            onChangeText={props.handleChange('description')}
                            value={props.values.description}
                            multiline={true}
                            numberOfLines={4} />

                        <TouchableOpacity onPress={pickImage} style={styles.buttonSelect}>
                            {
                                image ? <>

                                    <Text style={styles.textButtonTrue}>Archivo Seleccionado.&nbsp; &nbsp; &nbsp;
                                        <Image
                                            source={require('./../img/check.png')}
                                            style={{
                                                width: 30, // Ajusta el ancho de la imagen
                                                height: 30, // Ajusta la altura de la imagen


                                            }}
                                        />

                                    </Text>

                                </> : <>
                                    <Text style={styles.textButton}>Seleccione archivo (Opcional)

                                    </Text>
                                </>
                            }

                        </TouchableOpacity>


                        {/* {image && <Image source={{ uri: image }} style={{ width: "100%", height: 200 }} />} */}

                        <TouchableOpacity style={styles.buttonUpload} onPress={() => props.handleSubmit()}>

                            <Text style={styles.textButtonEnviar}>Enviar</Text>

                        </TouchableOpacity>
                    </ScrollView>
                )

            }}

        </Formik>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    HeaderInput: {
        color: '#dedede',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        backgroundColor: 'white',
        width: '90%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,

    },
    selectedTextStyle: {
        color: 'gray', // Cambia el color de texto seleccionado en el Dropdown
    },
    inputSearchStyle: {
        color: 'black', // Cambia el color de texto en el campo de búsqueda
    }, error: {
        color: 'red',
        marginTop: -5,
        marginBottom: 12 // Cambia el color de texto en el campo de búsqueda
    },
    placeholderStyle: {
        color: 'gray',
    },
    buttonSelect: {
        backgroundColor: '#314196',
        width: '90%',
        height: 50,
        marginVertical: 20,


    },
    buttonUpload: {
        backgroundColor: "#56AF85",
        width: '90%',
        height: 50,


    },

    textButton: {
        color: '#fff',
        textAlign: 'center',
        borderRadius: 10,
        height: '100%',
        paddingTop: 15,


    },
    textButtonTrue: {
        color: '#fff',
        textAlign: 'center',
        borderRadius: 10,
        height: '100%',


    },
    textButtonEnviar: {
        color: '#fff',
        textAlign: 'center',
        borderRadius: 10,
        marginTop: 12,
    },
    error: {
        color: '#ef9a9a',
        marginTop: -5,
        marginBottom: 12 // Cambia el color de texto en el campo de búsqueda
    },
});
export default FormIncidence;
