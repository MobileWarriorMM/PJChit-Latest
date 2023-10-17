import React, { useCallback, useEffect, useState } from 'react';
import {
    View, Text, SafeAreaView, Dimensions, TouchableHighlight, StyleSheet,
    Modal, Pressable, Image, ScrollView, Alert,
} from 'react-native';
import AppBar from '../screens/Appbar'
import FONTS from '../common_utils/fonts';
import COLORS from '../common_utils/colors';
//import { createTable, deleteItem, getChitData, getDbConnection, saveChitToDb } from '../sql_helper/DatabaseHelper';
import { useDispatch , useSelector } from 'react-redux';
import axois from "react-native-axios"
import MatiIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SnackBarUtil from '../common_utils/SnackBarUtil';


let media = Dimensions.get('window')

export default function TransactionsList({ navigation }) {

    return(
        <View>
            
        </View>
    )

    // var [data, setData] = useState([]);
    // const dispatch = useDispatch();
    // const { UserData } = useSelector((state) => state.ProfileReducer);
    // const { schemeListData } = useSelector((state) => state.HomeScreenReducer);

    // const handleGetDataFromDb = async () => {
    //     try {
    //         const db = await getDbConnection();
    //         const dummy = await getChitData(db);
    //         setData(dummy.reverse())
    //     } catch (e) {
    //     }
    // }

    // const deleteData = async (id) => {
    //     const db = await getDbConnection();
    //     await deleteItem(db , id)
    //     handleGetDataFromDb()
    // }


    // const getOrderDetails = (id) => {

    //     dispatch({
    //         type:"LOADER_VISIBLE",
    //         payload:{ visible: true }
    //     })

    //     try{
    //         axois.get(`${UserData.payment_URL}/orders/${id}`,{headers:{
    //             "Content-Type":"application/json",
    //             "x-api-version":"2022-09-01",
    //             "x-client-id": `${UserData?.payment_AppId}`,
    //             "x-client-secret": `${UserData?.payment_SecretKey}`,
    //         }}).then(res => {
    //             dispatch({
    //                 type:"LOADER_VISIBLE",
    //                 payload:{ visible: false }
    //             })
    //             Alert.alert("Payment status","Status : "+res?.data?.order_status)
    //         }).catch(e=>{
    //             dispatch({
    //                 type:"LOADER_VISIBLE",
    //                 payload:{ visible: false }
    //             })
    //         })

    //     }catch(e){
    //         dispatch({
    //             type:"LOADER_VISIBLE",
    //             payload:{ visible: false }
    //         })
    //     }

    // }


    // useEffect(() => {
    //     handleGetDataFromDb();
    // }, [])

    // return (
    //     <View style={styles.mainView}>

    //         {/* app bar */}
    //         <AppBar title={"Transactions"} />

    //         <View style={styles.subView}>

    //             {
    //             data.length === 0?
    //             <View style={{flex:1,justifyContent:'center'}}>
    //                 <Text style={{
    //                    color:COLORS.DARK_BLUE,
    //                    fontSize:media.height*0.023,
    //                    fontFamily:FONTS.FONT_SEMIMODAL,
    //                    alignSelf:'center' 
    //                 }}>No Data Found!</Text>
    //             </View>:   
    //             <ScrollView>
    //                 {
    //                     data.map((e, i) => {
    //                         return (
    //                             <TouchableHighlight key={i}
    //                                 underlayColor={"#ddd"}
    //                                 onLongPress={() => {
    //                                     Alert.alert(
    //                                         "Delete",
    //                                         "Do you want to delete this data?",
    //                                         [
    //                                             {
    //                                                 text: 'CANCEL',
    //                                                 onPress: () => console.log('Ask me later pressed'),
    //                                             },
    //                                             {
    //                                                 text: 'DELETE',
    //                                                 onPress: () => deleteData(e.id),
    //                                             },
    //                                         ]
    //                                     )
    //                                 }}
    //                                 onPress={() => {
    //                                     //getOrderDetails("ordidpj_fICEq")

    //                                     const list = schemeListData;

    //                                     if(list.findIndex((e=>e.chitCode === "G1390")) !== -1){
    //                                         SnackBarUtil({
    //                                             message:"Chit alreay exists",
    //                                             isError:false
    //                                         })
    //                                     }else{
    //                                         Alert.alert(
    //                                             "Create Chit",
    //                                             "Chit amount is already paid , click continue to create the chit manually",
    //                                             [
    //                                                 {
    //                                                     text: 'CANCEL',
    //                                                     onPress: () => console.log('Ask me later pressed'),
    //                                                 },
    //                                                 {
    //                                                     text: 'CONTINUE',
    //                                                     onPress: () => console.log('Continue'),
    //                                                 },
    //                                             ]
    //                                         )
    //                                     }
    //                                 }}
    //                             >
    //                                 <View style={styles.listTile}>
    //                                     <MatiIcons name='information-outline' color={"grey"} size={media.height*0.04}
    //                                     style={{marginRight:10}}/>
    //                                     <View style={styles.listTileSub}>
    //                                         <Text style={styles.textDate}>{e.chitname}</Text>
    //                                         <Text style={styles.textChit}>{e.created}</Text>
    //                                     </View>
    //                                     <Text style={styles.textAmt}>Rs.{e.total} | </Text>
    //                                     <Text style={styles.textStatus}>{e.status}</Text>
    //                                 </View>
    //                             </TouchableHighlight>
    //                         )
    //                     })
    //                 }
    //             </ScrollView>
    //             }

    //         </View>

    //     </View>
    // )

}

const styles = StyleSheet.create({
    mainView: {
        height: "100%",
        width: "100%",
        backgroundColor: 'yellow',
        flexDirection: 'column'
    },
    subView: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white'
    },
    listTile: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: media.width - 20,
        padding: 12,
        alignSelf: 'center',
        marginVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5
    },
    listTileSub: {
        flexDirection: 'column',
        flex: 1
    },
    textDate: {
        fontSize: media.height * 0.017,
        fontFamily: FONTS.FONT_BOLD,
        color: COLORS.DARK_BLUE
    },
    textChit: {
        fontSize: media.height * 0.017,
        fontFamily: FONTS.FONT_REGULAR,
        color: COLORS.DARK_BLUE
    },
    textAmt: {
        fontSize: media.height * 0.02,
        color: COLORS.DARK_BLUE,
        fontWeight: 'bold'
    },
    textStatus: {
        fontSize: media.height * 0.015,
        color: 'red',
        fontFamily: FONTS.FONT_REGULAR
    }
})