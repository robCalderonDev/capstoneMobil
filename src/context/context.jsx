import { createContext, useState, } from "react";
import regiones from "../data/regiones";
import { Text } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";

export const RecordContext = createContext(null);

const RecordProvider = ({ children }) => {

    const [choosedItem, setChoosedItem] = useState('Región Metropolitana de Santiago');
    const [loading, setLoading] = useState(false);
    const [dataUserDb, setDataUserDb] = useState({})
    const [user, setUser] = useState(null)
    const [colegiosParseado, setColegiosParseado] = useState({})
    const auth = FIREBASE_AUTH;

    ; // Reemplaza 'tuDocumentoID' con el ID del documento que deseas buscar


    const getDataUser = async () => {
        const documentId = auth.currentUser.uid; // Asigna el valor antes de su uso

        const docRefUsuarios = doc(FIRESTORE_DB, 'usuarios', documentId);

        try {
            const docSnapshotUsuarios = await getDoc(docRefUsuarios);

            if (docSnapshotUsuarios.exists()) {
                const dataUsuarios = docSnapshotUsuarios.data();
                setDataUserDb(dataUsuarios);
            } else {
                console.log('El documento no existe en usuarios');
            }
        } catch (error) {
            console.error('Error al buscar el documento en usuarios:', error);
        }

        try {
            console.log('ENTRO');
            const docRefEstudiantes = doc(FIRESTORE_DB, 'estudiantes', documentId);
            const docSnapshotEstudiantes = await getDoc(docRefEstudiantes);

            if (docSnapshotEstudiantes.exists()) {
                const dataEstudiantes = docSnapshotEstudiantes.data();
                setDataUserDb(dataEstudiantes);
            } else {
                console.log('El documento no existe en estudiantes');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RecordContext.Provider
            value={{
                regiones,
                choosedItem,
                setChoosedItem,
                loading,
                setLoading,
                dataUserDb,
                setDataUserDb,
                user,
                setUser,
                colegiosParseado,
                setColegiosParseado,
                getDataUser


            }}
        >
            {children}
        </RecordContext.Provider>

    )
}
export default RecordProvider;