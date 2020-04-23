import types from './typeActions'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

export const applyMiddleware = dispatch => action => {
    switch (action.type){
        case types.LOGIN:
            console.log(action.payload)
            return axios.post('http://127.0.0.1:5000/auth/login', action.payload)
            .then(res=>dispatch({
                type: types.LOGIN_SUCCESS,
                payload: res.data }))
            .catch(err=>dispatch({
                type: types.ERROR,
                payload: err
            }))
        default: dispatch(action)
    }
}
