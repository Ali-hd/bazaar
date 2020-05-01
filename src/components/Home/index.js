import React, { useEffect, useState, useContext } from 'react'
import { Input, Button, Card, Avatar, Badge, Tabs} from 'antd'
import './style.scss'
import { withRouter, Link } from 'react-router-dom'
import {StoreContext} from '../../store/store'
import Loader from '../Loader'

const { Search } = Input;
const { TabPane } = Tabs;
// const { Meta } = Card;
const cities = ['All', 'Riyadh', 'Jeddah', 'Makkah', 'Medina','Qatif', 'Yanbu', 'Hafr Al-Batin', 'Taif', 'Tabuk', 'Buraydah', 'Unaizah', 'Jubail', 'Jizan', 'Al Jawf', 'Hofuf', 'Gurayat', 'Dhahran', 'Bisha', 'Arar', 'Abha']
const Home = () => {
    const { state, actions } = useContext(StoreContext)
    const [page, setPage] = useState(1)

    useEffect(() => {
        !state.posts && actions.getPosts('1')
    }, [])

    const showmore = () => {
        console.log('show more')
        setPage(page + 1)
        actions.getPosts(page + 1)
    }

    const searchOnChange = e => {
        actions.searchOnChange(e.target.value)
    }

    return (<div><div style={{ margin: '0 auto', maxWidth: '1000px' }} className="col-lg-10 text-center">
        {console.log(state)}
        <Tabs defaultActiveKey="1" tabPosition={'top'} style={{ height: 50 }}>
          {cities.map(i => (
            <TabPane tab={i} key={i}>
              
            </TabPane>
          ))}
        </Tabs>
        <div style={{maxWidth:'500px', margin:'0 auto'}}>
        <Search
            style={{width:'300'}}
            className="searchInput"
            placeholder="input search text"
            enterButton="search"
            size="large"
            onChange={searchOnChange}
            onSearch={value => console.log(value)}
        />
        </div>
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
                        {/* <span className="views-box"> views 200</span> */}
                        <Badge showZero overflowCount={999} count={post.views}>
                        <Link to={`/post/${post._id}`}>
                            <img className="post-box-image" alt="post img" onError={(e)=>{e.target.onerror = null; e.target.src="https://i.imgur.com/lpm3KS3.png"}} src={post.images[0]} />
                        </Link>
                        </Badge>
                        {/* <sup data-show="true" class="ant-scroll-number ant-badge-count ant-badge-multiple-words" title="27"> <span>JED</span></sup> */}
                    </div>
                    <div className="row pt-1">
                        <div className="title-box col-8">
                            <div className="main-title-box"><span>{post.title.length>30 ? post.title.slice(0,30)+".." : post.title}</span></div>
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

        {state.more_posts ? <Button onClick={showmore} style={{margin:'100px auto 100px auto', display:'flex', }}>show more</Button> : null}
    </div>
    )

}

export default withRouter(Home)

