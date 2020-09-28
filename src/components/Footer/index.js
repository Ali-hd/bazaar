import React from 'react'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function index() {
    return (
        <div className="footer-wrapper">
            <span>Made by Ali-hd - <a href="https://github.com/Ali-hd" rel="noopner" target="_blank"><FontAwesomeIcon style={{fontSize:'1.2rem'}} icon={['fab', 'github']} /></a></span>
        </div>
    )
}
