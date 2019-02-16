import React, {Component} from 'react'
import { Actions } from 'react-native-router-flux'
import { StyleSheet, ScrollView } from 'react-native'
import { Container, Content, Header, Left, Body, Right, Button, Icon, Title, Text} from 'native-base'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class Results extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['S.#','Book Name', 'Author Name', 'Edition', 'Shelf Number', 'Catogary', 'Publisher', 'Publish Year', 'Rec', 'Section','Available'],
            tableData: [],
            widthArr: [50,150, 150, 150, 150, 150, 150,150,150,150,150]
        }
    }
    async componentDidMount(){
        var data = this.props.data
        var tableData = []
        await data.forEach(async (book,ind)=>{
            var arr = []
            arr.push(ind+1)
            arr.push(book.bookName)
            arr.push(book.authorName)
            arr.push(book.edition)
            arr.push(book.shelfNumber)
            arr.push(book.catogary)
            arr.push(book.publisher)
            arr.push(book.publishYear)
            arr.push(book.rec)
            arr.push(book.section)
            arr.push(book.available)
            tableData.push(arr)
        })
        await this.setState({
            tableData
        })
    }
    render(){
        const state = this.state;
        return(
            <Container>
                <Header style={{backgroundColor:'#ff0000'}} >
                    <Left>
                        <Button transparent onPress={()=>{
                            Actions.pop()
                        }} >
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Results</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Text style={{marginTop:10,marginBottom:10,fontSize:16}} >Total Record Showing : {this.props.data.length}</Text>
                    <ScrollView horizontal={true}>
                        <Table borderStyle={{borderWidth: 2, borderColor: '#feaaaa'}}>
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text}/>
                            <Rows data={state.tableData} widthArr={state.widthArr} textStyle={styles.text}/>
                        </Table>
                    </ScrollView>
                </Content>
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#cccccc' },
    text: { margin: 6 }
  });