import { Modal, View, Pressable, TouchableHighlight ,Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { LineChart } from "react-native-chart-kit";
import COLORS from "./colors";

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

var chartConfig = {
    backgroundColor: "#fcfaf8",
    backgroundGradientFrom: "#fcfaf8",
    backgroundGradientTo: "#fcfaf8",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `#ffa726`,
    labelColor: (opacity = 1) => COLORS.DARK_BLUE,
    propsForDots: {
        r: "5",
        strokeWidth: "1",
        stroke: "#ffa726",
        backgroundColor: 'green',
        color: 'green'
    }
}

const GraphModal = () => {

    
    const { graphData } = useSelector((state) => state.SchemeDetailsReducer);
    const dispatch = useDispatch();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const data  = graphData?.data
    const visible = graphData?.visible

    var month = [""]
    var weight = [0]

    data?.forEach((e) => {
        month.push(months[parseInt(e?.date.toString().split("/")[0]) - 1])
    })

    data.forEach((e) => {
        weight.push(e?.weight)
    })

    var gData = {
        labels: month,
        datasets: [
            {
                data: weight,
                color: (opacity = 1) => `rgba(35, 182, 46, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["CHIT"] //
    }

    return (
        <Modal
            visible={graphData?.visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
                dispatch({
                    type: 'SET_SCHEME_GRAPH',
                    payload: {
                        visible: false,
                        data: []
                    }
                })
            }}
        >

            <Pressable onPress={() => {
                dispatch({
                    type: 'SET_SCHEME_GRAPH',
                    payload: {
                        visible: false,
                        data: []
                    }
                })
            }}
                style={{
                    backgroundColor: "#000000",
                    opacity: 0.3,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", padding: 20 }} >

                
                <View style={{
                    flexDirection: 'column',
                    padding: 15,
                    marginHorizontal: 10,
                }}>

                    <LineChart
                        data={gData}
                        onDataPointClick={(e) => {
                        }}
                        style={{
                            borderRadius: 15,
                            alignSelf: 'center',
                            marginTop: 10,
                            borderColor: COLORS.BACKGROUND_O,
                            borderWidth: 0.8
                        }}
                        width={width - 40}
                        height={height * 0.25}
                        chartConfig={chartConfig}
                    />

                    <TouchableHighlight
                        onPress={() => dispatch({
                            type: 'SET_SCHEME_GRAPH',
                            payload: {
                                visible: false,
                                data: []
                            }
                        })}
                        underlayColor="transparent"
                        style={{
                            alignSelf: 'flex-end',
                            position: 'absolute',
                            right: 10,
                            top: 12
                        }}
                    >
                        <FAIcon name="close" size={30} color="red" />
                    </TouchableHighlight>

                </View>

            </View>

        </Modal>
    )

}

export default GraphModal;