import types from './typeActions'
import jwt from 'jsonwebtoken'

//actions will go through the middleware first them from there you can dispatch other actions to the reducers
export const useActions = (state, dispatch) => ({
    loginUser: data => {
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.LOGIN, payload: data})
    },
    logout: data => {
        dispatch({type: types.SET_STATE, payload: {session: false, decoded: null, user: null, status: '', alert: null, error: false}})
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
    },
    getUser: data => {
        console.log('get user middlewear')
        dispatch({type: types.SET_STATE, payload: {loadingUserPage: true}})
        dispatch({type: types.GET_USER, payload: data})
    },
    userActions: data => {
        if(data.type === "alert close"){
            dispatch({type: types.SET_STATE, payload: {alert: null}})
        }
    },
    registerUser: data => {
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.REGISTER, payload: data})
    },
    getPosts: data => {
        console.log('getting posts')
        dispatch({type: types.SET_STATE, payload: {loadingPosts: true}})
        dispatch({type: types.GET_POSTS})
    },
    sellPost: data => {
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.SELL_POST, payload: data})
    },
    verifyToken: data => {
        jwt.verify(localStorage.getItem('token') || sessionStorage.getItem('token'), process.env.REACT_APP_JWT_SECRET, function (err, decoded) {
            if (err) {  dispatch({type: types.SET_STATE, payload: {session: false, decoded: decoded}})  }
            else {  dispatch({type: types.SET_STATE, payload: {session: true, decoded: decoded}})  }
        });
    },
    getSinglePost: data => {
        console.log(data)
        dispatch({type: types.GET_SINGLE_POST, payload: data})

    },
    postComment: data => {
        dispatch({type: types.POST_COMMENT, payload: data})
    },
    likePost: data => {
        dispatch({type: types.LIKE_POST, payload: data})
    }
})