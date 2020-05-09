import React, { useContext, useState } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Upload, message, Divider, Input, Form, Button, Select, Result } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {API_URL} from '../../config'
import './style.scss'
const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

const SellPage = (props) => {
    const { state, actions } = useContext(StoreContext)

    const [files, setFiles] = useState([])
    const [images, setImages] = useState([])
    const [sold, setSold] = useState(false)

    const cities = ['Riyadh', 'Qatif', 'Jeddah', 'Makkah', 'Medina', 'Yanbu', 'Hafr Al-Batin', 'Taif', 'Tabuk', 'Buraydah', 'Unaizah', 'Jubail', 'Jizan', 'Al Jawf', 'Hofuf', 'Gurayat', 'Dhahran', 'Bisha', 'Arar', 'Abha']

    const settings = {
        name: 'image',
        multiple: true,
        accepts: 'image/png, image/jpeg, image/svg',
        action: `${API_URL}/post/upload`,
        listType: 'picture',
        className: 'upload-list-inline',
         beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isLt2M;
        },
        // fileList: files,
        onChange(info) {
            if(!state.session){ return message.error('You need to Sign in')}
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info)
                message.success(`${info.file.name} file uploaded successfully.`)
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`)
                setImages([...images, info.file.response.imageUrl])
                setFiles([...files, info.file])
                console.log(info)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinish = values => {
        if(!state.session){ return message.error('You need to Sign in')}
        console.log(values)
        console.log(values.description.match(/\n/g))
        let payload = values
        payload.images = images
        actions.sellPost(payload, soldPost)
    }

    const soldPost = () => {
        setImages([])
        setFiles([])
        setSold(!sold)
    }

    const showUploadList = { showPreviewIcon: false, showDownloadIcon: false, showRemoveIcon: true }

    return (
        <div className="sell-div">
            {console.log(files)}
            {!sold ? 
            <div>
                <Form id="sellForm" hideRequiredMark onFinish={onFinish} layout='vertical'>
                    <div>
                        <Form.Item
                            className="title-form"
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please enter your Username/Email' }]}
                        >
                            <Input
                                className="login-input"
                                placeholder="Enter a title for the item you are selling" />
                        </Form.Item>
                        <Form.Item
                        className="title-form"
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please choose your location' }]}
                        >
                        <Select
                            showSearch
                            placeholder="Select your location"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >   
                            {cities.map(city=>{
                                return <Option key={city} value={city.toLowerCase()}>{city}</Option>
                            })}
                        </Select>
                        </Form.Item>
                        {/* <Form.Item
                            className="title-form"
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter your Username/Email' }]}
                        >
                            <Input
                                className="login-input"
                                placeholder="Enter the closest location" />
                        </Form.Item> */}
                    </div>

                    <Form.Item
                        className="title-form"
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a decription' }]}
                    >
                        <TextArea
                            autoSize={{ minRows: 3, maxRows: 10 }}
                            placeholder="Enter your description here" />
                    </Form.Item>
                </Form>

                <Dragger style={{marginTop:'15px'}} showUploadList={showUploadList} {...settings}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Only allowed 4 images ( jpg - png ), 2MB max per image
                    </p>
                    </Dragger>
                        {files.length > 0 && files.map((ele) => {
                            return ele.response && ele.response.imageUrl ?
                            <div className="row uploaded-image-frame">
                                <img className="uploaded-image" key={ele.uid} src={ele.response.imageUrl} />
                            </div> : null
                        })}
                    {/* <img className="col-3 mt-2 mb-2 preview-img" key={ele.uid} src={ele.response.imageUrl} /> */}
                    <Divider />

                    <Button form="sellForm" style={{ marginBottom: '5px' }} type="primary" htmlType="submit">
                        sell now
                    </Button>
                
            </div> : 
            <Result
            status="success"
            title="Successfully Listed Your Posted"
            // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
            <Link key="home" to="/">
              <Button type="primary" >
                Go Home
              </Button></Link>,
              <Button onClick={soldPost} key="sell">Sell something else</Button>,
            ]}
          />}
        </div>
    )
}



export default withRouter(SellPage)