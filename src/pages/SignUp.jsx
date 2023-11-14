import { Formik, useField } from 'formik'
import React, { useContext, useEffect } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View, } from 'react-native'
import { loginValidationSchena, loginValidationSchenaStudent, loginValidationSchenaUser } from '../validationSchemas/validationsForm'
import StyledTextInput from '../components/styled/StyledTextInput'
import Checkbox from 'expo-checkbox';
import { RecordContext } from '../context/context'
import { Dropdown } from 'react-native-element-dropdown'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Switch } from 'react-native-switch';
import colegios from '../data/colegios.json';
import { obtenerDataColegios } from '../helpers/parsinData'
import cursos from '../data/cursos.js'
import ModalForm from '../components/ModalForm'


const FormikInputValue = ({ name, ...props }) => {
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

const SignUp = () => {
    const { regiones, choosedItem, loading, setLoading, setDataUserDb, colegiosParseado, setColegiosParseado } = useContext(RecordContext);
    const [comunas, setComunas] = useState([]);
    const [cursosParse, setCursosParse] = useState([{}])

    const [isStudent, setIsStudent] = useState(false)
    const [modalVisible, setModalVisible] = useState(true);
    const auth = FIREBASE_AUTH;//obtiene la autenticacion de firebase
    const initialValues = {//valores iniciales para el formulario 
        nombre: '',
        apellido: '',
        rut: '',
        comuna: '',
        calle: '',
        email: '',
        password: '',
        colegio: '',
        curso: '',

    };

    const regionName = choosedItem || "patagonia";

    useEffect(() => {
        const comunasData = getComunasByRegion(regionName);
        setComunas(comunasData);
        const colegioParseado = obtenerDataColegios(colegios)
        setColegiosParseado(colegioParseado)
        CursoDropdown()
    }, [regionName]);

    const getComunasByRegion = (regionName) => {
        const region = regiones.regiones.find(region => region.region === regionName);

        if (region) {
            return region.comunas.map(comuna => ({ label: comuna, value: comuna }));
        } else {
            return [];
        }
    };

    const CursoDropdown = () => {
        const dropdownData = cursos.cursos.map((curso, index) => ({
            value: curso,
            label: curso,
        }));
        setCursosParse(dropdownData)
    }

    const handleSubmitSignUp = async ({ nombre, email, password, rut, comuna, calle, apellido, colegio, curso }) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userUid = response.user.uid;

            // Crea una referencia al documento del usuario utilizando su UID
            const nameCollection = isStudent ? 'usuarios' : 'estudiantes';
            const collectionRef = collection(FIRESTORE_DB, nameCollection);

            if (nameCollection === 'estudiantes') {
                const newUser = {
                    nombre: nombre,
                    apellido: apellido,
                    colegio: colegio,
                    curso: curso,
                    mail: email.toLowerCase(),
                    rol: 'estudiante'

                };
                const userDocRef = doc(collectionRef, userUid);
                // Establece los datos en el documento en Firestore
                await setDoc(userDocRef, newUser);

                // Muestra un mensaje de éxito
                ToastAndroid.show('Cuenta Creada estudiante', ToastAndroid.LONG);
                // Puedes mostrar la respuesta de createUserWithEmailAndPassword si es necesario
                setDataUserDb(newUser)
            }
            else {
                const newUser = {
                    nombre: nombre,
                    apellido: apellido,
                    rut: rut,
                    comuna: comuna,
                    calle: calle,
                    mail: email.toLowerCase(),
                    rol: 'usuario'

                };
                // Establece los datos en el documento en Firestore
                const userDocRef = doc(collectionRef, userUid);
                // Establece los datos en el documento en Firestore
                await setDoc(userDocRef, newUser);
                ToastAndroid.show('Cuenta Creada normal', ToastAndroid.LONG);
                setDataUserDb(newUser)
                // Puedes mostrar la respuesta de createUserWithEmailAndPassword si es necesario
            }
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        } finally {
            // Realiza acciones finales si es necesario
            setLoading(false);
        }
    }

    return (
        <Formik
            validationSchema={isStudent ? loginValidationSchenaUser : loginValidationSchenaStudent}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
            initialValues={initialValues}
            onSubmit={(values) => {
                handleSubmitSignUp(values)


            }}>
            {(props) => {
                return (
                    <ScrollView style={styles.form}>
                        {modalVisible ? (
                            <ModalForm setIsStudent={setIsStudent} setModalVisible={setModalVisible} modalVisible={modalVisible} />
                        ) : (isStudent ? (
                            <>

                                <FormikInputValue name='nombre' placeholder='Nombre' onChangeText={props.handleChange('nombre')} value={props.values.nombre} />
                                <FormikInputValue name='apellido' placeholder='Apellido' onChangeText={props.handleChange('apellido')} value={props.values.apellido} />
                                <FormikInputValue name='rut' placeholder='Rut' onChangeText={props.handleChange('rut')} value={props.values.rut} />
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    name='comuna'
                                    data={comunas}
                                    maxHeight={300}
                                    search
                                    placeholder="Selecciona Comuna"
                                    searchPlaceholder="Buscar..."
                                    valueField="value"
                                    labelField="label"
                                    onChange={(item) => {
                                        props.setFieldValue('comuna', item.label);
                                    }}
                                />

                                {props.errors.comuna && props.touched.comuna && (
                                    <Text style={styles.error}>{props.errors.comuna}</Text>
                                )}
                                <FormikInputValue name='calle' placeholder='Calle' onChangeText={props.handleChange('calle')} value={props.values.calle} />
                                <FormikInputValue name='email' placeholder='E-mail' onChangeText={props.handleChange('email')} value={props.values.email} />
                                <FormikInputValue name='password' placeholder='Password' secureTextEntry onChangeText={props.handleChange('password')} value={props.values.password} />
                                <FormikInputValue name='passwordConfirmation' placeholder='Confirm password' secureTextEntry />
                                {loading ? <ActivityIndicator size='large' color='#0000dff' />
                                    :

                                    <TouchableOpacity onPress={() => props.handleSubmit()} style={styles.touchableSignUp}>
                                        <Text style={styles.touchabletext}>Registrarse</Text>
                                    </TouchableOpacity>}
                            </>

                        ) : (
                            <>

                                <FormikInputValue name='nombre' placeholder='Nombre' onChangeText={props.handleChange('nombre')} value={props.values.nombre} />
                                <FormikInputValue name='nombre' placeholder='Apellido' onChangeText={props.handleChange('apellido')} value={props.values.apellido} />
                                <Dropdown

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
                                    }}

                                />
                                {props.errors.colegio && props.touched.colegio && (
                                    <Text style={styles.error}>{props.errors.colegio}</Text>
                                )}


                                <Dropdown

                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    name='curso'
                                    data={cursosParse}
                                    maxHeight={300}
                                    search
                                    placeholder="Selecciona Curso"
                                    searchPlaceholder="Buscar..."
                                    valueField="value"
                                    labelField="label"
                                    onChange={(item) => {
                                        props.setFieldValue('curso', item['label'])
                                    }}

                                />
                                {props.errors.curso && props.touched.curso && (
                                    <Text style={styles.error}>{props.errors.curso}</Text>
                                )}

                                <FormikInputValue name='email' placeholder='E-mail' onChangeText={props.handleChange('email')} value={props.values.email} />
                                <FormikInputValue name='password' placeholder='Password' secureTextEntry onChangeText={props.handleChange('password')} value={props.values.password} />
                                <FormikInputValue name='passwordConfirmation' placeholder='Confirm password' secureTextEntry />
                                {loading ? <ActivityIndicator size='large' color='#0000dff' />
                                    :
                                    <TouchableOpacity onPress={() => props.handleSubmit()} style={styles.touchableSignUp}>
                                        <Text style={styles.touchabletext}>Registrarse</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        ))
                        }

                    </ScrollView>
                )
            }}
        </Formik >
    )
}





const styles = StyleSheet.create({
    form: {
        flex: 1,
        paddingHorizontal: 50,
        backgroundColor: '#1E1F22',

    },

    touchableSignUp: {
        width: '80%',
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#2F5A73',
    },
    touchabletext: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#fff',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        backgroundColor: 'white',
        width: '100%',
        height: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
        placeholderColor: 'red',
    },
    selectedTextStyle: {
        color: 'gray', // Cambia el color de texto seleccionado en el Dropdown
        fontSize: 15,
    },
    inputSearchStyle: {
        color: 'black', // Cambia el color de texto en el campo de búsqueda
        fontSize: 15,
    }, error: {
        color: '#ef9a9a',
        marginTop: -5,
        marginBottom: 12 // Cambia el color de texto en el campo de búsqueda
    },
    placeholderStyle: {
        color: 'gray',
    },
    container: {

        flexDirection: 'row',
    },




});

export default SignUp