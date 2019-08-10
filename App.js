import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,TouchableWithoutFeedback,Alert  } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';




const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      monitors: [],
      selectedMonitor:null  
    };
  }

  tabla() {
    this.setState({ monitors:[],selectedMonitor:null })
    fetch('https://api.ivanonline.org/v1/air/data')
            .then(res =>res.json())
            .then((moni) => {
              
              
              moni.data.data.forEach(screen => {
                var col;
                if(!screen.caql.current){
                  console.log("No tengo daatos");
                  col='#050505';
                }else{
                  col=screen.caql.current.color;
                }
                let data= {
                  monitorId:screen.monitorId,
                  city:screen.city,
                  address:screen.address,
                  place: screen.place,
                  location:{latitud:screen.location.latitude, longitud:screen.location.longitude},
                  color:col
                }
                this.setState({ monitors: this.state.monitors.concat([data]),selectedMonitor:null })
              });
            })
            .catch(console.log)
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#607D8B",
        }}
      />
    );
  }
  GetItem (item) {
   
    Alert.alert(`Detalle monitor id: ${item.monitorId}
      ciudad: ${item.city}
      dirreción: ${item.address}
      Lugar: ${item.place}
      Localización-latitud: ${item.location.latitud}
      Localización-longitud: ${item.location.longitud}
      `);
  
    }
    componentDidMount() {
        this.tabla();
        this.interval = setInterval(() => {
          // asigno para que se repita cada 5 minutos
          this.tabla();
        }, 300000);
    }
  render() {
    return (
      
      <View style={styles.container}>
        <Text style={styles.welcome}>Monitores</Text>
        <FlatList 
        data={this.state.monitors}
        ItemSeparatorComponent = {this.FlatListItemSeparator}
        renderItem={
          
          ({item}) => <Text style={{padding: 10,
            fontSize: 18,
            height: 44,color: item.color}} onPress={ this.GetItem.bind(this, item)} >{item.monitorId} -- {item.city} -- {item.address} </Text>
         
          }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   paddingTop: 22,
   backgroundColor: '#ffffff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
