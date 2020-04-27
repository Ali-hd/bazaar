import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Upload, message, Divider, Input, Form, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import API_URL from '../../config'
import './style.scss'
const { Dragger } = Upload;
const { TextArea } = Input;

const SellPage = (props) => {
    const { state, actions } = useContext(StoreContext)

    const [files, setFiles] = useState([])
    const [images, setImages] = useState([])

    const settings = {
        name: 'image',
        multiple: true,
        accepts: 'image/png, image/jpeg, image/svg',
        action: `${API_URL}/post/upload`,
        listType: 'picture',
        className: 'upload-list-inline',
        // fileList: files,
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isLt2M;
        }, onChange(info) {
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
        let payload = values
        payload.images = images
        actions.sellPost(payload)
    }

    const showUploadList = { showPreviewIcon: false, showDownloadIcon: false, showRemoveIcon: true }

    return (
        <div className="sell-div">
            {console.log(files)}
            <div>
                <Dragger showUploadList={showUploadList} {...settings}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                </p>
                </Dragger>
                <div className="row">
                    {files.length > 0 && files.map((ele) => {
                        return ele.response && ele.response.imageUrl ?
                            <img className="col-3 mt-2 mb-2 preview-img" key={ele.uid} src={ele.response.imageUrl} /> : null
                    })}
                </div>
                <Divider />
                <Form hideRequiredMark onFinish={onFinish} layout='vertical'>
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
                            rules={[{ required: true, message: 'Please enter your Username/Email' }]}
                        >
                            <Input
                                className="login-input"
                                placeholder="Enter the closest location" />
                        </Form.Item>
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
                    <Form.Item style={{marginTop:'15px'}}>
                    <Button style={{ marginBottom: '5px' }} type="primary" htmlType="submit">
                        sell now
                    </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    )
}

export default withRouter(SellPage)