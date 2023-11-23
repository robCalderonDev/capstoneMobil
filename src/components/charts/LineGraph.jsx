import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

const LineGraph = ({ chartData }) => {
    return (
        <View >
            <LineChart

                data={chartData}
                width={(Dimensions.get("window").width) * 0.95} // from react-native
                height={220}



                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#272b34",
                    backgroundGradientFrom: "#272b34",
                    backgroundGradientTo: "#272b34",
                    propsForLabels: { fontSize: 12, },
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#56AF84"
                    }
                }}
                bezier//para que sea efecto smooth
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
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
export default LineGraph