import type from './typeActions'
import { Redirect } from 'react-router-dom'
import {message} from 'antd'

const initialState = {
    session: false,
    decoded: null,
    loading: false,
    error: false,
    user: null,
    status: '',
    alert: null,
    loadingPosts: false,
    loadingUserPage: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_STATE:
            console.log('set state reducer')
            return {...state, ...action.payload }
        case type.LOGIN_SUCCESS:
            action.rememberMe? localStorage.setItem("token", action.payload.token) : sessionStorage.setItem("token", action.payload.token)
            console.log('login success')
            console.log(action.payload)
            return {...state, ...action.payload, status: 'logged in', loading: false, error: false}
        case type.REGISTER_SUCCESS:
            return {...state, ...action.payload, status: 'registered', loading: false, error: false}
        case type.ERROR:
            message.error(action.payload.msg);
            console.log(action.payload)
            return {...state, loading: false, error: true, alert: true}
        case type.GET_POSTS_SUCCESS:
            return {...state, ...action.payload, loadingPosts: false}
        case type.SELL_POST_SUCCESS:
            return {...state, ...action.payload, loading: false}
        case type.GET_USER:
            console.log('get user reducer',action.payload)
            return {...state, ...action.payload, loadingUserPage: false}
        default:
            return state
    }
  }

export { initialState, reducer }