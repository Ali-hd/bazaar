import types from './typeActions'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

const token = () => {
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
            return axios.post('http://127.0.0.1:5000/auth/login', action.payload)
            .then(res=>dispatch({
                type: types.LOGIN_SUCCESS,
                payload: res.data, rememberMe: action.payload.remember }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.REGISTER:
            return axios.post('http://127.0.0.1:5000/auth/register', action.payload)
            .then(res=>dispatch({
                type: types.REGISTER_SUCCESS,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.GET_POSTS:
            return axios.get('http://127.0.0.1:5000/post/', action.payload)
            .then(res=>dispatch({
                type: types.GET_POSTS_SUCCESS,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.SELL_POST:
            return axios.post('http://127.0.0.1:5000/post/create', action.payload, { headers: { Authorization: `Bearer ${token()}` } })
            .then(res=>dispatch({
                type: types.SELL_POST_SUCCESS,
                payload: res.data }), console.log('sold post'))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            }))
        case types.GET_USER:
            return axios.get(`http://127.0.0.1:5000/user/${action.payload}`)
            .then(res=>dispatch({
                type: types.GET_USER,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err.response.data
            })) 
        default: dispatch(action)
    }
}

export default token