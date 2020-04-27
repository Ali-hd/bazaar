import React, { useContext, useRef, useState, useEffect } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link, Redirect } from 'react-router-dom';
import { FundViewOutlined, EyeOutlined, LikeOutlined, MailOutlined} from '@ant-design/icons';
import './style.scss'
import moment from 'moment'
import io from 'socket.io-client'
import { Carousel, Divider, Comment, Avatar, Form, Button, List, Input, Statistic, Tooltip } from 'antd';
import API_URL from '../../config'
const { TextArea } = Input;
const { Search } = Input


let token = sessionStorage.token || localStorage.token
let socket = io.connect(API_URL,{
    query: {token: token}
})

const PostPage = (props) => {

    const { state, actions } = useContext(StoreContext)

    useEffect(() => {
      actions.getSinglePost({
          postId: props.match.params.id,
          func: fillComments
      })
      socket.on('output', msg => {
        console.log(msg)
    })
   }, [])

    const [slide, setSlide] = useState(0);
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');

    const onhover = (i) => {
        setSlide(2)
        slider.current.goTo(i)
    }

    const fillComments = (params) => {
        let commentSchema = []
        params.map(com=>{
            return commentSchema.push({
                author: com.username,
                avatar: com.userImg,
                content: <p>{com.description}</p>,
                datetime: moment(com.createdAt).format("MMMM Do YYYY, h:mm:ss a")
            })
        })
        setComments(commentSchema)
    }

    const fillComment = (params) => {
        setSubmitting(false)
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
            userImg: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
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
        //need to add socket validation from backend
        socket.emit('bids', { bid: bid, username: state.decoded.username, postId: props.match.params.id })
        // actions.submitBid({bid:bid, username: state.decoded.username, postId: props.match.params.id})
    }

    return (
        <div style={{ maxWidth: '1600px', margin: '100px auto' }}>
            {console.log(state)}
            <div className="post-title">
                <p>{state.post && state.post.title}</p>
            </div>
            <div className="post-images-box">
                <div className="post-carousel-box">
                    <Carousel dots={true}
                        ref={ref => {
                            slider.current = ref;
                        }}>
                        {state.post && state.post.images.map(img=>{
                            return <div key={img}>
                                    <img width="100%" height="500px" src={img} />
                            </div>
                        })}
                    </Carousel>
                </div>
                <div className="post-preview-boxes row">
                {state.post && state.post.images.map((img,index)=>{
                            return <div key={img} onClick={() => onhover(index)} className="post-preview-img col-md-2-5">
                            <img width="100%" height="100%" src={img} />
                        </div>
                        })}
                </div>
            </div>
            <div className="post-description">
                <Divider orientation="left">Description</Divider>
                <p>
                { state.post && state.post.description}
                </p>
            </div>
            <div className="post-info-box">
                <Divider>Post information</Divider>
                <div className="row">
                    <div className="col-4">
                    <p>Seller: Ali hd  <MailOutlined /></p>
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
                        <div style={{width:'170px', margin:'0 auto', paddingTop:'6px'}}>
                        <div>
                        <p className="bid-elem">zerogravity: </p>
                        <span style={{float:'right'}} >200SAR</span>
                        </div>
                        

                        </div>
                    </div>
                    </div>
                    <div className="views-stat col-4 text-right">
                        <p style={{marginBottom:'3px'}}>Views</p>
                        <EyeOutlined style={{marginBottom:'15px'}} /> {state.post && state.post.views}
                        <p style={{marginBottom:'3px'}}>Like</p>
                        <LikeOutlined style={{cursor:'pointer'}} onClick={()=>actions.likePost(props.match.params.id)} /> {state.post && state.post.likes}
                        {/* <Statistic className="views-stat" title="Views" value={23} prefix={<EyeOutlined />} />
                        <Statistic className="views-stat mr-3" title="Likes" value={3} prefix={<EyeOutlined />} /> */}
                    </div>
                </div>
            </div>
            <div className="post-comments-box">
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
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
        </div>
    )
}

export default withRouter(PostPage) 