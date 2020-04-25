import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { Form,Input,Tooltip,Cascader,Select,Row,Col,Checkbox,Button,AutoComplete} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { withRouter, Link, Redirect } from 'react-router-dom';
import './style.scss'
  
  const { Option } = Select;
  const AutoCompleteOption = AutoComplete.Option;

  const residences = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ];

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
          
    // const [error, setError] = useState(state.error)
 
    const onFinish = values => {
       actions.registerUser(values)
       console.log('Received values of form: ', values);
    };
 
    // const handleClose = () => {
    //    actions.userActions({type: 'alert close'})
    // }
 
    return (
       <div>
         {state.status == "registered" && <Redirect to="/login"/>}
          <Form className="register-form"
                style={{maxWidth:'700px', margin: '5% auto', paddingLeft:'20px', paddingRight:'20px'}}
                    layout={'vertical'}
                    // form={form}
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
                        <Input />
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

                    {/* <Form.Item
                        name="residence"
                        label="Habitual Residence"
                        rules={[
                        {
                            type: 'array',
                            required: true,
                            message: 'Please select your habitual residence!',
                        },
                        ]}
                    >
                        <Cascader options={residences} />
                    </Form.Item> */}

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

                    {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                        <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                            name="captcha"
                            noStyle
                            rules={[
                                {
                                required: true,
                                message: 'Please input the captcha you got!',
                                },
                            ]}
                            >
                            <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button>Get captcha</Button>
                        </Col>
                        </Row>
                    </Form.Item> */}

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
                        I have read the <a href="">agreement</a>
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

