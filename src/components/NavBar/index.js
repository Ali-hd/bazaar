import React, { useState, useEffect, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom';
import { StoreContext } from '../../store/store'
import './style.scss'
import { Menu, Layout, Button, Drawer, Input } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import jwt from 'jsonwebtoken'
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Search } = Input;

const LeftMenu = () => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link to="/">
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
          <Link to="/sell">Sell</Link>
        </Menu.Item>
        <Menu.Item key="messages">
          <Link to="/messages">Messages</Link>
        </Menu.Item>
      </Menu>
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
      let history = true
    });
    !ran && state.account == null ? actions.verifyToken('get account') : actions.verifyToken()
  }, [])


  const logout = () => {
    actions.logout()
  }
  
  const showDrawer = () => { setVisible(true) }
  const onClose = () => { setVisible(false) }
  return (
    <nav className="menuBar">
      <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
        <div className="logo">
          <Link style={{paddingTop:'13px'}} to="/">
            <img width="100%" height="100%" alt="logo" src="https://i.imgur.com/CFZCrt4.png"/>
          </Link>
        </div>
        <div className="menuCon">
          <div className="leftMenu">
            {LeftMenu()}
          </div>
          {/* <div>
          <Search
            className="searchInput"
            placeholder="input search text"
            enterButton="search"
            size="large"
            onSearch={value => console.log(value)}
        />
          </div> */}
          <div className="rightMenu">
          {state.session ?
              <Menu mode="horizontal">
                  <SubMenu style={{marginTop:4}} title={<span>Account</span>}>
                  <Menu.ItemGroup key="username" title={state.decoded.username}>
                    <Menu.Item key="profile_menu">
                      <Link to={"/user/"+state.decoded.username}>
                      My profile
                      </Link>
                      </Menu.Item>
                      <Menu.Item onClick={logout} key="setting:2">Logout</Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
              :
              <Menu mode="horizontal">
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
          <Button className="barsMenu" type="primary" onClick={showDrawer}>
            <span className="barsBtn"></span>
          </Button>
          <Drawer
            //   title="Basic Drawer"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
            {LeftMenu()}
            <Menu mode="vertical">
              <Menu.Item key="mail">
                    <Link to="/login">
                    Login
                    </Link>
              </Menu.Item>
              <Menu.Item key="app">
                    <Link to="/register">
                    Register
                    </Link>
              </Menu.Item>
            </Menu>
          </Drawer>
        </div>
      </div>
    </nav>
  )

}

export default withRouter(NavBar)
