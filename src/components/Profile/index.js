import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Tabs, Divider } from 'antd'
import './style.scss'
const { TabPane } = Tabs;


const ProfilePage = (props) => {
    const { state, actions } = useContext(StoreContext)
    const [activeTab, setActiveTab] = useState('1')

    useEffect(() => {
        actions.getUser(props.match.params.username)
        console.log(props)
    }, [])

    if (activeTab == 3) {
        console.log('active tab 3')
        console.log(state)
    }

    const changeTab = activeKey => { setActiveTab(activeKey) }

    return (
        <div className="row" style={{ maxWidth: '1170px', margin: '100px auto' }}>
            <div className="col-12 profile-info-box">
                <div className="row">
                    <div className="col-md-5 col-xs-12">
                        <div className="row">
                            <div className="col profile-img-box float-left" style={{ width: '166px', height: '166px' }}>
                                <img width="166px" height="100%" src={state.user && state.user.profileImg} />
                            </div>
                            <div className="col" style={{ marginLeft: '18px' }}>
                                <p style={{ fontSize: '30px' }}>{state.user && state.user.username}</p>
                                <p> Member since:</p>
                                <p> 20 March 2020</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 col-xs-12">
                        <div className="col">
                            <div className="row mt-2 text-center">
                                <div className="col-6">
                                    Followers: 123
                            </div>
                                <div className="col-6">
                                    Following: 23
                            </div>
                            </div>
                            <div className="row">
                                <Divider orientation="left">Bio</Divider>
                                <p>bortis, consectetur nostrum! Temporibus placerat duis adipisicing congue error sunt officiis? Cumque incidunt, litora iaculis nobis fames rem urna aenean nascetur duis condimentum. Voluptatibus mattis repellat augue, fermentum quas, tempus r</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="col-12 profile-stats-box">
                <Tabs activeKey={activeTab} onChange={changeTab} type="card">
                    <TabPane tab="Posts" key="1">
                        <div>
                        {state.user ? state.user.posts.map(p=>{
                           return <div key={p._id} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'inline-block', width: '120px', height: '120px' }}>
                                    <img src={p.images[0]} width="100%" height="100%" />
                                </div>
                                <div style={{ display: 'inline-block', marginLeft: '10px', height: '120px', verticalAlign: 'middle' }}>
                                    <h5>{p.title}</h5>
                                    <h6>{p.description}</h6>
                                    <p className="mb-1">{p.createdAt}</p>
                                    <p>Comments(23)</p>
                                </div>
                            </div>
                        }): <h6>Nothing here</h6>}
                        </div>
                    </TabPane>
                    <TabPane tab="Ratings" key="2">
                        Content of card tab 2
            </TabPane>
                    <TabPane tab="Watch Later" key="3">
                        Content of card tab 3
            </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default withRouter(ProfilePage)

