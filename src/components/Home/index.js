import React, { useEffect, useState, useContext } from 'react'
import { Input, Button, Avatar, Badge, Tabs, Select, Divider } from 'antd'
import { BarsOutlined } from '@ant-design/icons';
import './style.scss'
import { withRouter, Link } from 'react-router-dom'
import { StoreContext } from '../../store/store'
import Loader from '../Loader'
import moment from 'moment'

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const cities = ['All', 'Riyadh', 'Jeddah', 'Makkah', 'Medina', 'Qatif', 'Yanbu', 'Hafr Al-Batin', 'Taif', 'Tabuk', 'Buraydah', 'Unaizah', 'Jubail', 'Jizan', 'Al Jawf', 'Hofuf', 'Gurayat', 'Dhahran', 'Bisha', 'Arar', 'Abha']
const Home = (props) => {

    const { state, actions } = useContext(StoreContext)
    const [page, setPage] = useState(1)
    const [city, setCity] = useState('all')
    const [last, setLast] = useState('a-t')
    const [boxes, setBoxes] = useState(false)

    useEffect(() => {
         actions.getPosts({ page: '1', city: 'all', time: last })
    }, [])

    const showmore = () => {
        console.log('show more')
        setPage(page + 1)
        actions.getPosts({ page: page + 1, city: city, time: last })
    }

    const changeCity = e => {
        actions.getPosts({ page: 1, city: e, time: last })
        setCity(e)
        setPage(1)
    }

    const changeTime = e => {
        setLast(e)
        setPage(1)
        actions.getPosts({ page: 1, city: city, time: e })
    }

    const searchOnChange = e => {
        actions.searchOnChange({ search: e.target.value, city: city, time: last })
    }

    const toggleShape = () => {
        setBoxes(!boxes)
    }

    return (

        <div>
            <div style={{ margin: '0 auto', maxWidth: '1000px' }} className="col-lg-10 text-center">
                {console.log(state)}
                <Tabs animated={false} onTabClick={changeCity} defaultActiveKey={city} tabPosition={'top'} style={{ height: 50 }}>
                    {cities.map(i => (
                        <TabPane tab={i} key={i.toLowerCase()}>

                        </TabPane>
                    ))}
                </Tabs>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Search
                            style={{ width: '100%' }}
                            className="searchInput"
                            placeholder="search for anything"
                            loading={state.loadingPosts}
                            enterButton="search"
                            size="default"
                            onChange={searchOnChange}
                            onSearch={value => console.log(value)}
                        />
                </div>
            </div>
        <div className="all-posts-border">
            
        <div className="row pl-3 pr-3 pt-5 pb-5 all-posts-div">
                <span onClick={toggleShape} className="views-box"> <BarsOutlined style={{ fontSize: '30px', color: boxes ? '#1890ff' : '' }} /></span>
                <Select className="date-box" size="default" onChange={changeTime} defaultValue="all time" style={{ display: 'inline-block', textAlign: 'start' }}>
                            <Option value="l-d">last 24 hrs</Option>
                            <Option value="l-w">last 7 days</Option>
                            <Option value="l-m">last month</Option>
                            <Option value="l-q">last 3 months</Option>
                            <Option value="a-t">All time</Option>
                        </Select>
                {!boxes ?
                    state.posts && state.posts.length > 0 ? state.posts.map((post) => {
                            return <div key={post._id} className="col-md-4 pt-4 col-lg-3 col-sm-6">
                                <div className="post-box">
                                    <div className="image-box">
                                        <Badge title="views" showZero overflowCount={999} count={post.views}>
                                            <Link to={`/post/${post._id}`}>
                                                <img className="post-box-image" alt="post img" onError={(e) => { e.target.onerror = null; e.target.src = "https://i.imgur.com/lpm3KS3.png" }} src={post.images[0]} />
                                            </Link>
                                        </Badge>
                                        {/* <sup data-show="true" class="ant-scroll-number ant-badge-count ant-badge-multiple-words" title="27"> <span>JED</span></sup> */}
                                    </div>
                                    <div className="row pt-1">
                                        <div className="title-box col-8">
                                            <div className="main-title-box"><span>{post.title.length > 30 ? post.title.slice(0, 30) + ".." : post.title}</span></div>
                                            <div className="main-subTitle-box"><span>{post.location}</span></div>
                                        </div>
                                        <div className="col-3 pt-1 pb-3">
                                            <Link to={`/user/${post.user.username}`}>
                                                <Avatar style={{ float: 'right' }} size={40} src={post.user.profileImg} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }) : state.posts && state.posts.length < 1 ? <div className="no-results"> no results :( </div> : <Loader /> : 

                            state.posts && state.posts.length > 0 ? state.posts.map((post) => { 
                                return <Link to={`/post/${post._id}`} className="horizontal-post-box" key={post._id}>
                                <div className="horizontal-post-img" >
                                    <img width="105px" height="105px" src={post.images[0]} />
                                </div>
                                <div className="horizontal-post">
                                    <h6 style={{textOverflow:'ellipsis', wordWrap:'break-word', overflow:'hidden', whiteSpace:'nowrap', height:'1.6rem', marginBottom:'5px'}}>{post.title}</h6>
                                    <div style={{ display:'inline-block', width:'50%'}}>
                                        <p>{post.location}</p>
                                        <p >views: {post.views}</p>
                                    </div>
                                    <div style={{display:'inline-block'}}>
                                        <p>{post.user.username}</p>
                                        <p>{moment(post.createdAt).fromNow()}</p>
                                    </div>
                                </div>
                        </Link> 
                            }) : state.posts && state.posts.length < 1 ? <div className="no-results"> no results :( </div> : <Loader /> }
            </div>
        </div>
            {state.more_posts && state.posts.length >= 16 ? <Button loading={state.loadingPosts} onClick={showmore} style={{ margin: '0 auto 100px auto', display: 'flex', }}>show more</Button> : null}

        </div>
    )

}

export default withRouter(Home)

