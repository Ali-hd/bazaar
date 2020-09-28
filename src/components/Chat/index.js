import React, { useContext, useState, useEffect, useRef } from 'react'
import { Button, Input, Form } from 'antd';
import {API_URL} from '../../config'
import { withRouter} from 'react-router-dom';
import { token } from '../../store/middleware'
import { StoreContext } from '../../store/store'
// import moment from 'moment'
import io from 'socket.io-client'

let socket = io.connect(API_URL,{
    query: {token: token()}
})

const ChatPage = (props) => {
    const mounted = useRef()
    const [form] = Form.useForm();

    const { state, actions } = useContext(StoreContext)
    const [conversation, setConversation] = useState([])
    useEffect(() => {
            if(!mounted.current){
                actions.getSingleConversation({id:props.match.params.id, func: fillConversation})
                mounted.current = true
                // socket.open();
                socket.emit('subscribe', props.match.params.id);
            }else{
                form.setFieldsValue({
                    content: '',
                  });
                socket.on('output', msg => {
                    setConversation(msg)
                  })
                let messageBody = document.querySelector('#messageBody');
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
            }
    //   return () => {
    //     socket.close();
    //   };
     }, [conversation])


     const fillConversation = params => {
        setConversation(params)
     }

     const sendMsg = values => {
        let username = state.conversation.participants[0] !== state.decoded.username ? state.conversation.participants[0] : state.conversation.participants[1]
        socket.emit('chat', { room: props.match.params.id, username, content: values.content })
    }

    return(
        <div>
            <div id="messageBody" style={{textAlign: 'center', maxWidth:'500px', margin:'100px auto 20px auto', height:'300px', overflowY: 'scroll', border:'1px solid #ccc', padding:'1rem', borderRadius:'5px'}}>
            {conversation.map(msg=>{
                return <div style={{clear:'both'}} key={msg._id}>
                    <span style={msg.sender === state.decoded.username? {float:'left'} : {float:'right'}}>{msg.sender+": "+ msg.content}</span>
                    </div>
            })}
            </div>
            <div>
                <Form form={form} style={{maxWidth:'250px', display:'flex', margin:'0 auto'}} onFinish={sendMsg}>
                    <Form.Item validateTrigger="onSubmit" name="content" rules={[{ required: true, message: 'Please type a message' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Send</Button>
                    </Form.Item>
                </Form>
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