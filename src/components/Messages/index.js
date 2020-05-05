import React, { useContext, useState, useEffect } from 'react'
import { Button, Input, message, List, Avatar, Divider } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { StoreContext } from '../../store/store'
import moment from 'moment'
import './style.scss'

const MessagesPage = (props) => {
    const { state, actions } = useContext(StoreContext)

    useEffect(() => {
        state.decoded && actions.getConversations()
    }, [])

    return (
        <div>
            {console.log(state)}
            <div className="conv" style={{ padding: '2rem' }}>
                <List style={{ maxWidth: '700px', padding: '0.7rem', margin: '100px auto 0 auto', border: '1px solid #ccc', borderRadius: '4px' }}>
                    {state.conversations ? state.conversations.conversations.map(con => {
                        return <div className="conv-box" key={con._id}>
                            <Link to={`/messages/${con._id}`}>
                                <List.Item style={{ margin: '0' }} key={2}>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={con.participants[0] !== state.decoded.username ? con.participants[0] : con.participants[1]}
                                        description={moment(con.updatedAt).fromNow()}
                                    />
                                    {/* <p>Content</p> */}
                                </List.Item>
                            </Link>
                            <Divider style={{margin:'5px 0'}}/>
                        </div>
                    }) : null}
                </List>
            </div>
        </div>
    )
}

export default withRouter(MessagesPage)