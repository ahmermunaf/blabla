/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Image ,Dimensions, StatusBar, Modal, ScrollView } from 'react-native'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Segment, Content, Text, View,Input, Item, List, ListItem } from 'native-base';
import Voice from 'react-native-voice';
import { RNCamera } from 'react-native-camera';
import Iconn from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'react-native-fetch-blob'
import axios from 'axios'
import { Actions } from 'react-native-router-flux';
import RNTextDetector from "react-native-text-detector";
var HEIGHT = Dimensions.get('window').height
var WIDTH = Dimensions.get('window').width

type Props = {};
export default class Home extends Component<Props> {
  constructor(){
    super();
    this.state={
      voiceSeg:false,
      randomSeg:false,
      bookSeg:true,
      dataToSearch:'',
      books:[],
      keys:[],
      mode:(Dimensions.get('window').width<Dimensions.get('window').height) ? 'portrait':'landscape',
      flashName:'flash-off',
      flashFlag:'off',
      flashValue: RNCamera.Constants.FlashMode.off,
      cameraMode:'back',
      modalVisible: false,
      base64:'',
      isRecording:false,
      captureData:[]
    }
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
  }

  setModalVisible(visible,type = '') {
    this.setState({
      modalVisible: visible,
      modalType:type
    });
  }

  componentWillMount(){
    Dimensions.addEventListener('change',(data)=>{
      this.setState({mode:(data.window.width<data.window.height) ? 'portrait':'landscape'})
    })
  }
  componentWillUnmount(){
    Dimensions.removeEventListener('change',(data)=>{
      this.setState({mode:(data.window.width<data.window.height) ? 'portrait':'landscape'})
    })
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    // this.setState({
    //   started: '√',
    // });
    console.log(e,'  started')
  }

  onButtonPress(e){
    this.setState({
      isRecording:!this.state.isRecording
    },()=>{
      if(this.state.isRecording === true){
        this._startRecognizing(e)
      }
      else{
        this._destroyRecognizer(e)
      }
    })
  }

  onSpeechRecognized(e) {
    // this.setState({
    //   recognized: '√',
    // });
    console.log(e,' recognized')
  }

  onSpeechEnd(e) {
    // this.setState({
    //   end: '√',
    // });
    console.log(e,'  Ended')
  }

  onSpeechError(e) {
    // this.setState({
    //   error: JSON.stringify(e.error),
    // });
    console.log(e,'  erre')
  }

  onSpeechResults(e) {
    // this.setState({
    //   results: e.value,
    // });
    console.log(e.value,'  result')
  }

  onSpeechPartialResults(e) {
    this.setState({
      dataToSearch: e.value[0],
    });
    console.log(e.value,'   par result')
  }

  onSpeechVolumeChanged(e) {
    // this.setState({
    //   pitch: e.value,
    // });
    // console.log(e,'  vol changed')
  }

