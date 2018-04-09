/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Segment, Content, Text } from 'native-base';
import BookSearch from './bookSearch'
import RandomSearch from './randomSearch'
import VoiceSearch from './voiceSearch'

type Props = {};
export default class Home extends Component<Props> {
  constructor(){
    super();
    this.state={
      voiceSeg:false,
      randomSeg:false,
      bookSeg:true
    }
  }
  render() {
    return (
      <Container>
        <Header hasTabs>
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
          
          }      
      </Container>
    );
  }
}
