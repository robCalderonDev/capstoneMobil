
import { useNavigation } from '@react-navigation/native';
import { Formik, useField } from 'formik';
import React, { useEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput, ScrollView, Image, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
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



const incidencesType = [{ label: 'Academica', value: 'Academica' }, { label: 'Comunitaria', value: 'Comunitaria' }]
// , { label: 'comunitaria', value: 'comuntaria' },
const initialValues = {
    incidenceType: '',
    subject: '',
    description: '',
    fecha: '',
    idEstudiante: '',
    file: '',
    categoriaIncidencia: ''
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
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState()
    const { colegiosParseado, setColegiosParseado, dataUserDb } = useContext(RecordContext);

    const [colegioChoose, setColegioChoose] = useState({})
    const auth = FIREBASE_AUTH;
    useEffect(() => {
        const getPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Please dar permisos para acceder a la ubicacion');
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            console.log('Location: ', currentLocation)
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


    const categoriasIncidencia = [{ label: 'Acoso', value: 'Acoso' },
    { label: 'Accidente', value: 'Accidente' },
    { label: 'Evidencia', value: 'Evidencia' },
    { label: 'Alerta', value: 'Alerta' },
    { label: 'Otro', value: 'Otro' },]

    const navigation = useNavigation();

    const sentIncidence = async ({ incidenceType, subject, description, categoriaIncidencia }) => {
        if (image) {
            await uploadMediaFile()

        }


        console.log(colegioChoose, 'colegiochooooose')



        const colegioStudent = colegiosParseado.find(colegio => colegio['NOMBRE ESTABLECIMIENTO'] === dataUserDb.colegio)
        // console.log(colegioStudent, 'colegioStudent')




        const collectionRef = collection(FIRESTORE_DB, 'incidencias');
        const fechaTimestamp = Timestamp.fromDate(new Date());
        // console.log('enviar', cordenadas, fechaTimestamp, incidenceType, categoriaIncidencia, subject, description, auth.currentUser.uid)
        const newIncidence = {
            idEstudiante: auth.currentUser.uid,
            incidenceType: incidenceType,
            titulo: subject,
            fecha: fechaTimestamp,
            ubicacion: dataUserDb.rol === 'usuario' && incidenceType === 'Academica'
                ? new GeoPoint(parseFloat(colegioChoose.LATITUD?.replace(',', '.')), parseFloat(colegioChoose.LONGITUD.replace(',', '.')))
                : dataUserDb.rol === 'usuario' && incidenceType !== 'Academica'
                    ? new GeoPoint(location.coords.latitude, location.coords.longitude)
                    : dataUserDb.rol === 'estudiante' && incidenceType === 'Academica'
                        ? new GeoPoint(parseFloat(colegioStudent.LATITUD?.replace(',', '.')), parseFloat(colegioStudent.LONGITUD.replace(',', '.')))
                        : new GeoPoint(location.coords.latitude, location.coords.latitude),

            evidencia: urlImage,
            descripcion: description,
            categoriaIncidencia: categoriaIncidencia,
            curso: dataUserDb.rol === 'estudiante' ? dataUserDb.curso : 'N/A',





        };


        await addDoc(collectionRef, newIncidence);

        ToastAndroid.show('Incidencia enviada correctamente', ToastAndroid.LONG);
        // console.log(cordenadas, 'cordenadas')
    }

    return (
        <Formik
            validationSchema={formIncidenceschema}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {

                sentIncidence(values)
                resetForm()


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
                            name='incidenceType'
                            data={incidencesType}
                            maxHeight={300}
                            placeholder="..."
                            searchPlaceholder="Buscar..."
                            valueField="value"
                            labelField="label"
                            onChange={(item) => {
                                props.setFieldValue('incidenceType', item.label);
                                setType(item.label);
                            }}

                        />


                        {props.errors.incidenceType && props.touched.incidenceType && (
                            <Text style={styles.error}>{props.errors.incidenceType}</Text>
                        )}
                        {dataUserDb.rol === 'usuario' && type === 'Academica' && <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            name='colegio'
                            data={colegiosParseado}
                            maxHeight={300}
                            search
                            placeholder="Selecciona Colegio"
                            searchPlaceholder="Buscar..."
                            valueField="NOMBRE ESTABLECIMIENTO"
                            labelField="NOMBRE ESTABLECIMIENTO"
                            onChange={(item) => {
                                props.setFieldValue('colegio', item['NOMBRE ESTABLECIMIENTO'])
                                setColegioChoose(item)

                            }}

                        />}

                        <Text style={styles.HeaderInput}>Asunto</Text>
                        <FormikInputValueIncidence name='subject' placeholder={dataUserDb.rol === 'estudiante' ? 'Ejemplo: pelea en la biblioteca' : 'Pelea  '} onChangeText={props.handleChange('subject')} value={props.values.subject} />
                        <Text style={styles.HeaderInput}>Descripcion</Text>
                        <FormikInputValueIncidence
                            name='description'
                            placeholder='Describe lo que sucedio'
                            onChangeText={props.handleChange('description')}
                            value={props.values.description}
                            multiline={true}
                            numberOfLines={4} />
                        <Text style={styles.HeaderInput}>Categoria de Incidencia</Text>
                        <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            name='categoriaIncidencia'
                            data={categoriasIncidencia}
                            maxHeight={300}
                            placeholder="..."
                            searchPlaceholder="Buscar..."
                            valueField="value"
                            labelField="label"
                            onChange={(item) => {
                                props.setFieldValue('categoriaIncidencia', item.label);
                                console.log(item.label, 'item')

                            }}

                        />
                        {props.errors.categoriaIncidencia && props.touched.categoriaIncidencia && (
                            <Text style={styles.error}>{props.errors.categoriaIncidencia}</Text>
                        )}

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
                        {loading ? <ActivityIndicator size='large' color='#0000dff' /> :
                            <TouchableOpacity style={styles.buttonUpload} onPress={() => props.handleSubmit()}>

                                <Text style={styles.textButtonEnviar}>Enviar</Text>

                            </TouchableOpacity>}

                    </ScrollView>
                )

            }}

        </Formik>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,

        // Centra verticalment
        paddingHorizontal: 40,

    },
    HeaderInput: {
        color: '#dedede',
        marginBottom: 10,

    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        backgroundColor: 'white',
        width: '100%',
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
        width: '100%',
        height: 50,
        marginVertical: 20,


    },
    buttonUpload: {
        backgroundColor: "#56AF85",
        width: '100%',
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
