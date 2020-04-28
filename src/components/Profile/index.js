import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link} from 'react-router-dom';
import { Divider, Menu, Upload, message, Rate, Avatar, Button, Form, Input } from 'antd'
import { API_URL } from '../../config'
import { MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment'
import './style.scss'
const { TextArea } = Input;

const ProfilePage = (props) => {
    const { state, actions } = useContext(StoreContext)
    const [activeTab, setActiveTab] = useState('posts')
    const [edit, setEdit] = useState(false)
    const [passwordField, setPasswordField] = useState(false)

    useEffect(() => {
        actions.getUser(props.match.params.username)
        console.log(props)
    }, [])

    const toggleEdit = () => {
        setEdit(!edit)
    }

    const editProfile = values => {
        values.userId = props.match.params.username
        actions.editProfile({userId:props.match.params.username, values, func: toggleEdit})
    }

    const togglePassword = () => {
        setPasswordField(!passwordField)
    }

    const changePassword = values => {
        values.type = 'change password'
        actions.changePassword({userId:props.match.params.username, values, func: togglePassword})
    }
    const changeTab = e => {
        setActiveTab(e.key)
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
                actions.editProfilePic({userId:props.match.params.username, profileImg: info.file.response.imageUrl})
                console.log(info)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div className="row" style={{ maxWidth: '1500px', margin: '100px auto' }}>
            {console.log(state)}
           <div className="col-lg-3 col-md-4 col-12">
               <div className="user-profile-box">
                    <img className="profile-img" width="375" height="375" src={state.user && state.user.profileImg} />
                    <div>
                    <Upload showUploadList={false} {...settings}>
                        <p className="change-picture">change picture</p>
                    </Upload>
                    </div>
                </div>
                <p style={{fontSize:'20px'}}>{state.user && state.user.username}</p>
                {!edit?  
                <div className="d-inline">
                    {/* <p>Bio:</p> */}
                    <p>{state.user && state.user.description}</p>
                    <p>{state.user && state.user.location}</p>
                    {/* <p> Member since:</p> */}
                    <p>{moment(state.user && state.user.createdAt).format('DD MMM YYYY')}</p>
                    <Button onClick={toggleEdit} block><SettingOutlined/> Edit Profile</Button>
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
                        <TextArea defaultValue={state.user && state.user.description} />
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
                        <Input defaultValue={state.user && state.user.description} />
                    </Form.Item>
                    <Divider className="mb-3 mt-2"/>
                    <Form.Item>
                        <Button htmlType="submit" block>Done</Button>
                    </Form.Item>   
                    </Form>
                </div>}
                {passwordField? 
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
                </div> :<Button onClick={togglePassword} shape="round" style={{display:'flex', margin:'20px auto 20px auto'}}>Change password</Button>}      
                
           </div>
           <div className="profile-menu col-lg-9 col-md-8 col-12">
                <div>
                <Menu onClick={changeTab} selectedKeys={[activeTab]} mode="horizontal">
                    <Menu.Item className={activeTab !== 'posts' && 'modified-item'} key="posts">
                        <MailOutlined />
                            Posts
                        </Menu.Item>
                    <Menu.Item className={activeTab !== 'reviews' && 'modified-item'} key="reviews">
                        <AppstoreOutlined />
                            Ratings
                        </Menu.Item>
                    <Menu.Item className={activeTab !== 'likes' && 'modified-item'} key="likes">
                        <AppstoreOutlined />
                            Likes
                        </Menu.Item>
                </Menu>
                </div>
                <div className="mt-3">
                    { activeTab === "posts" && state.user && state.user.posts && state.user.posts[0].title ? state.user.posts.map(p=>{
                        return <Link key={p._id} to={`/post/${p._id}`}>
                        <div className="user-post-box p-1">
                            <div className="user-post-frame">
                                <img src={p.images[0]} className="user-post-img"/>
                            </div>
                            <div style={{ display: 'inline-block', marginLeft: '10px', height: '120px'}}>
                                <h5>{p.title}</h5>
                                <p style={{display:'inline'}}>{p.description.slice(0,80)}</p>
                                <p className="mb-1">{p.createdAt}</p>
                                <p>Comments(23)</p>
                            </div>
                        </div>
                        </Link> 
                    }): activeTab === "reviews" ? <div>
                        <div className="user-review-box">
                        <div >
                            <Avatar className="mb-2 mr-2" shape="square" size={24} icon={<UserOutlined />}/>
                            <p style={{display:'inline-block', fontSize:'22px'}}>zero</p>
                        </div>
                        <p>best seller</p>
                        <Rate disabled defaultValue={4} />
                        </div>
                    </div>:<h6>Nothing here :(</h6>}
                </div>
           </div>
        </div>
    )
}

export default withRouter(ProfilePage)
