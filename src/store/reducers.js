import type from './typeActions'
import { Redirect } from 'react-router-dom'

const initialState = {
    loading: false,
    error: false,
    user: null,
    status: '',
    alert: null

}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SET_STATE:
            console.log('reducer login user')
            return {...state, ...action.payload }
        case type.LOGIN_SUCCESS:
            sessionStorage.setItem("token", action.payload.token)
            console.log('login success')
            console.log(action.payload)
            return {...state, ...action.payload, status: 'logged in', loading: false, error: false}
        case type.ERROR:
            return {...state, loading: false, error: true, alert: true}
        default:
            return state
    }
  }

export { initialState, reducer }