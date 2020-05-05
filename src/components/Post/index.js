import React, { useContext, useRef, useState, useEffect } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link, Redirect } from 'react-router-dom';
import { FundViewOutlined, EyeOutlined, LikeOutlined, MailOutlined, LikeTwoTone} from '@ant-design/icons';
import './style.scss'
import moment from 'moment'
import io from 'socket.io-client'
import { Carousel, Divider, Comment, Avatar, Form, Button, List, Input, Statistic, Tooltip, message, Modal } from 'antd';
import {API_URL} from '../../config'
import { token } from '../../store/middleware'
const { TextArea } = Input;
const { Search } = Input

console.log(token())
let socket = io.connect(API_URL,{
    query: {token: token()}
})

const PostPage = (props) => {

    const { state, actions } = useContext(StoreContext)

    useEffect(() => {
      actions.getSinglePost({
          postId: props.match.params.id,
          func: fillComments
      })
      socket.on('output', msg => {
        console.log('socket received',msg)
        if(Array.isArray(msg.bids) && msg._id === props.match.params.id){
            actions.submitBid(msg.bids)
        }else if(!Array.isArray(msg.bids) && msg._id === props.match.params.id){
            message.error(msg)
        }
    })
   }, [props.match.params.id])

    const [slide, setSlide] = useState(0);
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const [liked, setLiked] = useState('');
    const [modal, setModal] = useState(false);
    const [msg, setMsg] = useState('')

    const changeSlide = (i) => {
        slider.current.goTo(i)
    }

    const fillComments = (params) => {
        let commentSchema = []
        params.map(com=>{
            return commentSchema.push({
                author: com.user.username,
                avatar: com.user.profileImg,
                content: <p>{com.description}</p>,
                datetime: moment(com.createdAt).format("MMMM Do YYYY, h:mm:ss a")
            })
        })
        setComments(commentSchema)
    }

    const fillComment = (params) => {
        setSubmitting(false)
        setValue('')
        setComments([
                     ...comments,{
                        author: params.username,
                        avatar: params.userImg,
                        content: <p>{params.description}</p>,
                        datetime: moment().fromNow(),
                    }
                ])
    }

    const CommentList = ({ comments }) => (
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'comments' : 'comment'}`}
            itemLayout="horizontal"
            renderItem={props => <Comment {...props} />}
        />
    );


    const handleSubmit = () => {
        if (!value) {
            return;
        }

        setSubmitting(true)
        const newComment = {
            username: state.decoded.username,
            description: value,
            userImg: state.account.profileImg,
            postId: props.match.params.id
        }
        const payload = {
            comment: newComment,
            func: fillComment
        }

        actions.postComment(payload)
    };

    const handleChange = e => {
        setValue(e.target.value)
    };

    const slider = useRef();

    const submitBid = (bid) => {
        console.log(bid)
        socket.emit('bids', { bid: bid, postId: props.match.params.id })
    }

    const likePost = (param) => {
        actions.likePost(props.match.params.id)
        setLiked(param)
    }

    const sendMsg = () => {
        actions.startChat({username: state.post.user.username, content: msg})
        setModal(!modal)
    }

    const showModal = () => {
        setModal(!modal)
    }

    const updateMsg = e => {
        setMsg(e.target.value)
    }
    

    return (
        <div style={{ maxWidth: '1600px', margin: '100px auto' }}>
            {console.log(state)}
            <div className="post-title">
                <p>{state.post && state.post.title}</p>
            </div>
            <div className="post-images-box">
                <div className="post-carousel-box">
                    {state.post ? <Carousel dots={true}
                        ref={ref => {
                            slider.current = ref;
                        }}>
                        {state.post.images.map(img=>{
                            return <div className="carousel-frame" key={img}>
                                    <img className="carousel-img" src={img} />
                            </div>
                        })}
                    </Carousel> : null
                    }
                </div>
                <div className="post-preview-boxes row">
                {state.post && state.post.images.map((img,index)=>{
                            return <div key={img} onClick={() => changeSlide(index)} className="post-preview-img col-md-2-5">
                            <img width="100%" height="100%" src={img} />
                        </div>
                        })}
                </div>
            </div>
            <div className="post-description">
                <Divider orientation="left">Description</Divider>
                <p style={{ whiteSpace: 'pre-wrap'}}>
                { state.post && state.post.description}
                </p>
            </div>
            <div className="post-info-box">
                <Divider>Post information</Divider>
                <div className="row">
                    <div className="col-4">
                    <p>Seller: <Link to={`/user/${state.post && state.post.user.username}`}>{state.post && state.post.user.username}</Link> <MailOutlined onClick={showModal} /></p>
                    <p>Posted at: {state.post && moment(state.post.createdAt).format("MMMM Do YYYY")}</p>
                    <p>Condition: Used</p>
                    <p>Location: {state.post && state.post.location}</p>
                    </div>
                    <div className="col-4">
                    {/* <p style={{textAlign:'center'}}>Seller: zerogravity</p>
                    <Button style={{display:'flex', margin:'0 auto'}} key="3">Message</Button> */}
                    <div style={{border:'1px solid #f0f0f0', borderRadius:'3px', height:'135px', overflowY:'scroll'}}>
                    <p style={{borderBottom:'1px solid #f0f0f0', textAlign:'center'}}>Biddings</p>
                    <Search
                        style={{width:'200px', display:'flex', margin:'0 auto'}}
                        placeholder="enter your bid"
                        enterButton="enter"
                        size="small"
                        onSearch={value => submitBid(value)}
                        />
                        <div style={{  paddingTop:'6px'}}>
                        {state.post && state.post.bids.map((bid, i)=>{
                            return <div key={bid.bid} className={i%2 == 0 ? "bid-div-1" : "bid-div-2"}>
                            <div style={{width:'170px', margin:'0 auto',}}>
                            <Link to={`/user/${bid.username}`}>
                            <p className="bid-elem">{bid.username }</p>
                            </Link>
                            <span style={{float:'right'}} >{bid.bid}SAR</span>
                            </div>
                            </div>
                        })}
                        </div>
                    </div>
                    </div>
                    <div className="views-stat col-4 text-right">
                        <p style={{marginBottom:'3px'}}>Views</p>
                        <EyeOutlined style={{marginBottom:'15px'}} /> {state.post && state.post.views}
                        <p style={{marginBottom:'3px'}}>Like</p>
                        {state.account && state.account.liked.includes(props.match.params.id) || liked === 'like' ? <LikeTwoTone style={{cursor:'pointer'}} onClick={()=>likePost('dislike')} /> 
                        : <LikeOutlined style={{cursor:'pointer'}} onClick={()=>likePost('like')} />}{state.post && state.post.likes}
                    </div>
                </div>
            </div>
            <div className="post-comments-box">
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    avatar={
                        <Avatar
                            src={state.account && state.account.profileImg}
                            alt="profile img"
                        />
                    }
                    content={
                        <div>
                            <Form.Item>
                                <TextArea rows={4} onChange={handleChange} value={value} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
                                    Add Comment
                        </Button>
                            </Form.Item>
                        </div>
                    }
                />
            </div>
            <div>
            <Modal
                title="Send Direct Message"
                visible={modal}
                footer={[
                    <Button key="cancel" onClick={showModal}>
                      Cancel
                    </Button>,
                    <Button key="send" type="primary" onClick={sendMsg}>
                      Send
                    </Button>,
                  ]}
                >
                <p>to: <span style={{fontWeight:'700', fontSize:'1rem'}}>{state.post && state.post.user.username}</span></p>
                <TextArea placeholder="type your message here" onChange={updateMsg}/>
                </Modal>
            </div>
        </div>
    )
}

export default withRouter(PostPage) 