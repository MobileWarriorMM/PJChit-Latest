import React, { Component, useCallback, useEffect, useState } from "react";
import {
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';
import { View, Text, Dimensions, ActivityIndicator, Image, StyleSheet, Alert, TouchableHighlight, BackHandler, Platform } from "react-native";
import FONTS from "../common_utils/fonts";
import { useSelector, useDispatch } from "react-redux";
import SnackBarUtil from "../common_utils/SnackBarUtil";
import axois from "react-native-axios"
import COLORS from "../common_utils/colors";
import Loaderactions from "../redux/loader_redux/actions";
import { generateUUID } from "../common_utils/RandomIDGen";
import joinAction from "../redux/join_scheme_redux/actions";
//import { createTable, dropTable, getDbConnection, saveChitToDb } from "../sql_helper/DatabaseHelper";
import moment from "moment";
import NetInfo from '@react-native-community/netinfo';
import TestPing from '../common_utils/pingTest'
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "../common_utils/constants";

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export default function HandlePayment({ navigation, route }) {

  const { data } = route.params
  const { UserData } = useSelector((state) => state.ProfileReducer);
  var [showPaymentModal, setShowPaymentModal] = useState(true);
  var [paymentPaid, setPaymentPaid] = useState(false);
  var [shoudRetry, setShouldRetry] = useState(false);
  var [myOrderId , setMyOrderId] = useState("")

  const dispatch = useDispatch()

  const addChitToDb = async (status, orderId) => {
    // const db = await getDbConnection();
    // //await dropTable(db);

    // const date = moment(new Date()).format('DD-MM-YYYY hh:mm a')

    // var knownData = {};

    // if (data.type === "new") {
    //   knownData = {
    //     type: 'new',
    //     due: data.data.DueDate.toString(),
    //     gold: data.data.GoldRate.toString(),
    //     silver: data.data.SilverRate.toString(),
    //     ccode: data.data.ChitCode.toString(),
    //     cname: `${data.data.ChitName.toString()}`,
    //     ctype: data.data.ChitType.toString(),
    //     ccate: data.data.ChitCategory.toString(),
    //     camt: `${data.data.ChitAmount}`,
    //     noins: data.data.NoOfInst.toString(),
    //     wei: data.data.Weight.toString(),
    //     ptot: `${data.data.PayTotal}`,
    //     ordid: orderId,
    //     itgrp: data.data.ItemGroup.toString(),
    //     doc: "none",
    //     time: date.toString(),
    //     status: status.toString(),
    //   };
    // } else {
    //   knownData = {
    //     type: 'update',
    //     due: "none",
    //     gold: "none",
    //     silver: "none",
    //     ccode: "none",
    //     cname: "none",
    //     ctype: "none",
    //     ccate: "none",
    //     camt: "none",
    //     noins: "none",
    //     wei: "none",
    //     ptot: data.payTotal.toString(),
    //     ordid: orderId,
    //     itgrp: "none",
    //     doc: data.docEntry.toString(),
    //     time: date.toString(),
    //     status: status.toString(),
    //   }
    // }

    // await createTable(db)
    // await saveChitToDb(db, knownData);
  }

  const addNewChitToApi = (orderID) => {
    dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: true } })
    const payData = {
      TransType: "M", //* - Default send "M" 
      CardCode: UserData?.cardCode, //* 
      CardName: UserData?.cardName, //* 
      Cellular: UserData?.cellular, //* 
      DueDate: data.data.DueDate, //*	CF
      GoldRate: data.data.GoldRate,//* CF
      SilverRate: data.data.SilverRate, //* CF
      ChitCode: data.data.ChitCode, //* CF
      ChitName: data.data.ChitName, //* CF
      ChitCategory: data.data.ChitCategory, //* CF
      ChitType: data.data.ChitType, //* CF
      ChitAmount: data.data.ChitAmount, //* CF
      NoOfInst: data.data.NoOfInst, //* CF
      Weight: data.data.Weight, //* CF
      PayTotal: data.data.PayTotal,  // CF //Check ->Collected Amount == CF
      CounterRef: orderID, //TransRefNo
      IssuerBank: "none",
      RefNo: 'none',
      Remarks: "none",
      ItemGroup: data.data.ItemGroup,
    };


    axois.post(`${API_URL}PJjewels/Api/Chit/ChitCreation/Save`, JSON.stringify(payData)
      , { headers: { "Content-Type": "application/json" } }).then(res => {

        if (res?.status === 200) {

          dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })

          if (res?.data?.statusCode === 200) {

            setShouldRetry(shoudRetry = false);

            //SnackBarUtil({ message: `${res?.data?.message}`, isError: false })
            dispatch({
              type: 'DIALOG_VISIBLE',
              payload: {
                visible: true,
                msg: `${res?.data?.message}`,
                title: "Alert"
              }
            })

            dispatch({
              type: 'GET_SCHEMES_DATA',
              payload: { CardCode: UserData?.cardCode }
            })

            navigation.goBack();
            navigation.goBack();

          } else {
            dispatch({
              type: 'DIALOG_VISIBLE',
              payload: {
                visible: true,
                msg: `Failed : ${res?.data?.message}`,
                title: "Alert"
              }
            })
            //SnackBarUtil({ message: `Failed : ${res?.data?.message}`, isError: true })
          }


        } else {
          dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
          dispatch({
            type: 'DIALOG_VISIBLE',
            payload: {
              visible: true,
              msg: `Error Code : ${res.status}`,
              title: "Alert"
            }
          })
          //SnackBarUtil({ message: `Error Code : ${res.status}`, isError: true })
        }

      }).catch(err => {
        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
        //SnackBarUtil({ message: `Error Code : ${err}`, isError: true })
        dispatch({
          type: 'DIALOG_VISIBLE',
          payload: {
            visible: true,
            msg: `Error Code : ${err}`,
            title: "Alert"
          }
        })
      })
  }

  const updateOldChitToApi = (orderId) => {
    dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: true } })


    const payData = {
      "TransType": "M", //* - Default send "M" 
      "DocEntry": data.docEntry,
      "PayTotal": data.payTotal,  // CF //Check ->Collected Amount == CF
      "CounterRef": orderId, //TransRefNo
      "IssuerBank": "null"
    };


    axois.put(`${API_URL}PJjewels/Api/Chit/ChitCreation/Update`, JSON.stringify(payData)
      , { headers: { "Content-Type": "application/json" } }).then(res => {

        if (res?.status === 200) {

          dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })

          if (res?.data?.statusCode === 200) {

            setShouldRetry(shoudRetry = false);

            //SnackBarUtil({ message: `${res?.data?.message}`, isError: false })
            dispatch({
              type: 'DIALOG_VISIBLE',
              payload: {
                visible: true,
                msg: `${res?.data?.message}`,
                title: "Alert"
              }
            })


            dispatch({
              type: 'GET_SCHEMES_DATA',
              payload: { CardCode: UserData?.cardCode }
            })

            navigation.goBack();

          } else {
            dispatch({
              type: 'DIALOG_VISIBLE',
              payload: {
                visible: true,
                msg: `Failed : ${res?.data?.message}`,
                title: "Alert"
              }
            })
            //SnackBarUtil({ message: `Failed : ${res?.data?.message}`, isError: true })
          }


        } else {
          dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
          dispatch({
            type: 'DIALOG_VISIBLE',
            payload: {
              visible: true,
              msg: `Error Code : ${res.status}`,
              title: "Alert"
            }
          })
          //SnackBarUtil({ message: `Error Code : ${res.status}`, isError: true })
        }

      }).catch(err => {
        dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: false } })
        //SnackBarUtil({ message: `Error Code : ${err}`, isError: true })
        dispatch({
          type: 'DIALOG_VISIBLE',
          payload: {
            visible: true,
            msg: `Error Code : ${err}`,
            title: "Alert"
          }
        })
      })
  }

  const handleJoinScheme = (orderID) => {
    dispatch({
      type: joinAction.SAVE_THE_SCHEME,
      payload: {
        CardCode: UserData?.cardCode,
        data: {
          TransType: "M", //* - Default send "M" 
          CardCode: UserData?.cardCode, //* 
          CardName: UserData?.cardName, //* 
          Cellular: UserData?.cellular, //* 
          DueDate: data.data.DueDate, //*	CF
          GoldRate: data.data.GoldRate,//* CF
          SilverRate: data.data.SilverRate, //* CF
          ChitCode: data.data.ChitCode, //* CF
          ChitName: data.data.ChitName, //* CF
          ChitCategory: data.data.ChitCategory, //* CF
          ChitType: data.data.ChitType, //* CF
          ChitAmount: data.data.ChitAmount, //* CF
          NoOfInst: data.data.NoOfInst, //* CF
          Weight: data.data.Weight, //* CF
          PayTotal: data.data.PayTotal,  // CF //Check ->Collected Amount == CF
          CounterRef: orderID, //TransRefNo
          IssuerBank: "none",
          RefNo: 'none',
          Remarks: "none",
          ItemGroup: data.data.ItemGroup,
        }
      }
    }),
      navigation.goBack();
    navigation.goBack();
  }


  const mainHandler = (orderID) => {
    switch (data.type) {
      case "new":
        return addNewChitToApi(orderID);
      case "update":
        return updateOldChitToApi(orderID);
      default:
        return null;
    }
  }

  useFocusEffect(
    useCallback(() => {

      const handleBackAction = () => {
        Alert.alert("Wait!", "Are you sure you want to go back?", [
          {
            text: "CLOSE",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => navigation.goBack() }
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackAction);

      return () => {
        //clearInterval(progressInterval)
        BackHandler.removeEventListener("hardwareBackPress", handleBackAction);
      };
    }, [])
  );

  useEffect(() => {

    createTheOrder(data.amount);
    // handlePaymentGateway(
    //   "session_WPTwjccPQgToGszGKDaLMRlAXi_o5IRufShx1sZLprhNDsjNNkCghQOERe2XO4xL3VAdcBNBe5kUm9o5At_PsNf8Mr11djf-H4Zp0wlgtOBg",
    //   "ordidpj_fICEq"
    // );

    //navigation.navigate("PaymnetWebView", { paymentLink: "https://payments.cashfree.com/order/#I0ZY9Y21xXO3HIbCNxO0" });

    CFPaymentGatewayService.setCallback({
      onVerify(orderID) {
        setPaymentPaid(true);
        setMyOrderId(myOrderId = orderID);
        //SnackBarUtil({ message: "PAYMENT SUCCESS!", isError: false })
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            mainHandler(orderID);
          } else {
            //addChitToDb("paid", orderID);
            setShouldRetry(shoudRetry = true);
          }
        })
      },
      onError(err) {
        setPaymentPaid(false);
        navigation.goBack();
        SnackBarUtil({ message: err?.message?.toString().toUpperCase(), isError: true })
        //navigation.goBack()
      }
    });

  }, [CFPaymentGatewayService])

  useEffect(() => {
    return () => {
      CFPaymentGatewayService.removeCallback();
    }
  })

  const handleUpdateScheme = (orderId) => {

    var updatableData = {
      "TransType": "M", //* - Default send "M" 
      "DocEntry": data.docEntry,
      "PayTotal": data.payTotal,  // CF //Check ->Collected Amount == CF
      "CounterRef": orderId, //TransRefNo
      "IssuerBank": "null"
    }

    dispatch({
      type: joinAction.UPDATE_THE_SCHEME,
      payload: { data: updatableData, CardCode: UserData?.cardCode }
    })

    navigation.goBack();
  }

  const createTheOrder = async (amount) => {
    //dispatch({ type: Loaderactions.LOADER_VISIBLE, payload: { visible: true } })

    //cc, dc, ccc, ppc, paypal, emi
    //"payment_methods":"cc, dc, ccc, ppc, paypal, emi"

    var emailOfUser = 'test@gmail.com';

    if(UserData?.email !== undefined && UserData?.email !== null) {
      emailOfUser = UserData?.email;
    }else {
      emailOfUser = UserData?.payment_Email ?? 'test@gmail.com';
    }


    const item = {
      'order_amount': `${amount}`,
      'order_id': `ordidpj_${generateUUID(8)}`,
      'order_currency': "INR",
      'customer_details': {
        'customer_id': `${UserData?.cardCode}`,
        'customer_name': `${UserData?.cardName}`,
        'customer_email': `${emailOfUser}`,
        'customer_phone': `${UserData?.cellular}`
      },
      'order_note': "PJ Jewels Payment"
    }

    try {

      //"x-client-id":`${UserData?.payment_AppId}`,
      //"x-client-secret":`${UserData?.payment_SecretKey}`, ${UserData.payment_URL}/orders ${UserData?.payment_APIVersion}

      const response = await fetch(`${UserData.payment_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-version":`2022-09-01`,
          "x-client-id": `${UserData?.payment_AppId}`,
          "x-client-secret": `${UserData?.payment_SecretKey}`,
          "x-request-id": 'com.pjchit'
        },
        body: JSON.stringify(item)
      });

      if (response.status === 200) {
        const resData = await response.json();
        //navigation.goBack();
        if(resData?.payment_session_id === undefined) {
          navigation.goBack();
          SnackBarUtil({message:"Invalid Session Id",isError:true});
        } else {
          handlePaymentGateway(resData?.payment_session_id, resData?.order_id);
        }
        //navigation.navigate("PaymnetWebView",{paymentLink:""});
      } else {
        navigation.goBack();
        const resData = await response.json();
        SnackBarUtil({
          message: "Order creation failed " + `${response.status}`,
          isError: true
        })
      }

    } catch (err) {
      navigation.goBack();
      SnackBarUtil({
        message: `Order creation failed ${e}`,
        isError: true
      })
    }
  }

  function handlePaymentGateway(orderToken, orderId) {
    //PRODUCTION SANDBOX
    try {
      const session = {
        "payment_session_id": orderToken,
        "orderID": orderId,
        "environment": `${UserData.payment_Environment}`
      };
      CFPaymentGatewayService.doWebPayment(JSON.stringify(session));
    } catch (e) {
      SnackBarUtil({ message: 'Error Accurred', isError: true })
    }
  }

  return (
    <View style={styles.mainView}>
      <Text style={styles.titleText}>Processing payment...</Text>
      <Image
        source={require('../../assets/images/payment.gif')}
        style={styles.imgStyle}
      />
      <Text style={styles.warningText}> * Please do not go back or close the App!</Text>
      {
        paymentPaid && shoudRetry ?
          <TouchableHighlight
            underlayColor={'#ddd'}
            style={{ width: width - 150, alignSelf: 'center' }}
            onPress={() => {
              if(myOrderId !== "") {
                NetInfo.fetch().then(state => {
                  if (state.isConnected) {
                    mainHandler(myOrderId);
                  } else {
                    //addChitToDb("paid", orderID);
                    setShouldRetry(shoudRetry = true);
                  }
                })
              }
            }}>
            <Text style={styles.warningText}>CLICK TO RETRY!</Text>
          </TouchableHighlight> : <></>
      }
      <View style={{ flex: 1 }} />
      {/* <ActivityIndicator size={50} color={COLORS.BACKGROUND_G} style={{ alignSelf: 'center' }} /> */}
    </View>
  )

}

const styles = StyleSheet.create({
  warningText: {
    color: 'red',
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: height * 0.02,
    alignSelf: 'center',
    marginTop: 10
  },
  mainView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 10,
  },
  imgStyle: {
    height: height * 0.45,
    width: width - 20,
    alignSelf: 'center',
    borderRadius: 10
  },
  titleText: {
    color: '#000',
    fontFamily: FONTS.FONT_SEMIMODAL,
    fontSize: height * 0.025,
    alignSelf: 'center',
  }
});