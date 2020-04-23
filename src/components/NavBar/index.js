import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import './style.scss'
import { Menu, Layout, Button, Drawer, Input} from 'antd';
import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
  } from '@ant-design/icons';
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Search } = Input;

class LeftMenu extends Component {
    render() {
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
          <a href="">Sell</a>
        </Menu.Item>
      </Menu>
            </div>
        )
    }
}

class RightMenu extends Component {
    render(){
        return(
            <div>
                <Menu mode="horizontal">
                <Menu.Item key="mail">
                <Link to="/login">
                  Login
                </Link>
                {/* <a href="">Login</a> */}
                </Menu.Item>
                <Menu.Item key="app">
                <Link to="/register">
                  Register
                </Link>
                </Menu.Item>
                </Menu>
            </div>
        )
    }
}





class NavBar extends Component {

    state = {
        current: 'mail',
        visible: false
      }
      showDrawer = () => {
        this.setState({
          visible: true,
        });
      };
    onClose = () => {
        this.setState({
          visible: false,
        });
      };
    render() {
        return (
            <nav className="menuBar">
              <div className="logo">
                <a href="">logo</a>
              </div>
              <div className="menuCon">
                <div className="leftMenu">
                  <LeftMenu />
                </div>
                <div className="rightMenu">
                    <RightMenu />
                </div>
                <Button className="barsMenu" type="primary" onClick={this.showDrawer}>
                  <span className="barsBtn"></span>
                </Button>
                <Drawer
                //   title="Basic Drawer"
                  placement="right"
                  closable={false}
                  onClose={this.onClose}
                  visible={this.state.visible}
                >
                  <LeftMenu />
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
            </nav>
        )
    }
}

export default NavBar