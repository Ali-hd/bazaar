import React, { useContext, useRef, useState, useEffect } from 'react'
import { Button, Input, message } from 'antd';
import {API_URL} from '../../config'
import { token } from '../../store/middleware'
import io from 'socket.io-client'

let socket = io.connect(API_URL,{
    query: {token: token()}
})


const MessagesPage = () => {

    useEffect(() => {
        socket.on('output', msg => {
        console.log('socket received',msg)
            setConversation(msg)
      })
     }, [])

     const [chat, setChat] = useState('')
     const [conversation, setConversation] = useState([])

     const updateMsg = e => {
         setChat(e.target.value)
     }

     const sendMsg = () => {
        console.log(chat)
        socket.emit('chat', { username: 'rash', content: chat })
    }

    return(
        <div>
            <div style={{textAlign: 'center', marginTop:'14%'}}>
            {conversation.map(msg=>{
                return <div key={msg._id}>
                    <span>{msg.sender+":"+" "+ msg.content}</span>
                    </div>
            })}
            
            <Input onChange={updateMsg} type="primary" style={{width:'200px'}}/>
            <Button onClick={sendMsg}>Send</Button>
            </div>
        </div>
    )
}

export default MessagesPage