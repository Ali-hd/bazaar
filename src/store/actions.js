import types from './typeActions'
import jwt from 'jsonwebtoken'

//actions will go through the middleware first them from there you can dispatch other actions to the reducers
export const useActions = (state, dispatch) => ({
    loginUser: data => {
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.LOGIN, payload: data})
    },
    logout: data => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        window.location.reload()
    },
    getUser: data => {
        dispatch({type: types.SET_STATE, payload: {loadingUserPage: true}})
        dispatch({type: types.GET_USER, payload: data})
    },
    userActions: data => {
        if(data.type === "alert close"){
            dispatch({type: types.SET_STATE, payload: {msg: ''}})
        }
    },
    registerUser: data => {
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.REGISTER, payload: data})
    },
    getPosts: data => {
        dispatch({type: types.SET_STATE, payload: {loadingPosts: true}})
        dispatch({type: types.GET_POSTS, payload: data})
    },
    sellPost: (data, func) => {
        console.log(func)
        dispatch({type: types.SET_STATE, payload: {loading: true}})
        dispatch({type: types.SELL_POST, payload: data, func: func})
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
    },
    submitBid: data => {
        dispatch({type: types.SUBMIT_BID, payload: data})
    },
    editProfilePic: data => {
        dispatch({type: types.EDIT_PROFILE_PICTURE, payload: data})
    },
    changePassword: data => {
        console.log(data)
        dispatch({type: types.CHANGE_PASSWORD, payload: data})
    },
    editProfile: data => {
        dispatch({type: types.EDIT_PROFILE, payload: data})
    },
    searchOnChange: data => {
        dispatch({type: types.SEARCH_ON_CHANGE, payload: data})
    },
    checkUsername: data => {
        dispatch({type: types.SET_STATE, payload: {checkingUsername: true}})
        dispatch({type: types.CHECK_USERNAME, payload: data})
    },
    rateUser: data => {
        dispatch({type: types.RATE_USER, payload: data})
    },
})