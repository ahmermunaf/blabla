import React, { Component } from 'react';
import { Vibration , Platform } from 'react-native'
import { Left, Body, Right, Button, Badge , Content, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob'

export default class VoiceSearch extends Component{
    constructor(){
        super();
        this.state={
            btnPressIn:false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.amr',
            currentTime: 0.0,
            stoppedRecording: false,
            finished: false,
        }
    }
    preparingRecorder(){
        if(Platform.OS === 'ios'){
            AudioRecorder.prepareRecordingAtPath(this.state.audioPath, {
                SampleRate: 8000,
                Channels: 1,
                AudioQuality: "High",
                AudioEncoding: "amr",
                // AudioEncodingBitRate: 32000
            });
        }
        else{
            AudioRecorder.prepareRecordingAtPath(this.state.audioPath, {
                SampleRate: 16000,
                Channels: 1,
                AudioQuality: "High",
                AudioEncoding: "amr_wp",
                // AudioEncodingBitRate: 32000
            });
        }
    }
    componentDidMount(){
        AudioRecorder.onProgress = (data) => {
            this.setState({currentTime: Math.floor(data.currentTime)});
        };
    }
    render() {
        return (
            <Content>
                <Button 
                rounded 
                info 
                style={{width:(this.state.btnPressIn) ? 100:50,height:(this.state.btnPressIn) ? 100:50,justifyContent:'center',alignContent:"center",alignItems:"center",alignSelf:"center"}} 
                onPressIn={()=>{
                    this.setState({
                        btnPressIn:true    
                    },()=>{
                        this.preparingRecorder()
                        Vibration.vibrate(50)
                        if(Platform.OS === 'ios'){
                            setTimeout(()=>{
                                Vibration.cancel()
                            },50)
                        }
                        AudioRecorder.startRecording()
                    })
                }} 
                onPressOut={()=>{
                    this.setState({
                        btnPressIn:false,
                        currentTime:0.0
                    },()=>{
                        AudioRecorder.stopRecording().then((filePath)=>{
                            this.setState({
                                uri:filePath
                            })
                            RNFetchBlob.fs.readFile(filePath, 'base64')
                            .then((data)=>{
                                console.log(data,'base64')
                                fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyCHR-nJhTcwXU-44V1dLFNV_qj5DSe2_cU', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                //     'Authorization':'ya29.GlzqBIYEkOPAGQ2bboiWOPwB6yy2FBPcL-FAuS0bW6-bXV4JaGQUXcmPmZNqWmMJfz8jFwP99ig6Rbu8qcYWS72OSFn7pLl4kJlzTxvj9rXY-FJfZ_VHIhUG4eqdlQ'
                                },
                                body: JSON.stringify({
                                    config: {
                                        encoding:(Platform.OS === 'ios') ? 'AMR':'AMR_WB',
                                        sampleRateHertz: (Platform.OS === 'ios') ? 8000:16000,
                                        languageCode: "en-US",
                                        enableWordTimeOffsets: false,
                                    },
                                    audio: {
                                        content:data
                                    }
                                })
                                })
                                .then((response) => {
                                    console.log(response,'res')
                                    // console.log(response.json().results,'resjsoninres')
                                    return response.json()
                                })
                                .then((responseJson) => {
                                console.log(responseJson.results,'resjson');
                                })
                            })
                        })
                    })
                }}
                >
                    <Icon name="microphone" size={(this.state.btnPressIn) ? 54:27} color="#fff" />
                </Button>
                <Text>{this.state.currentTime}</Text>
            </Content>      
        );
    }
}
