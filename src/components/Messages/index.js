import React, { useContext, useState, useEffect, useRef } from 'react'
import { Button, Input, message, List, Avatar, Divider, Form } from 'antd';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { StoreContext } from '../../store/store'
import moment from 'moment'
import './style.scss'
import io from 'socket.io-client'
import { token } from '../../store/middleware'
import {API_URL} from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


let socket = io.connect(API_URL,{
    query: {token: token()}
})

const MessagesPage = ({history}) => {
    const { state, actions } = useContext(StoreContext)
    const [conversation, setConversation] = useState([])
    const [room, setRoom] = useState(null)
    const [size, setSize] = useState(false)
    const mounted = useRef()
    const [form] = Form.useForm();
    //useing ref because all values are null when react unmounts expect ref
    const roomRef = useRef()

    useEffect(() => {
        //check when component unmounts
        return () => {
            if(roomRef.current){ socket.emit('leaveRoom', roomRef.current) } }
      }, [])

    useEffect(() => {
        if(!mounted.current){
            state.decoded && actions.getConversations()
            mounted.current = true
        }else{
            console.log('refresh')
            form.setFieldsValue({
                content: '',
              });
            socket.on('output', msg => {
                console.log('socket received',msg)
                setConversation(msg)
              })
              let messageBody = document.querySelector('#messageBody');
              messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        }
    }, [conversation])

    const fillConversation = params => {
        setConversation(params)
     }
    
     const changeSize = () => {
         setSize(!size)
     }

    const sendMsg = values => {
        console.log('submit message')
        console.log(state.conversation.participants)
        let username = state.conversation.participants[0] !== state.decoded.username ? state.conversation.participants[0] : state.conversation.participants[1]
        socket.emit('chat', { room: room, username, content: values.content })
    }

    const getConversation = (id) => {
       if(room){ socket.emit('leaveRoom', room) }
       socket.emit('subscribe', id);
       setRoom(id)
       roomRef.current = id
       actions.getSingleConversation({id:id, func: fillConversation})
    }

    return (
        <div>
            {console.log(state)}
            <div className="messages-container">
                <h3 className=" text-center">Messages</h3>
                <div className="messaging">
                    <div className="inbox_msg">

                        <div className={size? 'inbox_people-min' : 'inbox_people'}>
                            <div className="headind_srch">
                                <div className="recent_heading">
                                    <h4 onClick={changeSize}>Recent</h4>
                                </div>
                                {/* <div className="srch_bar">
                                    <div className="stylish-input-group">
                                        <input type="text" className="search-bar" placeholder="Search" />
                                        <span className="input-group-addon">
                                            <button type="button"> <i className="fa fa-search" aria-hidden="true"></i> </button>
                                        </span> </div>
                                </div> */}
                            </div>
                        <div className="inbox_chat">
                            {state.conversations && state.conversations.conversations.length > 0 ? state.conversations.conversations.map(con => {
                                return <a key={con._id} onClick={()=>getConversation(con._id)}>
                                            <div className={`chat_list ${room === con._id && 'active_chat'}`}>
                                                <div className="chat_people">
                                                    <div className="chat_img"> 
                                                        <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> 
                                                    </div>
                                                    <div className="chat_ib">
                                                        <h5>{con.participants[0] !== state.decoded.username ? con.participants[0] : con.participants[1]} <span className="chat_date">{moment(con.updatedAt).fromNow()}</span></h5>
                                                        {/* <p>Test, which is a new approach to have all solutions
                                                                astrology under one roof.</p> */}
                                                    </div>
                                                </div>                                   
                                            </div>
                                        </a>
                            }) : <h6 style={{ textAlign: 'center', margin: '10% auto' }}>You have no messages</h6>} 
                         </div>
                        </div>
                        {room? 
                        <div style={size? {width:'85%'} : {width: '60%'}} className="mesgs">

                            <div className="msg_history" id="messageBody">
                            {conversation.map(msg=>{
                                return <div key={msg._id}>
                                    {msg.sender==state.decoded.username? 
                                    <div className="outgoing_msg">
                                    <div className="sent_msg">
                                        <p style={{minHeight:'2rem'}}>{msg.content}</p>
                                        <span className="time_date"> {moment(msg.createdAt).fromNow()}    |    {moment(msg.createdAt).format("MMM D")}</span> </div>
                                </div> : <div className={"incoming_msg"}>
                                    <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                    <div className="received_msg">
                                        <div className="received_withd_msg">
                                        <p style={{minHeight:'2rem'}}>{msg.content}</p>
                                            <span className="time_date"> {moment(msg.createdAt).fromNow()}    |    {moment(msg.createdAt).format("MMM D")}</span></div>
                                    </div>
                                </div>
                                }
                                    </div> 
                                })}
                            </div>

                            <div className="type_msg">
                                <div className="input_msg_write">
                                    <Form style={{ height:'32px'}} form={form} onFinish={sendMsg}>
                                        <Form.Item validateTrigger="onSubmit" name="content" rules={[{ required: true, message: 'Please type a message' }]}>
                                            <Input className="write_msg" placeholder="Type a message"/>
                                        </Form.Item>  
                                    </Form>
                                    {/* <input type="text" className="write_msg" placeholder="Type a message" />
                                    <button className="msg_send_btn" type="button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button> */}
                                </div>
                            </div> 
                        </div>
                        : 
                        <div className="empty-messages">
                            <h5>You dont have any message selected</h5>
                            <h5> Please select on a message </h5>
                        </div> }
                    </div>

                </div>
                
            </div>





        </div>
    )
}

export default withRouter(MessagesPage)