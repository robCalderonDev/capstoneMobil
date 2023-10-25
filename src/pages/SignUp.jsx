import { Formik, useField } from 'formik'
import React, { useContext, useEffect } from 'react'
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native'
import { loginValidationSchena } from '../validationSchemas/signUp'
import StyledTextInput from '../components/styled/StyledTextInput'
import DropdownComponent from '../components/DropDownButton'

import { RecordContext } from '../context/context'
import { Dropdown } from 'react-native-element-dropdown'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig'
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';



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
    const { regiones, choosedItem, loanding, setLoading } = useContext(RecordContext);
    const [comunas, setComunas] = useState([]);

    const auth = FIREBASE_AUTH;//obtiene la autenticacion de firebase
    const initialValues = {//valores iniciales para el formulario 
        nombre: '',
        email: '',
        password: '',
        rut: '',
        region: '',
        comuna: '',
        calle: '',
        rol: ''
    };

    const regionName = choosedItem || "patagonia";

    useEffect(() => {
        const comunasData = getComunasByRegion(regionName);
        setComunas(comunasData);
    }, [regionName]);

    const getComunasByRegion = (regionName) => {
        const region = regiones.regiones.find(region => region.region === regionName);

        if (region) {
            return region.comunas.map(comuna => ({ label: comuna, value: comuna }));
        } else {
            return [];
        }
    };

    const handleSubmitSignUp = async ({ nombre, email, password, rut, region, comuna, calle }) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userUid = response.user.uid;

            // Crea una referencia al documento del usuario utilizando su UID
            const userDocRef = doc(FIRESTORE_DB, 'usuarios', userUid);

            const newUser = {
                nombre: nombre,
                email: email,
                password: password,
                rut: rut,
                region: region,
                comuna: comuna,
                calle: calle
            };

            // Establece los datos en el documento en Firestore
            await setDoc(userDocRef, newUser);

            // Muestra un mensaje de éxito
            alert('¡Tu usuario ha sido creado y se ha agregado a la colección de usuarios en Firestore!');
            console.log(response); // Puedes mostrar la respuesta de createUserWithEmailAndPassword si es necesario
        } catch (error) {
            // Maneja los errores, puedes mostrar mensajes de error o realizar otras acciones necesarias
            console.error(error.message);
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        } finally {
            // Realiza acciones finales si es necesario
            setLoading(false);
        }
    }
    const [isFocus, setIsFocus] = useState(false);


    return (
        <Formik
            validationSchema={loginValidationSchena}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
            initialValues={initialValues}
            onSubmit={(values) => {
                handleSubmitSignUp(values)
                console.log(values, 'data')
            }}>
            {(props) => {
                return (
                    <ScrollView style={styles.form}>
                        <FormikInputValue name='nombre' placeholder='Nombre' onChangeText={props.handleChange('nombre')} value={props.values.nombre} />
                        <FormikInputValue name='rut' placeholder='Rut' onChangeText={props.handleChange('rut')} value={props.values.rut} />


                        <DropdownComponent data={regiones.regiones} labelField={'region'} valueField={'_index'} setFieldValue={props.setFieldValue} />
                        <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={comunas}
                            maxHeight={300}
                            search
                            placeholder={!isFocus ? 'Select item' : '...'}
                            searchPlaceholder="Search..."

                            labelField="label"
                            onChange={(item) => {
                                props.setFieldValue('comuna', item.label);

                            }}

                        />

                        <FormikInputValue name='calle' placeholder='Calle' onChangeText={props.handleChange('calle')} value={props.values.calle} />
                        <FormikInputValue name='email' placeholder='E-mail' onChangeText={props.handleChange('email')} value={props.values.email} />
                        <FormikInputValue name='password' placeholder='Password' secureTextEntry onChangeText={props.handleChange('password')} value={props.values.password} />
                        <FormikInputValue name='passwordConfirmation' placeholder='Confirm password' secureTextEntry />

                        {loanding ? <ActivityIndicator size='large' color='#0000dff' />
                            :
                            <Button onPress={props.handleSubmit} title='Sign Up' />}

                    </ScrollView>
                )
            }}
        </Formik>
    )
}





const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        backgroundColor: 'white',
        width: '80%',
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




});

export default SignUp