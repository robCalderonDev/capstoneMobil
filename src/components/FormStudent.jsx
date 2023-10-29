import { Formik, useField } from 'formik'
import React, { useContext, useEffect } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import cursos from '../data/cursos'
import { formValidationSchema } from '../validationSchemas/validationsForm'
import { RecordContext } from '../context/context'
import StyledTextInput from './styled/StyledTextInput'
import { useState } from 'react'


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


const FormStudent = () => {
    const { regiones, choosedItem, loanding, setLoading } = useContext(RecordContext);
    const [cursosParse, setCursosParse] = useState([{}])




    const CursoDropdown = () => {
        const dropdownData = cursos.cursos.map((curso, index) => ({
            value: curso,
            label: curso,
        }));
        setCursosParse(dropdownData)
    }
    useEffect(() => {
        CursoDropdown()
    }, [])
    const initialValues = {//valores iniciales para el formulario 
        nombre: '',
        apellido: '',
        rut: '',
        comuna: '',
        isStudent: false,
        calle: '',
        email: '',
        password: '',
        colegio: ''
    };
    return (
        <Formik
            validationSchema={formValidationSchema}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
            initialValues={initialValues}
            onSubmit={(values) => {
                //handleSubmitSignUp(values)
                alert('hola')

            }}>
            {(props) => {
                return (
                    <ScrollView style={styles.form}>
                        <FormikInputValue name='nombre' placeholder='Nombre' onChangeText={props.handleChange('nombre')} value={props.values.nombre} />
                        <FormikInputValue name='nombre' placeholder='Apellido' onChangeText={props.handleChange('apellido')} value={props.values.apellido} />
                        {/* <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}

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
                        <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}

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

                        /> */}

                        <FormikInputValue name='email' placeholder='E-mail' onChangeText={props.handleChange('email')} value={props.values.email} />
                        <FormikInputValue name='password' placeholder='Password' secureTextEntry onChangeText={props.handleChange('password')} value={props.values.password} />
                        <FormikInputValue name='passwordConfirmation' placeholder='Confirm password' secureTextEntry />
                        {loanding ? <ActivityIndicator size='large' color='#0000dff' />
                            :
                            <TouchableOpacity onPress={() => props.handleSubmit()} style={styles.touchableSignUp}>
                                <Text style={styles.touchabletext}>Registrarse</Text>
                            </TouchableOpacity>
                        }
                    </ScrollView>
                )

            }}
        </Formik>
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
        width: '80%',
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
    switch: {


    }




});


export default FormStudent