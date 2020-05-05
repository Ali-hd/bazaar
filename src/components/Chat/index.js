import React, { useContext, useState, useEffect } from 'react'
import { Button, Input, message, List, Avatar, Divider } from 'antd';
import {API_URL} from '../../config'
import { withRouter, Link } from 'react-router-dom';
import { token } from '../../store/middleware'
import { StoreContext } from '../../store/store'
import moment from 'moment'
import io from 'socket.io-client'

let socket = io.connect(API_URL,{
    query: {token: token()}
})


const ChatPage = (props) => {
    const { state, actions } = useContext(StoreContext)
    useEffect(() => {
        console.log('use effect')
        actions.getSingleConversation({id:props.match.params.id, func: fillConversation})
        socket.open();
        console.log('component mounted')
        socket.emit('subscribe', props.match.params.id);
        socket.on('output', msg => {
        console.log('socket received',msg)
            setConversation(msg)
      })
      return () => {
        socket.close();
      };
     }, [])

     const [chat, setChat] = useState('')
     const [conversation, setConversation] = useState([])

     const updateMsg = e => {
         setChat(e.target.value)
     }

     const fillConversation = (params) => {
        setConversation(params)
     }

     const sendMsg = () => {
        let username = state.conversation.participants[0] !== state.decoded.username ? state.conversation.participants[0] : state.conversation.participants[1]
        console.log(username)
        console.log(chat)
        socket.emit('chat', { room: props.match.params.id, username, content: chat })
    }

    return(
        <div>
            {console.log(state)}
            <div style={{textAlign: 'center', marginTop:'14%'}}>
            {conversation.map(msg=>{
                return <div key={msg._id}>
                    <span>{msg.sender+":"+" "+ msg.content}</span>
                    </div>
            })}
            
            <Input onChange={updateMsg} type="primary" style={{width:'200px'}}/>
            <Button onClick={sendMsg}>Send</Button>
            </div>
            {/* <div style={{padding:'2rem'}}>
            <List style={{maxWidth:'700px', padding:'0.7rem', margin:'100px auto 0 auto', border:'1px solid #ccc', borderRadius:'4px'}}>
            {state.conversations ? state.conversations.conversations.map(con=>{
             return <List.Item style={{margin:'0'}} key={2}>
                <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href="https://ant.design">{con.participants[0] !== state.decoded.username ? con.participants[0] : con.participants[1]}</a>}
                description={moment(con.updatedAt).fromNow()}
                />
                <div>Content</div>
            </List.Item>
            }) : null}
            </List>
            </div> */}
        </div>
    )
}

export default withRouter(ChatPage)