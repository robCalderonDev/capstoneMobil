import React from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

const LineGraph = ({ chartData }) => {
    console.log('chartdat', chartData)
    return (
        <ScrollView>
            <LineChart
                data={chartData}
                width={(Dimensions.get("window").width) * 0.95}
                height={300}
                verticalLabelRotation={90}
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: "#272b34",
                    backgroundGradientFrom: "#272b34",
                    backgroundGradientTo: "#272b34",


                    propsForLabels: { fontSize: 12, dx: -15, },// Establece margin en 0 o null
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,

                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#56AF84"
                    }
                }}
                bezier
                style={{

                    marginVertical: 10,
                    borderRadius: 16,



                }}
            />
        </ScrollView>
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
export default LineGraph