import React, { Component } from 'react'
import { Input, Button, Card, Avatar, Upload, message } from 'antd'
import style from './style.scss'
import { UploadOutlined } from '@ant-design/icons';
import Axios from 'axios';
import io from 'socket.io-client'

const { Search } = Input;
const { Meta } = Card;

class Home extends Component {

    componentDidMount(){
        let server = 'http://localhost:5000'
        this.socket = io(server)
        this.socket.on('output', msg=>{
            console.log(msg)
        })
    }

    send = () => {
        this.socket.emit('name',{msg: 'hi'})
    }

    handleChange = (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info)
            message.success(`${info.file.name} file uploaded successfully.`)
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`)
            console.log(info)
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    
    Upload = () => {
        Axios.post('http://127.0.0.1:5000/post/upload',)
    }
    render() {
        const props = {
            name: 'image',
            multiple: true,
            accepts: 'image/png, image/jpeg, image/svg',
            action: `http://127.0.0.1:5000/post/upload`,
            onChange: this.handleChange,
          }
        return (
            <div>
                <div style={{ margin: '0 auto' }} className="col-lg-10 text-center">
                    <Search
                        className="searchInput"
                        placeholder="input search text"
                        enterButton="search"
                        size="large"
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
 
                    
                    <div className="col-md-4 pt-4 col-lg-3 col-sm-6">
                        <div className="post-box">
                            <div className="image-box">
                                <a>
                                    <img className="post-box-image" alt="post-img" src="https://i.imgur.com/FwilK0g.jpg"/>
                                </a>
                            </div>
                            <div className="row pt-1">
                            <div className="title-box col-9">
                                <div className="main-title-box"><span>This is a really nice</span></div>
                                <div className="main-subTitle-box"><span>Jeddah</span></div>
                            </div>
                            <div className="col-3 pt-1 pb-2">
                                <Avatar size={40} src="https://i.imgur.com/2wxGIaa.png"/>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-4 col-lg-3 col-sm-6">
                        <div className="post-box">
                            <div className="image-box">
                                <a>
                                    <img className="post-box-image" alt="post-img" src="https://i.imgur.com/2wxGIaa.png"/>
                                </a>
                            </div>
                            <div className="row pt-1">
                            <div className="title-box col-9">
                                <div className="main-title-box"><span>This is a really nice</span></div>
                                <div className="main-subTitle-box"><span>Jeddah</span></div>
                            </div>
                            <div className="col-3 pt-1 pb-2">
                                <Avatar size={40} src="https://i.imgur.com/FwilK0g.jpg"/>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-4 col-lg-3 col-sm-6">
                        <div className="post-box">
                            <div className="image-box">
                                <a>
                                    <img className="post-box-image" alt="post-img" src="https://i.imgur.com/2wxGIaa.png"/>
                                </a>
                            </div>
                            <div className="row pt-1">
                            <div className="title-box col-9">
                                <div className="main-title-box"><span>This is a really nice</span></div>
                                <div className="main-subTitle-box"><span>Jeddah</span></div>
                            </div>
                            <div className="col-3 pt-1 pb-2">
                                <Avatar size={40} src="https://i.imgur.com/2wxGIaa.png"/>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Upload {...props}>
                <Button>
                <UploadOutlined /> Click to Upload
                </Button>
            </Upload>
            <input type="file"/>
            <button onClick={this.send}>click me</button>
            </div>
        )
    }
}

export default Home
