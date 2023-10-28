import { createContext, useState, } from "react";
import regiones from "../data/regiones";
import { Text } from "react-native";

export const RecordContext = createContext(null);

const RecordProvider = ({ children }) => {

    const [choosedItem, setChoosedItem] = useState('Región Metropolitana de Santiago');
    const [loanding, setLoading] = useState('');
    const [dataUserDb, setDataUserDb] = useState({})
    const [user, setUser] = useState(null)
    return (
        <RecordContext.Provider
            value={{
                regiones,
                choosedItem,
                setChoosedItem,
                loanding,
                setLoading,
                dataUserDb,
                setDataUserDb,
                user,
                setUser


            }}
        >
            {children}
        </RecordContext.Provider>

    )
}
export default RecordProvider;