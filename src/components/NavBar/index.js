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
        <Menu.Item key="mail">
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
        <Menu.Item key="alipay">
          <Link to="/sell">Sell</Link>
        </Menu.Item>
      </Menu>
    </div>
  )
}

const NavBar = ({ history }) => {
  const { state, actions } = useContext(StoreContext)
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    actions.verifyToken()
  }, [])
  
  history.listen((location, action) => {
    actions.verifyToken()
  });

  const logout = () => {
    actions.logout()
  }
  
  const showDrawer = () => { setVisible(true) }
  const onClose = () => { setVisible(false) }
  return (
    <nav className="menuBar">
      <div style={{ maxWidth: '1700px', margin: '0 auto' }}>
        <div className="logo">
          <a href="">logo</a>
        </div>
        <div className="menuCon">
          <div className="leftMenu">
            {LeftMenu()}
          </div>
          <div className="rightMenu">
          {state.session ?
              <Menu mode="horizontal">
                  <SubMenu title={<span>{state.decoded.username}</span>}>
                    <Menu.Item key="profile_menu">
                    <Link to={"/user/"+state.decoded.username}>
                    My profile
                    </Link>
                    </Menu.Item>
                    <Menu.Item onClick={logout} key="setting:2">Logout</Menu.Item>
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
                <a href="">Login</a>
              </Menu.Item>
              <Menu.Item key="app">
                <a href="">Register</a>
              </Menu.Item>
            </Menu>
          </Drawer>
        </div>
      </div>
    </nav>
  )

}

export default withRouter(NavBar)
