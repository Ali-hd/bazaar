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
    singlePost: null,
    post: null
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
            const posts = {posts: action.payload.results}
            return {...state, ...posts, loadingPosts: false}
        case type.SELL_POST_SUCCESS:
            return {...state, ...action.payload, loading: false}
        case type.GET_USER:
            console.log('get user reducer',action.payload)
            return {...state, ...action.payload, loadingUserPage: false}
        case type.GET_SINGLE_POST:
            action.func(action.payload.post.comments)
            console.log(action)
            return{...state,...action.payload}
        case type.POST_COMMENT:
            action.func(action.payload)
            return {...state, ...action.payload}
        case type.LIKE_POST:
            console.log(action.payload)
            let post = state.post
            if(action.payload.msg === "liked"){
                post.likes = post.likes + 1
            }else{ post.likes = post.likes - 1}
            return {...state, ...post }
        default:
            return state
    }
  }

export { initialState, reducer }