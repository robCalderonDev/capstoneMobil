import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useContext } from 'react';
import { RecordContext } from '../context/context';



const DropdownComponent = ({ data, labelField, valueField, setFieldValue }) => {
    const [value, setValue] = useState(0);
    const { setChoosedItem, choosedItem } = useContext(RecordContext);



    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}

            data={data}

            maxHeight={300}
            labelField='region'

            placeholder="Select item"
            searchPlaceholder="Search..."

            onChange={(item) => {

                const selectedIndex = data.findIndex((element) => element === item);
                console.log(item.region, 'item')
                setFieldValue('region', item.region);
                setValue(item[valueField]);
                setChoosedItem(item[labelField])
            }}
        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        color: 'red',
    },
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
        color: 'red',

    },
    selectedTextStyle: {
        color: 'gray', // Cambia el color de texto seleccionado en el Dropdown
    },
    inputSearchStyle: {
        color: 'green', // Cambia el color de texto en el campo de búsqueda
    },





});