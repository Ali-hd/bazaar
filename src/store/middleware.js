import types from './typeActions'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import {API_URL} from '../config'
import { message } from 'antd'

export const token = () => {
    if(localStorage.getItem('token')){
        return localStorage.getItem('token')
    }else if(sessionStorage.getItem("token")){
        return sessionStorage.getItem("token")
    }else{
        return null
    }
}

export const applyMiddleware = dispatch => action => {
    switch (action.type){
        case types.LOGIN:
            return axios.post(`${API_URL}/auth/login`, action.payload)
            .then(res=>dispatch({
                type: types.LOGIN_SUCCESS,
                payload: res.data, rememberMe: action.payload.remember }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.REGISTER:
            return axios.post(`${API_URL}/auth/register`, action.payload)
            .then(res=>dispatch({
                type: types.REGISTER_SUCCESS,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.GET_POSTS:
            return axios.get(`${API_URL}/post/`, action.payload)
            .then(res=>dispatch({
                type: types.GET_POSTS_SUCCESS,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.SELL_POST:
            return axios.post(`${API_URL}/post/create`, action.payload, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>dispatch({
                type: types.SELL_POST_SUCCESS,
                payload: res.data }), console.log('sold post'))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.GET_USER:
            return axios.get(`${API_URL}/user/${action.payload}`)
            .then(res=>dispatch({
                type: types.GET_USER,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            })) 
        case types.GET_SINGLE_POST:
            return axios.get(`${API_URL}/post/${action.payload.postId}`)
            .then(res=>dispatch({
                type: types.GET_SINGLE_POST,
                payload: res.data,
                func: action.payload.func}))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            })) 
        case types.POST_COMMENT:
            return axios.post(`${API_URL}/post/${action.payload.comment.postId}/comment`, action.payload.comment, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>dispatch({
                type: types.POST_COMMENT,
                payload: action.payload.comment,
                func: action.payload.func }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            })) 
        case types.LIKE_POST:
            return axios.post(`${API_URL}/post/${action.payload}/like`,action.payload, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>dispatch({
                type: types.LIKE_POST,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            })) 
        case types.EDIT_PROFILE_PICTURE:
            return axios.put(`${API_URL}/user/${action.payload.userId}`,action.payload, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>dispatch({
                type: types.EDIT_PROFILE_PICTURE,
                payload: action.payload }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            })) 
        case types.CHANGE_PASSWORD:
            console.log(action.payload)
            return axios.post(`${API_URL}/auth/${action.payload.userId}`,action.payload.values, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>{
                action.payload.func()
                message.success(res.data.msg)
            })
            .catch(err=>message.error(err.response.data.msg)) 
        case types.EDIT_PROFILE:
            return axios.put(`${API_URL}/user/${action.payload.userId}`,action.payload.values, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>dispatch({
                type: types.EDIT_PROFILE,
                payload: action.payload }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))  
        case types.SEARCH_ON_CHANGE: 
            return axios.post(`${API_URL}/post/search`,{search: action.payload})
            .then(res=>dispatch({
                type: types.SEARCH_ON_CHANGE,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))  
        default: dispatch(action)
    }
}
