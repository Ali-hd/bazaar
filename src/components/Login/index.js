import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './style.scss'

const LoginPage = (props) => {
   const { state, actions } = useContext(StoreContext)    

   const onFinish = values => {
      actions.loginUser(values)
   };

   const handleClose = () => {
      actions.userActions({type: 'alert close'})
   }

   return (
      <div>
         {state.status == "logged in" && <Redirect to="/"/>}
         <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
         >
         {state.msg == 'Incorrect email or password' ? (
        <Alert className="login-input" style={{ marginBottom: '13px'}} message="Username, Email or Password incorrect" type="error" closable afterClose={handleClose} />
         ) : null}
            <Form.Item
               name="email"
               rules={[{ required: true, message: 'Please enter your Username/Email' }]}
            >
               <Input
                  className="login-input"
                  prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username or Email" />
            </Form.Item>

            <Form.Item
               name="password"
               rules={[{ required: true, message: 'Please enter your Password' }]}
            >
               <Input
                  className="login-input"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
               />
            </Form.Item>

            <Form.Item style={{ marginBottom: '13px' }}>
               <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
               </Form.Item>
               <Link className="login-form-forgot" to="/register">Forgot password</Link>
            </Form.Item>

            <Form.Item>
               <Button style={{ marginBottom: '5px' }} type="primary" htmlType="submit" className="login-form-button">
                  Log in
            </Button>
            Or <Link to="/register">register now!</Link>
            </Form.Item>
         </Form>
      </div>
   )
}
export default withRouter(LoginPage)