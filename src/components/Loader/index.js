import React, { Component } from 'react'
import { Spin } from 'antd';
import './style.scss'

class Loader extends Component {
    render() {
        return (
            <div className="loadingDiv">
                <Spin />
            </div>
        )
    }
}
export default Loader