  _startRecognizing(e) {
    console.log('start')
    try {
      Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
  }

  toSearch(){
    axios.post('https://bahria-server.herokuapp.com/gettingdata',{
      text:this.state.dataToSearch.toLowerCase()
    })
    .then((res)=>{
      if(res.data.status === '200'){
        if(res.data.data.length == 0){
          alert('No rresult found.')
        }
        else{
          Actions.results({data:res.data.data})
        }
      }
      else{
        alert('Something went wrong')
      }
    })
    .catch((err)=>{
      alert(JSON.stringify(err))
    })
  }

  render() {
    StatusBar.setBackgroundColor('#444444')
    return (
      <Container>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={{flex:1,width:WIDTH,height:HEIGHT}}>
          {
            (this.state.modalType === 'camera') ? 
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              type={this.state.cameraMode}
              style={(this.state.mode == 'portrait') ?{flex:1,flexDirection:'row'}:{flex:1,flexDirection:'column'}}
              torchMode={this.state.flashValue}
              b
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              // onGoogleVisionBarcodesDetected={({ barcodes }) => {
              //   console.log(barcodes)
              // }}
              >
                  <Button transparent 
                  style={(this.state.mode == 'portrait') ? {
                        display:'flex',
                        flex:1,
                        top:'150%',
                        height:50,
                        flexDirection:'column',
                        justifyContent:'center',
                        
                      }:{
                        display:'flex',
                        flex:1,
                        left:'170%',
                        flexDirection:'row-reverse',
                        justifyContent:'center',
                        
                      }}
                  onPress={()=>{
                    if(this.state.cameraMode === 'back'){
                    if(this.state.flashFlag === 'on'){
                      this.setState({flashFlag:'off',flashName:'flash-off',flashValue: RNCamera.Constants.FlashMode.off})
                    }
                    else if(this.state.flashFlag === 'off'){
                      this.setState({flashName:'flash',flashFlag:'on',flashValue: RNCamera.Constants.FlashMode.on})
                    }}
                    }}>
                    <Iconn name={this.state.flashName} size={50} />
                  </Button>
                  <Button
                    transparent
                    style={(this.state.mode == 'portrait') ? {
                        display:'flex',
                        flex:1,
                        height:70,
                        flexDirection:'column',
                        top:'145%',
                        justifyContent:'center',
                        
                      }:{
                        display:'flex',
                        left:'165%',
                        flex:1,
                        flexDirection:'row-reverse',
                        justifyContent:'center',
                        
                      }}
                    onPress={this.detectText.bind(this)}
                    >
                    <Iconn name="circle" size={70} style={{color:'#619bf9'}}/>
                  </Button>
                  <Button transparent
                  // onPress={()=>{
                  //   this.setState({flashFlag:'off',flashName:'flash-off'})
                  //   if(this.state.cameraMode === 'front'){
                  //     this.setState({cameraMode:'back'})
                  //   }
                  //   else if(this.state.cameraMode === 'back'){
                  //     this.setState({cameraMode:'front'})
                  //   }
                  // }}
                  style={(this.state.mode == 'portrait') ? {
                        display:'flex',
                        flex:1,
                        height:50,
                        flexDirection:'column',
                        top:'150%',
                        justifyContent:'center',
                        
                      }:{
                        display:'flex',
                        flex:1,
                        left:'170%',
                        flexDirection:'row-reverse',
                        justifyContent:'center',
                        
                      }}
                  >
                    {/* <Iconn name='camera-front' size={50} /> */}
                  </Button>
            </RNCamera>:
            (this.state.modalType === 'barcode') ? 
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              type={this.state.cameraMode}
              style={(this.state.mode == 'portrait') ?{flex:1,flexDirection:'row'}:{flex:1,flexDirection:'column'}}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              onGoogleVisionBarcodesDetected={({ barcodes }) => {
                // console.log(barcodes[0].data)
                this.setState({
                  dataToSearch:barcodes[0].data
                },()=>{
                  this.toSearch()
                })
                this.setModalVisible(false,'')
              }}
              >
            </RNCamera>:
            <View>
              <List>
                <ScrollView>
                  {
                    this.state.captureData.map((data,ind)=>(
                        <ListItem key={ind} onPress={()=>{
                          this.setState({
                            dataToSearch:data.text
                          })
                          this.setModalVisible(false,'')
                        }} >
                          <Left>
                            <Text>{data.text}</Text>
                          </Left>
                          <Right>
                            <Icon name="arrow-forward" />
                          </Right>
                        </ListItem>
                    ))
                  }
                </ScrollView>
              </List>
            </View>
          }
        </View>
        </Modal>
         <StatusBar
            backgroundColor="#444444"
            barStyle="light-content"
          />
        {/* <Header hasTabs>
          <Left />
          <Body>
            <Title>Library App</Title>
          </Body>
          <Right />
        </Header>
        <Segment>
          <Button first active={this.state.bookSeg} onPress={()=>{this.setState({bookSeg:true,randomSeg:false,voiceSeg:false})}} >
            <Text style={{fontSize:9.5}}>Book Search</Text>
          </Button>
          <Button active={this.state.randomSeg} onPress={()=>{this.setState({bookSeg:false,randomSeg:true,voiceSeg:false})}} >
            <Text style={{fontSize:9.5}}>Random Search</Text>
          </Button>
          <Button last active={this.state.voiceSeg} onPress={()=>{this.setState({bookSeg:false,randomSeg:false,voiceSeg:true})}} >
            <Text style={{fontSize:9.5}}>Voice Search</Text>
          </Button>
        </Segment>
          {
            (this.state.bookSeg) ? <BookSearch />:(this.state.randomSeg) ? <RandomSearch />:<VoiceSearch />
          
          }       */}

          <Header style={{height:0}}>
          </Header>
          <Content style={{height:HEIGHT}} >
            <Image source={require('./../assets/headerimage.jpg')} style={{width:WIDTH,height:HEIGHT/3}} />
            <Text style={{color:'#424242',textAlign:'center',fontSize:20,marginTop:20}}>Choose Searching Criteria</Text>
            <View style={{flexDirection:'row',alignContent:'center',marginTop:40,width:WIDTH,alignItems:'center',justifyContent:'center'}} >
              <Button style={{backgroundColor:'#ef4136',width:'90%'}} onPress={()=>{
                axios.post('https://bahria-server.herokuapp.com/gettingallbooks')
                .then((res)=>{
                  if(res.data.status === '200'){
                    if(res.data.data.length == 0){
                      alert('No Book found.')
                    }
                    else{
                      Actions.results({data:res.data.data})
                    }
                  }
                  else{
                    alert('Something went wrong')
                  }
                })
                .catch((err)=>{
                  alert(JSON.stringify(err))
                })
              }} >
                <Text style={{textAlign:'center',width:'100%'}}>Display All</Text>
              </Button>
            </View>
            <View style={{width:WIDTH,flexDirection:'row',alignContent:'center',alignItems:'center',justifyContent:'center',marginTop:20}}>
              <Button 
              onPressIn={(e)=>{
                console.log('asd')
                this._startRecognizing(e)
              }}
              onPressOut={this._stopRecognizing.bind(this)} 
              // onPress={(e)=>{
              //   this.onButtonPress(e)
              // }}
              style={{borderRadius:(this.state.isRecording) ? 150:100,backgroundColor:'#1b252e',height:(this.state.isRecording) ? 150:100,width:(this.state.isRecording) ? 150:100,marginLeft:15,marginRight:15}} >
                <Icon name='md-mic' style={{color:'#fff',marginLeft:(this.state.isRecording) ? '40%':'34%',fontSize:50,textAlign:'center'}} />
              </Button>
              <Button onPress={()=>{this.setModalVisible(true,'camera');}} style={{borderRadius:100,backgroundColor:'#1b252e',height:100,width:100,marginLeft:15,marginRight:15}} >
                <Icon name='camera' style={{color:'#fff',marginLeft:'28%',fontSize:50}} />
              </Button>
              <Button onPress={()=>{this.setModalVisible(true,'barcode');}} style={{borderRadius:100,backgroundColor:'#1b252e',height:100,width:100,marginLeft:15,marginRight:15}} >
                <Icon name='md-barcode' style={{color:'#fff',marginLeft:'28%',fontSize:50}} />
              </Button>
            </View>
            <View style={{width:WIDTH,alignItems:'center',alignContent:'center',justifyContent:'center',marginTop:20}}>
              <Input style={{width:'90%',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#c4c4c4'}} value={this.state.dataToSearch} onChangeText={(text)=>{
                this.setState({
                  dataToSearch:text
                })
              }}  />
              <Button style={{backgroundColor:'#ef4136',alignSelf:'center',marginTop:15}} onPress={this.toSearch.bind(this)} >
                <Text style={{color:'#fff',textAlign:'center',alignSelf:'center'}}>Search</Text>
              </Button>
            </View>
          </Content>
      </Container>
    );
  }

  detectText = async () => {
    try {
      const options = {
        quality: 0.8,
        base64: true,
        fixOrientation:true,
        skipProcessing: true,
      };
      const { uri } = await this.camera.takePictureAsync(options);
      const visionResp = await RNTextDetector.detectFromUri(uri);
      console.log('visionResp', visionResp);
      this.setState({
        captureData:visionResp,
        modalType:'list'
      })
    } catch (e) {
      console.warn(e);
    }
  };

  async takePicture() {
    console.log('jhh')
    if(this.state.flashFlag === 'on'){
    await  this.setState({flashValue:Camera.constants.TorchMode.on})
    }
    // const options = {};
    const options = {
      quality: 0.8,
      base64: true,
      skipProcessing: true,
    };
    //options.location = ...
    await this.camera.capture({metadata: options})
    .then((data) => {
        this.setState({flashValue:Camera.constants.TorchMode.off})
        var st = ''
        RNFetchBlob.fs.readStream(data.path,'base64',4095)
        .then((ifstream) => {
            ifstream.open()
            ifstream.onData((chunk) => {
              // when encoding is `ascii`, chunk will be an array contains numbers
              // otherwise it will be a string
              st = chunk
              // alert(st)
            })
            ifstream.onError((err) => {
              console.log('oops', err)
            })
            ifstream.onEnd(() => {  
              this.setState({
                base64:st
              },()=>{
                console.log(this.state.base64)
                this.setModalVisible(false)
              })
            })
        })
      })
      .catch(err => console.log(err));
  }
}
