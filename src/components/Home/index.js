import React, { useEffect, useState, useContext } from 'react'
import { Input, Button, Card, Avatar, Upload, message } from 'antd'
import './style.scss'
import { withRouter, Link } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons';
import Axios from 'axios';
import io from 'socket.io-client'
import {StoreContext} from '../../store/store'
import Loader from '../Loader'
import {API_URL} from '../../config'

const { Search } = Input;
const { Meta } = Card;

const Home = () => {
    const { state, actions } = useContext(StoreContext)

    let token = sessionStorage.token || localStorage.token
    let socket = io.connect(API_URL,{
        query: {token: token}
    })

    useEffect(() => {
        actions.getPosts()
        socket.on('output', msg => {
            console.log(msg)
        })
    }, [])

    const searchOnChange = e => {
        console.log(e.target.value)
        actions.searchOnChange(e.target.value)
    }

    // const handleChange = (info) => {
    //     const { status } = info.file;
    //     if (status !== 'uploading') {
    //         console.log(info)
    //         message.success(`${info.file.name} file uploaded successfully.`)
    //     }
    //     if (status === 'done') {
    //         message.success(`${info.file.name} file uploaded successfully.`)
    //         console.log(info)
    //     } else if (status === 'error') {
    //         message.error(`${info.file.name} file upload failed.`);
    //     }
    // }

    const send = () => {
        socket.emit('name', { msg: 'hi' })
    }

    // const Upload = () => {
    //     Axios.post('http://127.0.0.1:5000/post/upload')
    // }

    // const props = {
    //     name: 'image',
    //     multiple: true,
    //     accepts: 'image/png, image/jpeg, image/svg',
    //     action: `http://127.0.0.1:5000/post/upload`,
    //     onChange: handleChange,
    // }
    return (<div><div style={{ margin: '0 auto', maxWidth: '1000px' }} className="col-lg-10 text-center">
        {console.log(state)}
        <Search
            className="searchInput"
            placeholder="input search text"
            enterButton="search"
            size="large"
            onChange={searchOnChange}
            onSearch={value => console.log(value)}
        />
    </div>
        <div className="row pl-3 pr-3 pt-5 all-posts-div">
            {/* <div className="col-md-4 pt-4 col-lg-3 col-sm-6">
<Card
        style={{ width: 300}}
        cover={
            <img
            style={{ height: 200}}
            alt="example"
            src="https://i.imgur.com/FwilK0g.jpg"
            />
        }
        actions={[
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
                    <div>dw</div>,
                    <span></span>,
        ]}
        >
        <Meta
            title="Card title"
            description="This is the description"
        />
        </Card>
</div> */}
            {state.posts && state.posts.length>0 ? state.posts.map((post)=>{
            return <div key={post._id} className="col-md-4 pt-4 col-lg-3 col-sm-6">
                <div className="post-box">
                    <div className="image-box">
                        <Link to={`/post/${post._id}`}>
                            <img className="post-box-image" alt="post img" onError={(e)=>{e.target.onerror = null; e.target.src="https://i.imgur.com/lpm3KS3.png"}} src={post.images[0]} />
                        </Link>
                    </div>
                    <div className="row pt-1">
                        <div className="title-box col-8">
                            <div className="main-title-box"><span>{post.title}</span></div>
                            <div className="main-subTitle-box"><span>{post.location}</span></div>
                        </div>
                        <div className="col-3 pt-1 pb-3">
                            <Link to={`/user/${post.user.username}`}>
                            <Avatar style={{float: 'right'}} size={40} src={post.user.profileImg} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            }):state.posts && state.posts.length<1 ? <div className="no-results"> no results :( </div> :<Loader/>}
        </div>

        <button onClick={send}>click me</button>
    </div>
    )

}

export default withRouter(Home)

