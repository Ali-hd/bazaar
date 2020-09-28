import React, { useContext } from 'react'
import { StoreContext } from '../../store/store'
import { Form,Input,Tooltip,Select,Checkbox,Button} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { withRouter, Redirect } from 'react-router-dom';
import './style.scss'
  
  const { Option } = Select;

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 80,
        }}
      >
        <Option value="966">+966</Option>
        <Option value="967">+967</Option>
      </Select>
    </Form.Item>
  );

  const RegisterPage = (props) => {
    const { state, actions } = useContext(StoreContext)
           
    const onFinish = values => {
      if(state.usernameAvailable)
       actions.registerUser(values)
    };

    const checkUsername = e => {
      if(e.target.value.length>0)
      actions.checkUsername(e.target.value)
    }

 
    return (
       <div>
         {state.status === "registered" && <Redirect to="/login"/>}
          <Form className="register-form"
                    layout={'vertical'}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                        prefix: '966',
                    }}
                    scrollToFirstError
                    >

                    <Form.Item
                        name="username"
                        hasFeedback
                        validateStatus={state.checkingUsername? "validating" : state.usernameAvailable ? 'success' : 'error'}
                        help={!state.usernameAvailable && "username already exist"}
                        label={
                        <span>
                            Username&nbsp;
                            <Tooltip title="This name will be visible to everyone!">
                            <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        rules={[
                        {
                            required: true,
                            message: 'Please enter your username!',
                            whitespace: true,
                        },
                        ]}
                    >
                        <Input onChange={checkUsername} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                        {
                            type: 'email',
                            message: 'This is not a valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please enter your E-mail!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                        {
                            required: true,
                            message: 'Please enter your password!',
                        },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[
                        {
                            required: true,
                            message: 'Please enter your phone number!',
                        },
                        ]}
                    >
                        <Input
                        addonBefore={prefixSelector}
                        style={{
                            width: '100%',
                        }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                        {
                            validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                        },
                        ]}
                    >
                        <Checkbox>
                        I have read the <a href="#">agreement</a>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Register
                        </Button>
                    </Form.Item>
                    </Form>
       </div>
    )
 }
export default withRouter(RegisterPage)

