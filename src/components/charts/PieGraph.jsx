import React from 'react'
import { Dimensions, View } from 'react-native'
import { PieChart } from 'react-native-chart-kit'

const PieGraph = ({ chartDataPie }) => {
    return (
        <View>
            <PieChart
                data={chartDataPie}
                width={(Dimensions.get("window").width) * 0.95}
                height={220}

                chartConfig={{

                    backgroundColor: "#272b34",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                absolute
                style={{

                    marginVertical: 8,
                    borderRadius: 16,
                    backgroundColor: '#272b34'

                }}
            />
        </View>
    )
}

export default PieGraph