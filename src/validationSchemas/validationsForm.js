import * as yup from 'yup'

export const loginValidationSchena = yup.object().shape({
    nombre: yup
        .string()
        .required('Ingresa tu nombre porfavor'),
    rut: yup
        .string()
        .required('Ingresa tu rut porfavor')
        .matches(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, 'Ingresa un rut válido'),
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
export const formValidationSchema = yup.object().shape({})