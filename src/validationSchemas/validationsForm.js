import * as yup from 'yup'

export const loginValidationSchenaStudent = yup.object().shape({
    nombre: yup
        .string()
        .required('Ingresa tu nombre porfavor'),
    apellido: yup
        .string()
        .required('Ingresa tu apellido porfavor'),

    colegio: yup
        .string()
        .required('Ingresa tu colegio porfavor'),
    curso: yup
        .string()
        .required('Ingresa tu curso porfavor'),
    email: yup
        .string()
        .email('Ingresa un email válido')
        .required('Ingresa tu email'),
    password: yup
        .string()
        .min(5, 'Contraseña muy corta')
        .max(1000, 'Contraseña muy larga')
        .required('Debes Ingresar una contraseña')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Contraseñas deben coincidir'),


})
export const loginValidationSchenaUser = yup.object().shape({
    nombre: yup
        .string()
        .required('Ingresa tu nombre porfavor'),
    apellido: yup
        .string()
        .required('Ingresa tu apellido porfavor'),
    rut: yup
        .string()
        .required('Ingresa tu rut porfavor')
        .matches(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, 'Ingresa un rut válido'),
    comuna: yup
        .string()
        .required('Ingresa tu comuna porfavor'),
    calle: yup
        .string()
        .required('Ingresa tu calle porfavor'),
    email: yup
        .string()
        .email('Ingresa un email válido')
        .required('Ingresa tu email'),
    password: yup
        .string()
        .min(5, 'Contraseña muy corta')
        .max(1000, 'Contraseña muy larga')
        .required('Debes Ingresar una contraseña')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Contraseñas deben coincidir'),


})

export const formIncidenceschema = yup.object().shape({
    incidenceType: yup
        .string()
        .required('Elija tipo de incidencia porfavor'),
    categoriaIncidencia: yup
        .string()
        .required('Elija tipo de incidencia porfavor'),
    subject: yup
        .string()
        .required('Ingresa una descipcion porfavor'),
    description: yup
        .string()
        .required('Ingrese una descripción porfavor'),


})