import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Pressable, TouchableHighlight, Animated, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Arrow from 'react-native-vector-icons/Entypo';
import Person from 'react-native-vector-icons/Feather';
import Accordion from 'react-native-collapsible/Accordion';
import AppBar from '../Appbar';
import COLORS from '../../common_utils/colors';
import FONTS from '../../common_utils/fonts';
import Bottomimg from '../../../assets/images/bottom-img.svg';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../redux/Faq/action';
import {fontScaleOfDevice} from '../../common_utils/constants'

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

const CONTENT = [
  {
    index: '1',
    title: ' What is Digital Gold?',
    content:
      'Digital Gold is the modern way of buying Gold through online channels without physically holding Gold.So if you are looking to purchase Gold, it is a more convenient, safe and cost-effective option.'
  },
  {
    index: '2',
    title: 'How much tax do I have to pay on the sale of Digital Gold?',
    content:
      'Any earnings from the sale of your Gold assets (which could include gold jewellery, digital gold, or coins) within three years of the date of purchase will be deemed Short-Term Capital Gains (STCG).It will essentially be added to your annual income, and you will be required to pay tax on the highest income tax bracket in which your income falls.'
  },
  {
    index: '3',
    title: 'What is the purity of gold?',
    content:
      'Safegold offers 24 Karat Gold of 995 purity (99.5% pure).'
  },
  {
    index: '4',
    title: 'How can I pay for Digital Gold?',
    content:
      'You can use Credit and Debit Cards, Net banking and UPI to buy Digital Gold.'
  },
  {
    index: '5',
    title: 'What is the purity of gold?',
    content:
      'Safegold offers 24 Karat Gold of 995 purity (99.5% pure).'
  },
];

const ExpandableView = ({ expanded = false ,item}) => {
  const [height] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(height, {
      toValue: !expanded ? 200 : 0,
      duration: 150,
      useNativeDriver: false
    }).start();
  }, [expanded, height]);


  return (
    <Animated.View>
      {
        item?.answer?.map((item)=>(
         <Text>{item}</Text>
        ))
      }

    </Animated.View>
  );
};

export default function FAQScreen({ navigation }) {

  const [activeSections, setActiveSections] = useState([]);
  const [multipleSelect, setMultipleSelect] = useState(true);
  const { color } = useSelector((state) => state.ColorThemeReducer);

  const dispatch = useDispatch()
  const { FaqList } = useSelector((state) => state.FAQReducer)

  var [SelectedList,setSelectedList]=useState([])

  var[currentIndex,setCurrentIndex]=useState(null)
  
  const setSections = (sections) => {
    setActiveSections(
      sections.includes(undefined) ? [] : sections
    );
  };

  useEffect(() => {
    dispatch({
      type: actions.GET_FAQ
    })
  }, [])


  const renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={10}
        style={
          isActive ? styles.active : styles.inactive
        }
        transition="backgroundColor">

        <View style={styles.headerText}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.circle}>
              <Text style={{ fontFamily: 'Poppins-Regular', color: 'black' }}>{section.index}</Text>
            </View>
            <Text style={styles.title}>   {section?.title}  </Text>
          </View>
          {isActive ? <Arrow name='chevron-up' size={20} color={'black'} /> : <Arrow name='chevron-down' size={20} color={'black'} />}
        </View>
        <View style={styles.divider} />


      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[
          styles.content,
          isActive ? styles.active : styles.inactive
        ]}
        transition="backgroundColor">
        <Animatable.Text
          animation={isActive ? 'bounceIn' : undefined}
          style={{ color: 'black' }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };
  const [isExpanded, setIsExpanded] = useState(false);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar navigation={navigation} title='FAQ' />

      <View style={{ backgroundColor: color.mainColor, height: height,}}>

        <View style={styles.subcontainer}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
              <Text style={{ color: 'black', fontSize: 22,fontFamily:FONTS.FONT_BOLD}}> FAQ</Text>

            </View>

            {/* <View style={{ marginHorizontal: 20 }}>
              <Accordion
                activeSections={activeSections}
                sections={CONTENT}
                touchableComponent={TouchableOpacity}
                expandMultiple={multipleSelect}
                renderHeader={renderHeader}
                renderContent={renderContent}
                duration={100}
                onChange={setSections}
              />
            </View> */}

            {
              FaqList?.map((item, index) => (
                <View key={index} style={{ marginHorizontal: 15 }}>
                  <TouchableOpacity
                    onPress={() => {
                      // setIsExpanded(!isExpanded);
                      setCurrentIndex(index === currentIndex ?null :index)
                    }}
                  >

                  <View style={styles.headerText}>
                    <View style={{ flexDirection: 'row',}}>
                      <View style={styles.circle}>
                        <Text style={{ fontFamily: 'Poppins-Regular', color: 'black' }}>{
                          (index === 0) ? '1' : (index + 1)
                        }</Text>
                      </View>
                      <Text style={styles.title}>{item?.question}</Text>
                    </View>
                    {
                      (index === currentIndex)?
                      <Arrow name='chevron-up' size={20} color={'black'} /> : <Arrow name='chevron-down' size={20} color={'black'} />
                    }
                  </View>   

                  </TouchableOpacity>
                  {/* <ExpandableView expanded={isExpanded} item={item}/> */}

                  {
                    index === currentIndex?
                    item?.answer?.map((item,index)=>(
                      <Text style={{
                        color:'grey',
                        fontFamily:FONTS.FONT_REGULAR,
                        margin:8,
                        fontSize:(width*0.04)/fontScaleOfDevice
                      }} key={index}>{item}</Text>
                      ))
                      :<View/>
                  }
                  <View style={styles.divider} />
                </View>
              ))
            }
          <View style={{height:height*0.05}}/>

          </ScrollView>
          <Bottomimg style={{alignSelf: 'center', bottom: -10 ,zIndex:-10 , position:'absolute'}} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subcontainer: {
    width: width,
    height: height*0.89,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop:30,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignItems:'center'
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: FONTS.FONT_REGULAR,
    color: 'black'
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
    color: 'black'
  },
  inactive: {
    backgroundColor: 'white',
    color: 'black'
  },
  circle: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginVertical: 10,
  },
  title: {
    width: width * 0.7,
    color: 'black',
    marginLeft: 5,
    alignContent: 'flex-start',
    fontFamily: FONTS.FONT_REGULAR,
    fontSize:(width*0.04)/fontScaleOfDevice
  },
  app: {},
  toggle: {
    width: 100,
    height: 30,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center"
  },
  toggleText: {
    color: "#fff"
  }
});
