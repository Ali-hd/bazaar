import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link } from 'react-router-dom';
import { Divider, Menu, Upload, message, Rate, Avatar, Button, Form, Input, Modal } from 'antd'
import Loader from '../Loader'
import { API_URL } from '../../config'
import { MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment'
import './style.scss'
const { TextArea } = Input;

const ProfilePage = (props) => {
    const { state, actions } = useContext(StoreContext)
    const [activeTab, setActiveTab] = useState('posts')
    const [edit, setEdit] = useState(false)
    const [passwordField, setPasswordField] = useState(false)
    const [rate, setRate] = useState(false)
    const [msgModal, setMsgModal] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        actions.getUser({ userId: props.match.params.username })
        setActiveTab('posts')
    }, [props.match.params.username])

    const toggleEdit = () => {
        setEdit(!edit)
    }

    const editProfile = values => {
        values.userId = props.match.params.username
        actions.editProfile({ userId: props.match.params.username, values, func: toggleEdit })
    }

    const togglePassword = () => {
        setPasswordField(!passwordField)
    }

    const changePassword = values => {
        values.type = 'change password'
        actions.changePassword({ userId: props.match.params.username, values, func: togglePassword })
    }
    const changeTab = e => {
        setActiveTab(e.key)
        if (e.key === 'likes' && state.user.liked.length > 0) {
            actions.getUser({ userId: props.match.params.username, type: 'liked' })
        }
    }

    const toggleRateUser = () => {
        if(!state.session){ return message.error("You need to Sign in")}
        setRate(!rate)
    }

    const openMsgModal = () => {
        if(!state.session){ return message.error("You need to Sign in")}
        setMsgModal(!msgModal)
    }

    const updateMsg = e => {
        setMsg(e.target.value)
    }

    const sendMsg = () => {
        if(!state.session){ return message.error('You need to Sign in') }
        actions.startChat({username: state.user.username, content: msg})
        setMsgModal(!msgModal)        
    }

    const submitRating = values => {
        actions.rateUser({ userId: props.match.params.username, values, func: toggleRateUser })
    }

    const settings = {
        name: 'image',
        multiple: false,
        accepts: 'image/png, image/jpeg',
        action: `${API_URL}/post/upload`,
        listType: 'hidden',
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isLt2M;
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                actions.editProfilePic({ userId: props.match.params.username, profileImg: info.file.response.imageUrl })
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div className="row" style={{ maxWidth: '1500px', margin: '100px auto' }}>
            <div className="col-lg-3 col-md-4 col-12">
                <div className="user-profile-box">
                    <img className="profile-img" width="375" height="375" src={state.user && state.user.profileImg} />
                    <div>
                        <Upload showUploadList={false} {...settings}>
                            {state.decoded && state.decoded.username === props.match.params.username ? <p className="change-picture">change picture</p> : null}
                        </Upload>
                    </div>
                </div>
                <p style={{ fontSize: '20px' }}>{state.user && state.user.username}</p>
                {state.decoded && state.decoded.username === props.match.params.username ?
                    <div>
                        {!edit ?
                            <div className="d-inline">
                                {/* <p>Bio:</p> */}
                                <p>{state.user && state.user.description}</p>
                                <p><FontAwesomeIcon icon={['fas', 'map-marker-alt']} /> {state.user && state.user.location}</p>
                                {/* <p> Member since:</p> */}
                                <p>{moment(state.user && state.user.createdAt).format('DD MMM YYYY')}</p>
                                <Button onClick={toggleEdit} block><SettingOutlined /> Edit Profile</Button>
                            </div> :
                            <div>
                                <Form onFinish={editProfile} layout={'vertical'}
                                    initialValues={{
                                        description: state.user && state.user.description,
                                        location: state.user && state.user.location
                                    }}>
                                    <Form.Item
                                        name="description"
                                        label="Bio"
                                        rules={[
                                            {
                                                required: false
                                            },
                                        ]}
                                    >
                                        <TextArea />
                                    </Form.Item>
                                    <Form.Item
                                        name="location"
                                        label="location"
                                        rules={[
                                            {
                                                required: false
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Divider className="mb-3 mt-2" />
                                    <Form.Item>
                                        <Button htmlType="submit" block>Done</Button>
                                    </Form.Item>
                                </Form>
                            </div>}
                        {passwordField ?
                            <div>
                                <Form layout={'vertical'} onFinish={changePassword}>
                                    <Form.Item
                                        className="mb-0"
                                        name="password"
                                        label="Current Password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your current password!'
                                            },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item
                                        className="mb-0"
                                        name="newPassword"
                                        label="New Password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your new password!'
                                            },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmPassword"
                                        label="Confirm password"
                                        dependencies={['newPassword']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your new password!'
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject('The two passwords that you entered do not match!');
                                                },
                                            })
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button htmlType="submit" block>Update Password</Button>
                                    </Form.Item>
                                </Form>
                            </div> : <Button onClick={togglePassword} shape="round" style={{ display: 'flex', margin: '20px auto 20px auto' }}>Change password</Button>}
                    </div> : <div>
                        <Button style={{marginBottom:'10px'}} onClick={openMsgModal} block><FontAwesomeIcon icon={['far', 'envelope']} style={{marginRight:'6px'}} />Message</Button>
                        {!rate ? <Button onClick={toggleRateUser} block><FontAwesomeIcon icon={['far', 'star']} style={{marginRight:'6px'}} /> Rate User </Button>
                            : <div>
                                <Form onFinish={submitRating}>
                                    <Form.Item rules={[{ required: true, message: 'Please enter a rating' }]} className="mb-2" name="star">
                                        <Rate allowHalf />
                                    </Form.Item>
                                    <Form.Item className="mb-3" name="description">
                                        <TextArea placeholder="How was your experience?" />
                                    </Form.Item>
                                    <Form.Item style={{marginBottom:"7px"}}>
                                        <Button htmlType="submit" block>Submit</Button>
                                    </Form.Item>
                                </Form>
                                <Button onClick={toggleRateUser} block>Cancel</Button>

                            </div>}

                    </div>}
            </div>
            <div className="profile-menu col-lg-9 col-md-8 col-12">
                <div>
                    <Menu onClick={changeTab} selectedKeys={[activeTab]} mode="horizontal">
                        <Menu.Item className={activeTab !== 'posts' && 'modified-item'} key="posts">
                        <FontAwesomeIcon icon={['far', 'clone']} style={{marginRight:'6px'}} />  
                            Posts
                        </Menu.Item>
                        <Menu.Item className={activeTab !== 'reviews' && 'modified-item'} key="reviews">
                        <FontAwesomeIcon icon={['far', 'star']} style={{marginRight:'6px'}} /> 
                            Ratings
                        </Menu.Item>
                        {state.decoded && props.match.params.username === state.decoded.username &&
                            <Menu.Item className={activeTab !== 'likes' && 'modified-item'} key="likes">
                                <AppstoreOutlined />
                            Likes
                        </Menu.Item>}
                    </Menu>
                </div>
                {state.user ?
                    <div className="mt-3">
                        {activeTab === "posts" && state.user.posts && state.user.posts.length > 0 && state.user.posts[0].title ? state.user.posts.map(p => {
                            return <Link key={p._id} to={`/post/${p._id}`}>
                                <div className="user-post-box p-1">
                                    <div className="user-post-frame">
                                        <img src={p.images[0]} className="user-post-img" />
                                    </div>
                                    <div style={{ display: 'inline-block', marginLeft: '10px', height: '120px' }}>
                                        <h5>{p.title}</h5>
                                        <p style={{ display: 'inline' }}>{p.description.slice(0, 80)}</p>
                                        <p className="mb-1">Comments({p.comments.length})</p>
                                        <p >{moment(p.createdAt).format('DD MMM YYYY')}</p>
                                    </div>
                                </div>
                            </Link>
                        }) : activeTab === "reviews" && state.user.ratings.length > 0 ? state.user.ratings.map(r => {
                            return <div key={r.username}>
                                <div className="user-review-box">
                                    <div>
                                        <Avatar className="mb-2 mr-2" shape="square" size={24} icon={<UserOutlined />} />
                                        <Link to={`/user/${r.username}`}>
                                            <p style={{ display: 'inline-block', fontSize: '22px' }}>{r.username}</p>
                                        </Link>
                                    </div>
                                    <p>{r.description}</p>
                                    <Rate disabled defaultValue={r.star} />
                                </div>
                            </div>
                        }) : activeTab === "likes" && state.user.liked.length > 0 && state.user.liked[0].createdAt ? state.user.liked.map(p => {
                            return <Link key={p._id} to={`/post/${p._id}`}>
                                <div className="user-post-box p-1">
                                    <div className="user-post-frame">
                                        <img src={p.images[0]} className="user-post-img" />
                                    </div>
                                    <div style={{ display: 'inline-block', marginLeft: '10px', height: '120px' }}>
                                        <h5>{p.title}</h5>
                                        <p style={{ display: 'inline' }}>{p.description.slice(0, 80)}</p>
                                        <p className="mb-1">Comments({p.comments.length})</p>
                                        <p >{moment(p.createdAt).format('DD MMM YYYY')}</p>
                                    </div>
                                </div>
                            </Link>
                        }) : <h6 style={{ textAlign: 'center', marginTop: '10%' }}>Nothing here :(</h6>}
                    </div> : <Loader />}
            </div>
            <Modal
                title="Send Direct Message"
                visible={msgModal}
                onCancel={openMsgModal}
                footer={[
                    <Button key="cancel" onClick={openMsgModal}>
                      Cancel
                    </Button>,
                    <Button key="send" type="primary" onClick={sendMsg}>
                      Send
                    </Button>,
                  ]}
                >
                <p>to: <span style={{fontWeight:'700', fontSize:'1rem'}}>{state.user && state.user.username}</span></p>
                <TextArea placeholder="type your message here" onChange={updateMsg}/>
                </Modal>
        </div>
    )
}

export default withRouter(ProfilePage)
