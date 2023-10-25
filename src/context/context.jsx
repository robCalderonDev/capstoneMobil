import { createContext, useState, } from "react";
import regiones from "../data/regiones";
import { Text } from "react-native";

export const RecordContext = createContext(null);

const RecordProvider = ({ children }) => {

    const [choosedItem, setChoosedItem] = useState('');
    const [loanding, setLoading] = useState('');


    return (
        <RecordContext.Provider
            value={{
                regiones,
                choosedItem,
                setChoosedItem,
                loanding,
                setLoading


            }}
        >
            {children}
        </RecordContext.Provider>

    )
}
export default RecordProvider;