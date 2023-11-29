import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { BarChart } from 'react-native-chart-kit'

const BarGraph = ({ chartData }) => {
    const order = [
        '1° Básico',
        '2° Básico',
        '3° Básico',
        '4° Básico',
        '5° Básico',
        '6° Básico',
        '7° Básico',
        '8° Básico',
        '1° Medio',
        '2° Medio',
        '3° Medio',
        '4° Medio',
    ];

    // Ordena los datos según el orden específico
    const sortedData = {
        labels: order,
        datasets: chartData.datasets,
    };

    return (
        <View>

            <BarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 16,

                }}
                data={chartData}
                width={(Dimensions.get("window").width) * 0.95} // from react-native
                height={350}
                // yAxisLabel="$"

                chartConfig={{
                    backgroundColor: "#272b34",
                    backgroundGradientFrom: "#272b34",
                    backgroundGradientTo: "#272b34",
                    propsForLabels: { fontSize: 12, dx: -17, },

                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,

                    },
                    barPercentage: 0.2,
                }}
                verticalLabelRotation={90}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F22',

    },
    titleChart: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,

    },
})
export default BarGraph