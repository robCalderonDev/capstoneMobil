
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { formValidationSchema, } from '../validationSchemas/validationsForm';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import StyledTextInput from './styled/StyledTextInput';

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
    const navigation = useNavigation();
    const incidenceType = [{ label: 'Academica', value: 'Academica' }, { label: 'comunitaria', value: 'comuntaria' },]
    initialValues = {
        incidenceTytpe: '',
        subject: '',
        description: '',



    }

    return (
        <Formik
            validationSchema={formValidationSchema}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
            initialValues={initialValues}
            onSubmit={(values) => {
                handleSubmitSignUp(values)

            }}>

            {(props) => {
                return (
                    <ScrollView >
                        <Text>Formulario de Incidencia</Text>
                        <Dropdown

                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}

                            data={incidenceType}
                            maxHeight={300}
                            placeholder="Tipo Incidencia"
                            searchPlaceholder="Buscar..."
                            valueField="value"
                            labelField="label"
                            onChange={(item) => {
                                props.setFieldValue('comuna', item.label);

                            }}

                        />
                        <StyledTextInput name='asunto' placeholder='Asunto' />
                        <TextInput style={styles.TextInput}
                            multiline={true}
                            numberOfLines={4}
                            placeholder='Descripcions'
                        />
                    </ScrollView>
                )

            }
            }

        </Formik>
    );
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
        placeholderColor: 'red',
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
    TextInput: {
        borderRadius: 20,

        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
        width: '80%',
        backgroundColor: '#fff',

    }
});
export default FormIncidence;
