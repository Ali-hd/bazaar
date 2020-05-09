import React, { useState, useEffect, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { StoreContext } from '../../store/store'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Button, Drawer, Input, Divider, notification } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Search } = Input;

const LeftMenu = postion => {
  const { state } = useContext(StoreContext)
  return (
    <div>
      <Menu mode={postion}>
        <Menu.Item key="home">
          <Link to="/">
            {/* <span style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', verticalAlign:'middle'}}>
                <FontAwesomeIcon style={{fontSize:'1.3rem'}} icon={['fas', 'home']} /> 
              <span style={{marginTop:'-7px'}}>Home</span>
            </span> */}
            Home
        </Link>
        </Menu.Item>
              {/* <SubMenu title={<span>Blogs</span>}>
        <MenuItemGroup title="Item 1">
          <Menu.Item key="setting:1">Option 1</Menu.Item>
          <Menu.Item key="setting:2">Option 2</Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup title="Item 2">
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </MenuItemGroup>
      </SubMenu> */}
        <Menu.Item key="sell">
        <Link to="/sell">
            {/* <span style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', verticalAlign:'middle'}}>
                <FontAwesomeIcon style={{fontSize:'1.3rem'}} icon={['fas', 'sitemap']} /> 
              <span style={{marginTop:'-7px'}}>Sell</span>
            </span> */}
            Sell
        </Link>
        </Menu.Item>
        {state.session ?
        <Menu.Item key="inbox">
          <Link to="/inbox">Inbox</Link>
        </Menu.Item> : null }
        {state.session ?
        <SubMenu style={{marginTop:4}} title={<span><span><FontAwesomeIcon style={{fontSize:'1.1rem'}} icon={['far', 'bell']} /></span>{state.account && state.account.notifications.length>0 ? <span className="bell-menu">+{+ state.account.notifications.length}</span> : ''}</span>}>
              {state.account && state.account.notifications.length>0 ? state.account.notifications.map(n=>{
                  return <Menu.Item key={n.from}>
                  <Link to={"/inbox"}>
                  {n.from}: {n.description.slice(0,20)}{n.description.length>20 && '..'}
                  </Link>
                  </Menu.Item>
                }):<Menu.Item>no new notifications</Menu.Item>}
            
      </SubMenu>: null }
      </Menu>
    </div>
  )
}

const RightMenu = postion => {
  const { state, actions } = useContext(StoreContext)
  
  const logout = () => {
    actions.logout()
  }
  return (
    <div>
      {state.session ?
              <Menu mode={postion}>
                  {postion === 'horizontal' ? 
                  <SubMenu style={{marginTop:4}} title={<span>Account</span>}>
                  <Menu.ItemGroup key="username" title={state.decoded.username}>
                    <Menu.Item key="profile_menu">
                      <Link to={"/user/"+state.decoded.username}>
                      My profile
                      </Link>
                      </Menu.Item>
                      <Menu.Item onClick={logout} key="setting:2">Logout</Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu> : 
                <Menu.ItemGroup key="username" title={state.decoded.username}>
                <Menu.Item key="profile_menu">
                  <Link to={"/user/"+state.decoded.username}>
                  My profile
                  </Link>
                  </Menu.Item>
                  <Menu.Item onClick={logout} key="setting:2">Logout</Menu.Item>
              </Menu.ItemGroup> }     
              </Menu>
              :
              <Menu mode={postion}>
                <Menu.Item key="login">
                  <Link to="/login">
                    Login
                    </Link>
                </Menu.Item>
                <Menu.Item key="register">
                  <Link to="/register">
                    Register
                    </Link>
                </Menu.Item>
              </Menu>
            }
    </div>
  )
}

const NavBar = ({ history }) => {
  const { state, actions } = useContext(StoreContext)
  const [visible, setVisible] = useState(false)

  useEffect(()=>{  
    let ran = false
    history.listen((location, action) => {
      state.account == null ? actions.verifyToken('get account') : actions.verifyToken()
      onClose()
    });
    !ran && state.account == null ? actions.verifyToken('get account') : actions.verifyToken()
  }, [])

  
  const showDrawer = () => { setVisible(true) }
  const onClose = () => { setVisible(false) }
  return (
    <div>
            <nav className="menuBar">
                <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
                  <div className="logo">
                    <Link to="/">
                      <img width="100%" height="100%" alt="logo" src="https://i.imgur.com/CFZCrt4.png"/>
                    </Link>
                  </div>
                  <div className="menuCon">
                    <div className="leftMenu">
                      {LeftMenu('horizontal')}
                    </div>
                    <div className="rightMenu">
                    {RightMenu('horizontal')}
                    </div>
                    <Button className="barsMenu" onClick={showDrawer}>
                      <span className="barsBtn"></span>
                    </Button>
                    <Drawer
                      //   title="Basic Drawer"
                      placement="right"
                      closable={false}
                      onClose={onClose}
                      visible={visible}
                    >
                      {LeftMenu('vertical')}
                      <Menu>
                        <Menu.Divider/>
                      </Menu>
                      {RightMenu('vertical')}
                    </Drawer>
                  </div>
                </div>
              </nav>
              {/* <nav className="navbar-side">
            <div className="nav-content-side">
                <span className="nav-item-side">
                  sheertiko
                </span>
                <span className="nav-item-side">
                  Login
                </span>
                <span className="nav-item-side">
                  Logout
                </span>
            </div>
          </nav> */}
          {/* <nav className="nav-bar">
            <div className="nav-content">
              <div className="left-menu">
                    <Link className="nav-logo">bazaar</Link>
                  <span className="nav-item">
                    Home
                  </span>
                  <span className="nav-item">
                    Sell
                  </span>
              </div>
              <div className="right-menu">
                  <span className="nav-item">
                    Login
                  </span>
                  <span className="nav-item">
                    Register
                  </span>
                  <span className="side-nav-btn">
                    <FontAwesomeIcon icon={['fas', 'bars']} />
                  </span>
              </div>
            </div>
          </nav> */}
          
    </div>
    
  )

}

export default withRouter(NavBar)
